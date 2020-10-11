from flask import request, jsonify
from flask_restx import Namespace, Resource

from src.models import db
from src.models.user import User, UserSchema
from src.routes.base import Response

api = Namespace('users', description='CRUD+F Endpoints for User models')

@api.route('/')
class UsersRoute(Resource):

    @api.doc('list_users')
    def get(self):
        return User.filter(UserSchema, User, request)

    @api.doc('create_user')
    def post(self):
        try:
            data = request.get_json()
        except Exception as e:
            return Response(400, {
                "error": f"Failed to get JSON: {str(e)}"
            }).data

        user = User(data)
        try:
            user.create()
        except Exception as e:
            return Response(400, {
                "error": f"Failed to create User: {str(e)}"
            }).data
        
        return Response(200, {
             "message": f"Sucessfully created User",
             "id": user.id
        }).data


@api.route('/<int:id>/')
class UserRoute(Resource):
    
    @api.doc('get_user')
    def get(self, id):
        return User.read(UserSchema, User, request, id)
