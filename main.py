# import tornado.ioloop as IOLoop
import tornado.web
# import tornado.tcpserver
from tornado.httpserver import HTTPServer
import tornado.ioloop
# from IOLoop
# import IOLoop
# import tornado.httpserver
# from tornado.ioloop import IOLoop
import tornado.ioloop


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
    ])

# if __name__ == "__main__":
#     app = make_app()
#     app.listen(8888)
#     tornado.ioloop.IOLoop.current().start()

if __name__ == "__main__":
    app = make_app()
    server = HTTPServer(app)
    server.listen(8888)
    tornado.ioloop.IOLoop.current().start()