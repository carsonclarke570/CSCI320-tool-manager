from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from . import db, ModelBase

class Category(db.Model, ModelBase):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)

    def __init__(self, data):
        self.name = data.get('name')

class CategorySchema(SQLAlchemyAutoSchema):

    class Meta:
        model = Category
        load_instance = True