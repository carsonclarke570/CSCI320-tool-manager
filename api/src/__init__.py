import os

from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate

from src import config
from src import routes
from src import models


def create():

    # Construct Flask app
    app = Flask(__name__)
    app.config.from_object(config.ENVS[os.getenv('FLASK_ENV')])

    # Construct migrate object
    migrate = Migrate()

    # Allow all requests
    CORS(app)

    models.init_app(app)
    routes.init_app(app)
    migrate.init_app(app, models.db)

    return app