# import tornado.ioloop as IOLoop

import os

import tornado.web

import tornado.template

import tornado.escape

from tornado.httpserver import HTTPServer

import tornado.ioloop

import tornado.ioloop

import pymysql

connectionMysql = pymysql.connect(host='localhost',
                             user='root',
                             password='',
                             db='master',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)

dirname = os.path.dirname(__file__)


class BaseHandler(tornado.web.RequestHandler):
    cursor = connectionMysql.cursor()
    user = {'ID': 0, 'LOGIN': '', 'PASSWORD': '', 'CLASS': 0}

    def get_current_user(self):
        user_id = self.get_secure_cookie('auth')
        user_id = 0 if user_id is None else int(user_id)
        user_row = self.cursor.execute('SELECT * FROM users WHERE ID = %s;', [user_id])
        if user_row:
            self.user = self.cursor.fetchone()
            user_id = self.user['ID']
        else:
            self.clear_cookie('auth')
            user_id = 0

        return user_id

    def default_response(self):
        user_id = 0
        if self.current_user:
            user_id = tornado.escape.xhtml_escape(str(self.current_user))

        auth = 'true' if bool(user_id) == True else ''
        self.render('index.html', title='Таблица', auth=auth, user_name=self.user['LOGIN'], user_class=self.user['CLASS'])

    def check_auth(self, data):
        user_row = self.cursor.execute('SELECT * FROM users WHERE LOGIN = %s;', [data['login']])
        if user_row:
            row = self.cursor.fetchone()
            if row['PASSWORD'] == data['password']:
                return {'ID': row['ID'], 'LOGIN': row['LOGIN'], 'CLASS': row['CLASS']}
            else:
                return 0

        return 0

    def get_json(self):
        return tornado.escape.json_decode(self.request.body)

    def set_json(self, object):
        return tornado.escape.json_encode(object)

    def get_date_order(self, id, date_field):
        count = self.cursor.execute('SELECT '+date_field+' FROM master_orders WHERE ID = %s;', [id])
        if count:
            row = self.cursor.fetchone()
            return row[date_field]
        else:
            return 0


class MainHandler(BaseHandler):
    def get(self):
        self.default_response()


class AuthHandler(BaseHandler):
    def get(self):
        self.default_response()

    def post(self):
        data = self.get_json()
        user_id = self.check_auth(data)
        user_id = {'ID': 0} if user_id == 0 else user_id
        if user_id['ID']:
            self.set_secure_cookie('auth', str(user_id['ID']))
            self.write(self.set_json({'text': 'ok', 'LOGIN': user_id['LOGIN'], 'CLASS': user_id['CLASS']}))
        else:
            self.write(self.set_json({'text': 'error'}))


class QuitHandler(BaseHandler):
    def get(self):
        self.clear_cookie('auth')
        self.redirect('/')


class TableHandler(BaseHandler):
    def get(self):
        self.set_status(405)

    def post(self):
        data = self.get_json()

        self.get_current_user()

        if data['mode'] == 'get':
            factor = 2
            row = {}
            count_page = 0
            where_for_user = ''

            if self.user['CLASS'] == 5:
                where_for_user = 'WHERE mo.USER_CREATED = %s ' % self.user['ID']

            count = self.cursor.execute('SELECT COUNT(mo.ID) as COUNT FROM master_orders as mo %s' % where_for_user)

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
                count = self.cursor.execute('SELECT mo.ID, mo.NUMBER, mo.DESCRIPTION, mo.LINK, mo.USER_CREATED, '
                                            'DATE_FORMAT(mo.DATE_CREATED, %s) AS DATE_CREATED, '
                                            'DATE_FORMAT(mo.DATE_APPLY, %s) AS DATE_APPLY, '
                                            'DATE_FORMAT(mo.DATE_PROCESSED, %s) AS DATE_PROCESSED, '
                                            'DATE_FORMAT(mo.DATE_COMPLETED, %s) AS DATE_COMPLETED, '
                                            'mo.TRACKNUMBER, mo.STATUS, u.LOGIN '
                                            'FROM master_orders AS mo '
                                            'LEFT JOIN users AS u ON mo.USER_CREATED = u.ID '
                                            +where_for_user+
                                            'ORDER BY mo.DATE_CREATED DESC '
                                            'LIMIT %s, %s;',
                                            ['%Y-%m-%dT%H:%i:%s', '%Y-%m-%dT%H:%i:%s',
                                             '%Y-%m-%dT%H:%i:%s', '%Y-%m-%dT%H:%i:%s',
                                             (end_limit-factor), factor])
                if count:
                    row = self.cursor.fetchall()
                    row.append({'page': count_page})

            self.write(self.set_json(row))

        elif data['mode'] == 'save':

            if self.user['CLASS'] == 5:

                if data['data'].get('id'):
                    self.cursor.execute('UPDATE master_orders SET '+data['data']['type']+' = %s WHERE ID = %s',
                                        [data['data']['value'], data['data']['id']])
                else:
                    self.cursor.execute('INSERT INTO master_orders (NUMBER, DESCRIPTION, LINK, USER_CREATED, DATE_CREATED) '
                                        'VALUE (%s, %s, %s, %s, CURRENT_TIMESTAMP)',
                                        [data['data']['number'], data['data']['description'], data['data']['link'],
                                         self.user['ID']])
                connectionMysql.commit()

                self.write('ok')
            else:
                self.write('error')

        elif data['mode'] == 'changeStatus':

            if self.user['CLASS'] == 10:

                if data['data']['status'] == 'apply':
                    self.cursor.execute('UPDATE master_orders SET STATUS = %s, DATE_APPLY = CURRENT_TIMESTAMP '
                                        'WHERE ID = %s', [data['data']['status'], data['data']['id']])
                    connectionMysql.commit()
                    date = self.get_date_order(data['data']['id'], 'DATE_APPLY')
                    self.write(self.set_json({'status': 'ok', 'type': 'DATE_APPLY', 'date': date.isoformat()}))
                    return
                elif data['data']['status'] == 'processed' and data['data']['trackNumber'] != '':
                    self.cursor.execute('UPDATE master_orders SET STATUS = %s, DATE_PROCESSED = CURRENT_TIMESTAMP, '
                                        'TRACKNUMBER = %s WHERE ID = %s',
                                        [data['data']['status'], data['data']['trackNumber'], data['data']['id']])
                    connectionMysql.commit()
                    date = self.get_date_order(data['data']['id'], 'DATE_PROCESSED')
                    self.write(self.set_json({'status': 'ok', 'type': 'DATE_PROCESSED', 'date': date.isoformat()}))
                    return
                elif data['data']['status'] == 'completed':
                    self.cursor.execute('UPDATE master_orders SET STATUS = %s, DATE_COMPLETED = CURRENT_TIMESTAMP '
                                        'WHERE ID = %s', [data['data']['status'], data['data']['id']])
                    connectionMysql.commit()
                    date = self.get_date_order(data['data']['id'], 'DATE_COMPLETED')
                    self.write(self.set_json({'status': 'ok', 'type': 'DATE_COMPLETED', 'date': date.isoformat()}))
                    return

                self.write(self.set_json({'status': 'error'}))
            else:
                self.write(self.set_json({'status': 'error'}))


        elif data['mode'] == 'delete':
            self.write('ok')


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
