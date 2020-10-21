import datetime

from flask import request, jsonify
from flask_restx import Namespace, Resource

from src.models import db
from src.models.falls_under import FallsUnder, FallsUnderSchema
from src.routes.base import Response

api = Namespace('falls_under', description='CRUD+F Endpoints for falls_under models')


@api.route('/')
class BorrowsRoute(Resource):

    def get(self):
        return FallsUnder.filter(FallsUnderSchema, FallsUnder, request)

    def post(self):
        return FallsUnder.create(FallsUnderSchema, FallsUnder, request)


@api.route('/<int:id>/')
class BorrowRoute(Resource):

    def get(self, id):
        return FallsUnder.read(FallsUnderSchema, FallsUnder, request, id)