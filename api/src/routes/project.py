from flask import request, jsonify
from flask_restx import Namespace, Resource

from src.models import db
from src.models.project import Project, ProjectSchema
from src.routes.base import Response

api = Namespace('projects', description='CRUD+F Endpoints for Project models')

@api.route('/')
class UsersRoute(Resource):

    @api.doc('list_users')
    def get(self):
        return Project.filter(ProjectSchema, Project, request)


@api.route('/<int:id>/')
class UserRoute(Resource):
    
    @api.doc('get_user')
    def get(self, id):
        return Project.read(ProjectSchema, Project, request, id)