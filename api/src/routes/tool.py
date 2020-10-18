import datetime

from flask import request, jsonify
from flask_restx import Namespace, Resource

from src.models import db
from src.models.tool import Tool, ToolSchema
from src.models.borrows import Borrows, BorrowsSchema
from src.routes.base import Response

api = Namespace('tools', description='CRUD+F Endpoints for Tool models')


@api.route('/')
class ToolsRoute(Resource):

    @api.doc('list_tools')
    def get(self):
        tools_resp = Tool.filter(ToolSchema, Tool, request)
        try:
            for tool in tools_resp["content"]:
                tool['borrowed'] = True
                try:
                    db.session.query(Borrows).filter(
                        Borrows.tool_id == tool["id"], Borrows.borrowed == True
                    ).one()
                except:
                    tool['borrowed'] = False

        except Exception as e:
            return Response(400, {
                "error": f"Failed to FILTER: {str(e)}"
            }).data
        
        return tools_resp

    def post(self):
        return Tool.create(ToolSchema, Tool, request)


@api.route('/<int:id>/')
class ToolRoute(Resource):

    @api.doc('get_tool')
    def get(self, id):
        return Tool.read(ToolSchema, Tool, request, id)

    def delete(self, id):
        return Tool.delete(ToolSchema, Tool, id)

@api.route('/archive/')
class ArchiveRoute(Resource):

    def post(self):
        try:
            tool_ids = request.get_json()
            print(request.data)
            for id in tool_ids:
                tool = db.session.query(Tool).filter(Tool.id == id).one()
                tool.removed_date = datetime.date.today()

            db.session.commit()

        except Exception as e:
            return Response(400, {
                "error": f"Failed to REMOVE: {str(e)}"
            }).data

        return Response(200, {}).data

@api.route('/unarchive/')
class UnarchiveRoute(Resource):

    def post(self):
        try:
            tool_ids = request.get_json()
            for id in tool_ids:
                tool = db.session.query(Tool).filter(Tool.id == id).one()
                tool.removed_date = None

            db.session.commit()

        except Exception as e:
            return Response(400, {
                "error": f"Failed to REMOVE: {str(e)}"
            }).data

        return Response(200, {}).data

@api.route('/removed/<int:user_id>/')
class RemovedListRoute(Resource):

    @api.doc('get_tool')
    def get(self, user_id):
        n = int(request.args.get('n', 20))
        p = int(request.args.get('p', 1))
        order_by = request.args.get('order_by', 'name')
        order = request.args.get('order', 'asc')

        attr = getattr(Tool, order_by)
        func = getattr(attr, order)
        res = db.session.query(Tool).filter(Tool.removed_date != None)
        res = res.order_by(func()).paginate(p, n, False)

        resp = Response(200, ToolSchema().dump(res.items, many=True)).data
        resp['pagination'] = {
            "page": p,
            "per_page": n,
            "total": res.total
        }
        return resp
