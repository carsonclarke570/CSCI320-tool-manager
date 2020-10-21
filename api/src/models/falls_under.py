from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from . import db, ModelBase

class FallsUnder(db.Model, ModelBase):
    __tablename__ = 'falls_under'

    id = db.Column(db.Integer, primary_key=True)
    tool_id = db.Column(db.Integer, db.ForeignKey('tools.id'))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))

    def __init__(self, data):
        self.category_id = data.get('category_id')
        self.tool_id = data.get('tool_id')

class FallsUnderSchema(SQLAlchemyAutoSchema):

    class Meta:
        model = FallsUnder
        load_instance = True
        include_fk = True