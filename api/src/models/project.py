from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from . import db, ModelBase

class Project(db.Model, ModelBase):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(255), nullable=False)
    completed = db.Column(db.Boolean, default=False, nullable=False)


    def __init__(self, data):
        self.user_id = data.get('user_id')
        self.name = data.get('name')   
        self.completed = data.get('completed')

class ProjectSchema(SQLAlchemyAutoSchema):

    class Meta:
        model = Project
        load_instance = True