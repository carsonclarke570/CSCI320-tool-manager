from flask import request, jsonify
from flask_restx import Namespace, Resource

from src.models import db
from src.models.tool import Tool, ToolSchema
from src.routes.base import Response

api = Namespace('tools', description='CRUD+F Endpoints for Tool models')


@api.route('/')
class ToolsRoute(Resource):

    @api.doc('list_tools')
    def get(self):
        return Tool.filter(ToolSchema, Tool, request)


@api.route('/<int:id>/')
class ToolRoute(Resource):

    @api.doc('get_tool')
    def get(self, id):
        return Tool.read(ToolSchema, Tool, request, id)


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
