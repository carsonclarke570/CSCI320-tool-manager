from flask import request, jsonify
from flask_restx import Namespace, Resource

from src.models import db
from src.models.category import Category, CategorySchema
from src.models.falls_under import FallsUnder, FallsUnderSchema
from src.models.borrows import Borrows, BorrowsSchema
from src.models.tool import Tool, ToolSchema
from src.routes.base import Response

api = Namespace('categories', description='CRUD+F Endpoints for Category models')

@api.route('/')
class UsersRoute(Resource):

    @api.doc('list_users')
    def get(self):
        return Category.filter(CategorySchema, Category, request)


@api.route('/<int:id>/')
class UserRoute(Resource):
    
    @api.doc('get_user')
    def get(self, id):
        return Category.read(CategorySchema, Category, request, id)

@api.route('/list/<int:cat_id>/')
class CatToolsRoute(Resource):
    
    def get(self, cat_id):
        n = int(request.args.get('n', 20))
        p = int(request.args.get('p', 1))
        order_by = request.args.get('order_by', 'name')
        order = request.args.get('order', 'asc')
        try:
            q = db.session.query(Tool).filter(
                FallsUnder.tool_id == Tool.id,
                FallsUnder.category_id == cat_id
            )

            attr = getattr(Tool, order_by)
            func = getattr(attr, order)
            res = q.order_by(func()).all()
            tools = ToolSchema().dump(res, many=True)

            for tool in tools:
                tool['borrowed'] = True
                try:
                    db.session.query(Borrows).filter(
                        Borrows.tool_id == tool["id"], Borrows.borrowed == True
                    ).one()
                except:
                    tool['borrowed'] = False

                cats = db.session.query(Category).filter(
                    tool["id"] == FallsUnder.tool_id,
                    FallsUnder.category_id == Category.id,
                )
                tool['categories'] = CategorySchema().dump(cats, many=True)

        except Exception as e:
            return Response(400, {
                "error": f"Failed to return tool: {str(e)}"
            }).data

        resp = Response(200, tools).data
        resp['pagination'] = {
            "page": p,
            "per_page": n,
            "total": len(res)
        }
        return resp