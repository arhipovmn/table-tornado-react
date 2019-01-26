# import tornado.ioloop as IOLoop

import os

import tornado.web

import tornado.template

import tornado.escape

from tornado.httpserver import HTTPServer

import tornado.ioloop

import tornado.ioloop



class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie('auth')

    def defaultResponse(self):
        auth = ''
        if self.current_user != None:
            auth = tornado.escape.xhtml_escape(self.current_user)

        self.render('index.html', title='Таблица', auth=auth)

class MainHandler(BaseHandler):
    def get(self):
        self.defaultResponse()

    # def post(self):
    #     data = tornado.escape.json_decode(self.request.body)
    #
    #     if data.get('type') == 'auth':
    #         if data.get('login') == 'admin' and data.get('password') == '123456':
    #             self.set_secure_cookie('auth', data.get('login'))
    #         else:
    #             self.write('error')
    #
    #     self.write('ok')



class AuthHandler(BaseHandler):
    def get(self):
        self.defaultResponse()

    def post(self):
        data = tornado.escape.json_decode(self.request.body)

        if data.get('login') == 'admin' and data.get('password') == '123456':
            self.set_secure_cookie('auth', data.get('login'))
            self.write('ok')
            return
        else:
            self.write('error')
            return

class QuitHandler(BaseHandler):
    def get(self):
        self.clear_cookie('auth')
        self.redirect('/')

# class LoginHandler(BaseHandler):
#     def post(self):
#         data = tornado.escape.json_decode(self.request.body)
#         if self.get_argument('login') == 'mihan' and self.get_argument('password') == '123456':
#             self.set_secure_cookie('login', self.get_argument('login'))
#             self.redirect('/')
#         else:
#             self.redirect('/')








dirname = os.path.dirname(__file__)
settings = {
    'template_path': os.path.join(dirname, 'template'),
    "static_path": os.path.join(dirname, 'static'),
    "cookie_secret": "__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
    ##"xsrf_cookies": True,
}

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/auth", AuthHandler),
        (r"/quit", QuitHandler)
    ], **settings)

# if __name__ == "__main__":
#     app = make_app()
#     app.listen(8888)
#     tornado.ioloop.IOLoop.current().start()

if __name__ == "__main__":
    app = make_app()
    server = HTTPServer(app)
    server.listen(8888)
    tornado.ioloop.IOLoop.current().start()