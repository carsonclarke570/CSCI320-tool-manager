from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from . import db, ModelBase

class User(db.Model, ModelBase):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)

    def __init__(self, data):
        self.first_name = data.get('first_name')
        self.last_name = data.get('last_name')    

class UserSchema(SQLAlchemyAutoSchema):

    class Meta:
        model = User
        load_instance = True
        include_fk = True