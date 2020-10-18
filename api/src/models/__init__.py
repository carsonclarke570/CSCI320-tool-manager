from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

DEFAULT_PAGINATION = 20
DEFAULT_PAGE = 1

class Response():

    def __init__(self, code, content):
        self.data = {
            'code': code,
            'content': content
        }

class ModelBase():

    @staticmethod
    def create(schema, clss, request):
        try:
            
            x = clss(request.get_json())
            db.session.add(x)
            db.session.commit()
            db.session.refresh(x)
            res = clss.query.get(x.id)
        except Exception as e:
            return Response(400, {
                "error": f"Failed to CREATE: {str(e)}"
            }).data

        return Response(200, schema().dump(res)).data

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
    def delete(schema, clss, id):
        try:
            res = clss.query.filter(clss.id == id)
            res_json = schema().dump(res.one())
            res.delete()
            db.session.commit()
        except Exception as e:
            return Response(400, {
                "error": f"Failed to DELETE: {str(e)}"
            }).data

        return Response(200, res_json).data

    @staticmethod
    def filter(schema, clss, request):
        n = int(request.args.get('n', DEFAULT_PAGINATION))
        p = int(request.args.get('p', DEFAULT_PAGE))
        order_by = request.args.get('order_by', None)
        order = request.args.get('order', 'asc')
        try:
            filter_args = {}
            for k, v in request.args.items():
                if k != 'n' and k != 'p' and k != 'order' and k != 'order_by':
                    if v.lower() == 'null':
                        filter_args[k] = None
                    else:
                        filter_args[k] = v

            if len(filter_args) == 0:
                res = clss.query
            else:
                res = clss.query.filter_by(**filter_args)

            if order_by is not None:
                attr = getattr(clss, order_by)
                func = getattr(attr, order)
                res = res.order_by(func())

            res = res.paginate(p, n, False)
        except Exception as e:
            return Response(400, {
                "error": f"Failed to FILTER: {str(e)}"
            }).data

        resp = Response(200, schema().dump(res.items, many=True)).data
        resp['pagination'] = {
            "page": p,
            "per_page": n,
            "total": res.total
        }
        return resp


def init_app(app):
    db.init_app(app)


