import os

class Development(object):
    """ Development Environment config """

    DEBUG = True
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DEV_PG_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class Production(object):
    """ Production Environment config """

    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.getenv('PRO_PG_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

ENVS = {
    'development': Development,
    'production': Production
}