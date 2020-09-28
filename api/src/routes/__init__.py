from flask_restx import Api

from src.routes.user import api as user_api

ROUTES = [
    { 'route': user_api, 'enable': True }
]


def init_app(app):
    api = Api(
        title='Tool Manager',
        version='1.0',
        description='CSCI-320 Project API',
    )

    for route in ROUTES:
        if route['enable']:
            api.add_namespace(route['route'])

    api.init_app(app)