# import tornado.ioloop as IOLoop

import os

import tornado.web
# from tornado.web import Application, RedirectHandler

import tornado.template

import tornado.escape

# import tornado.tcpserver
from tornado.httpserver import HTTPServer
import tornado.ioloop
# from IOLoop
# import IOLoop
# import tornado.httpserver
# from tornado.ioloop import IOLoop
import tornado.ioloop

dirname = os.path.dirname(__file__)
TEMPLATE_PATH = os.path.join(dirname, 'template')
STATIC_PATH = os.path.join(dirname, 'js')

class MainHandler(tornado.web.RequestHandler):

    def get(self):
        self.render('index.html')

    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        self.write(data)
























def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        ##(r"/save", MainHandler),
        ##(r"/delete", MainHandler),
    ], debug=False, template_path=TEMPLATE_PATH, static_path=STATIC_PATH, static_url_prefix='/js/')

# if __name__ == "__main__":
#     app = make_app()
#     app.listen(8888)
#     tornado.ioloop.IOLoop.current().start()

if __name__ == "__main__":
    app = make_app()
    server = HTTPServer(app)
    server.listen(8888)
    tornado.ioloop.IOLoop.current().start()