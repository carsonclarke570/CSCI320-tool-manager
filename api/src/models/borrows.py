from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from . import db, ModelBase

class Borrows(db.Model, ModelBase):
    __tablename__ = 'borrows'

    id = db.Column(db.Integer, primary_key=True)
    tool_id = db.Column(db.Integer, db.ForeignKey('tools.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    borrowed_on = db.Column(db.Date, nullable=False)
    return_date = db.Column(db.Date, nullable=False)
    borrowed = db.Column(db.Boolean, default=True, nullable=False)

    def __init__(self, data):
        self.user_id = data.get('user_id')
        self.tool_id = data.get('tool_id')
        self.borrowed_on = data.get('borrowed_on')
        self.return_date = data.get('return_date')
        self.borrowed = data.get('borrowed')

class BorrowsSchema(SQLAlchemyAutoSchema):

    class Meta:
        model = Borrows
        load_instance = True
        include_fk = True