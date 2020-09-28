class Response():

    def __init__(self, code, content):
        self.data = {
            'code': code,
            'content': content
        }