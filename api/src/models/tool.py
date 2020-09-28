from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from . import db, ModelBase

class Tool(db.Model, ModelBase):
    __tablename__ = 'tools'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(255), nullable=False)
    lendable = db.Column(db.Boolean, nullable=False)
    barcode = db.Column(db.String(255), unique=True, nullable=False)
    purchase_date = db.Column(db.Date, nullable=False)
    removed_date = db.Column(db.Date, nullable=True)

    def __init__(self, data):
        self.user_id = data.get('user_id')
        self.name = data.get('name')
        self.lendable = data.get('lendable')    
        self.barcode = data.get('barcode')
        self.purchase_date = data.get('purchase_date')
        self.removed_date = data.get('removed_date')

class ToolSchema(SQLAlchemyAutoSchema):

    class Meta:
        model = Tool
        load_instance = True