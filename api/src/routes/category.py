from flask import request, jsonify
from flask_restx import Namespace, Resource

from src.models import db
from src.models.category import Category, CategorySchema
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