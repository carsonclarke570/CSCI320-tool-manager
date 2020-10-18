import datetime

from flask import request, jsonify
from flask_restx import Namespace, Resource
from sqlalchemy import asc, desc

from src.models import db
from src.models.borrows import Borrows, BorrowsSchema
from src.models.tool import Tool, ToolSchema
from src.models.user import User, UserSchema
from src.routes.base import Response

api = Namespace('borrows', description='CRUD+F Endpoints for borrow models')


@api.route('/')
class BorrowsRoute(Resource):

    def get(self):
        return Borrows.filter(BorrowsSchema, Borrows, request)

    def post(self):
        return Borrows.create(BorrowsSchema, Borrows, request)


@api.route('/<int:id>/')
class BorrowRoute(Resource):

    def get(self, id):
        return Borrows.read(BorrowsSchema, Borrows, request, id)


@api.route('/user/<int:user_id>')
class BorrowListRoute(Resource):

    def get(self, user_id):

        # Request params
        n = int(request.args.get('n', 20))
        p = int(request.args.get('p', 1))
        order_by = request.args.get('order_by', 'name')
        order = request.args.get('order', 'asc')

        # Query currently borrowed tools
        res = db.session.query(Tool).filter(
            Borrows.user_id == user_id, Borrows.tool_id == Tool.id, Borrows.borrowed == True)
        if order_by == 'status':
            res = res.order_by(asc(Borrows.return_date - datetime.date.today())) if order == 'asc' else res.order_by(desc(Borrows.return_date - datetime.date.today()))
        else:
            attr = getattr(Tool, order_by)
            func = getattr(attr, order)
            res = res.order_by(func())

        res = res.paginate(p, n, False)

        # Dump to JSON
        tools = ToolSchema().dump(res.items, many=True)
        for t in tools:
            b = db.session.query(Borrows).filter(
                Borrows.tool_id == t['id'],
                Borrows.borrowed == True
            ).one()

            t['borrowed_on'] = str(b.borrowed_on)
            t['return_date'] = str(b.return_date)
            t['days_late'] = (datetime.date.today() - b.return_date).days

        # Response
        resp = Response(200, tools).data
        resp['pagination'] = {
            "page": p,
            "per_page": n,
            "total": len(res.items)
        }
        return resp


@api.route('/return/<int:tool_id>')
class ReturnRoute(Resource):

    def post(self, tool_id):
        try:
            b = db.session.query(Borrows).filter(
                Borrows.tool_id == tool_id,
                Borrows.borrowed == True
            ).one()

            b.borrowed = False
            db.session.commit()
            db.session.refresh(b)
        except Exception as e:
            return Response(400, {
                "error": f"Failed to return tool: {str(e)}"
            }).data

        return Response(200, BorrowsSchema().dump(b)).data

@api.route('/history/<int:tool_id>')
class HistoryRoute(Resource):

    def post(self, tool_id):
        try:
            n = int(request.args.get('n', 20))
            p = int(request.args.get('p', 1))

            # Is it borrowed? If so get user
            res_user = db.session.query(Borrows).filter(
                Borrows.tool_id == tool_id, Borrows.borrowed == True
            ).order_by(desc(Borrows.borrowed_on))
            borrowed_by = None
            try:
                borrowed_by = UserSchema().dump(res_user.one())
            except:
                borrowed_by = None

            # Get history
            res_history = db.session.query(Borrows).filter(
                Borrows.tool_id == tool_id
            ).order_by(desc(Borrows.borrowed_on)).paginate(p, n, False)

            history = ToolSchema().dump(res_history.items, many=True)
        
        except Exception as e:
            return Response(400, {
                "error": f"Failed to return tool: {str(e)}"
            }).data

        resp = Response(200, {
            'history': history,
            'current_user': borrowed_by 
        }).data
        resp['pagination'] = {
            "page": p,
            "per_page": n,
            "total": len(res_history.items)
        }
        return resp
