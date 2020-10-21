from flask_restx import Api

from src.routes.user import api as user_api
from src.routes.category import api as category_api
from src.routes.tool import api as tool_api
from src.routes.project import api as project_api
from src.routes.borrows import api as borrows_api
from src.routes.falls_under import api as fallsunder_api

ROUTES = [
    { 'route': user_api, 'enable': True },
    { 'route': category_api, 'enable': True },
    { 'route': tool_api, 'enable': True },
    { 'route': project_api, 'enable': True },
    { 'route': borrows_api, 'enable': True },
    { 'route': fallsunder_api, 'enable': True }
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