from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Response():

    def __init__(self, code, content):
        self.data = {
            'code': code,
            'content': content
        }

class ModelBase():

    def create(self):
        db.session.add(self)
        db.session.commit()
        db.session.refresh(self)

    @staticmethod
    def read(schema, clss, request, id):
        try:
            res = clss.query.get(id)
        except Exception as e:
            return Response(400, {
                "error": f"Failed to READ: {str(e)}"
            }).data

        return Response(200, schema().dump(res)).data


    @staticmethod
    def filter(schema, clss, request):
        try:
            if not bool(request.args):
                res = clss.query.all()
            else:
                res = clss.query.filter_by(**request.args).all()
        except Exception as e:
            return Response(400, {
                "error": f"Failed to FILTER: {str(e)}"
            }).data

        return Response(200, schema().dump(res, many=True)).data


def init_app(app):
    db.init_app(app)


