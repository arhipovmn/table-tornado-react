# import tornado.ioloop as IOLoop

import os

import tornado.web

import tornado.template

import tornado.escape

from tornado.httpserver import HTTPServer

import tornado.ioloop

import tornado.ioloop

import pymysql

connection = pymysql.connect(host='localhost',
                             user='root',
                             password='',
                             db='master',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)

dirname = os.path.dirname(__file__)


class BaseHandler(tornado.web.RequestHandler):
    cursor = connection.cursor()
    user = {}

    def get_current_user(self):
        user_id = self.get_secure_cookie('auth')
        user_id = 0 if user_id is None else int(user_id)
        count = self.cursor.execute('SELECT * FROM users WHERE ID = %s;', [user_id])
        if count:
            self.user = self.cursor.fetchone()
            user_id = self.user['ID']
        else:
            self.clear_cookie('auth')
            user_id = 0

        return user_id

    def default_response(self):
        user_id = 0
        user_class = 0
        if self.current_user:
            user_id = tornado.escape.xhtml_escape(str(self.current_user))
            user_class = self.user['CLASS']

        auth = 'true' if bool(user_id) == True else ''
        self.render('index.html', title='Таблица', auth=auth, user_class=user_class)

    def check_auth(self, data):
        count = self.cursor.execute('SELECT * FROM users WHERE LOGIN = %s;', [data['login']])
        if count:
            row = self.cursor.fetchone()
            if row['PASSWORD'] == data['password']:
                return row['ID']
            else:
                return 0

        return 0

    def get_json(self):
        return tornado.escape.json_decode(self.request.body)

    def set_json(self, object):
        return tornado.escape.json_encode(object)

class MainHandler(BaseHandler):
    def get(self):
        self.default_response()


class AuthHandler(BaseHandler):
    def get(self):
        self.default_response()

    def post(self):
        data = self.get_json()
        user_id = self.check_auth(data)
        if user_id:
            self.set_secure_cookie('auth', str(user_id))
            self.write('ok')
        else:
            self.write('error')


class QuitHandler(BaseHandler):
    def get(self):
        self.clear_cookie('auth')
        self.redirect('/')


class TableHandler(BaseHandler):
    def get(self):
        self.set_status(405)

    def post(self):
        data = self.get_json()

        if data['mode'] == 'get':
            factor = 2
            row = {}
            count_page = 0

            count = self.cursor.execute('SELECT COUNT(ID) as COUNT FROM master_orders')

            if count:
                row_count = self.cursor.fetchone()

                if row_count['COUNT'] and row_count['COUNT'] > factor:
                    count_page = row_count['COUNT'] / factor
                    count_page = round(count_page)
                elif row_count['COUNT']:
                    count_page = 1
                else:
                    count_page = 0

            if count_page:
                end_limit = factor if data['page'] <= 1 else data['page']*factor
                count = self.cursor.execute('SELECT mo.ID, mo.NUMBER, mo.BODY, mo.`WHERE`, mo.USER_CREATED, '
                                            'DATE_FORMAT(mo.DATE_CREATED, %s) AS DATE_CREATED, DATE_FORMAT(mo.DATE_APPLY, %s) AS DATE_APPLY, '
                                            'DATE_FORMAT(mo.DATE_COMPLETED, %s) AS DATE_COMPLETED, mo.TRACKNUMBER, mo.STATUS, u.LOGIN '
                                            'FROM master_orders AS mo '
                                            'LEFT JOIN users AS u ON mo.USER_CREATED = u.ID '
                                            'LIMIT %s, %s;',
                                            ["%Y-%m-%dT%H:%i:%s", "%Y-%m-%dT%H:%i:%s", "%Y-%m-%dT%H:%i:%s", end_limit-factor, end_limit])
                if count:
                    row = self.cursor.fetchall()
                    row.append({'page': count_page})

            self.write(self.set_json(row))
        elif data['mode'] == 'save':
            return False
        elif data['mode'] == 'delete':
            return False


settings = {
    'template_path': os.path.join(dirname, 'template'),
    "static_path": os.path.join(dirname, 'static'),
    "cookie_secret": "__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
}


def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/table", TableHandler),
        (r"/page/[1-9]{1,11}", MainHandler),
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
