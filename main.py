#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os

import tornado.web

import tornado.template

import tornado.escape

from tornado.httpserver import HTTPServer

from datetime import datetime

import tornado.ioloop

import tornado.ioloop

import pymysql

from setting import setting

connectionMysql = pymysql.connect(host=setting['mysql-host'],
                                  user=setting['mysql-user'],
                                  password=setting['mysql-password'],
                                  db=setting['mysql-db'],
                                  charset=setting['mysql-charset'],
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
        self.render('index.html', title='Таблица', auth=auth, user_name=self.user['LOGIN'],
                    user_class=self.user['CLASS'])

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
        count = self.cursor.execute('SELECT ' + date_field + ' FROM master_orders WHERE ID = %s;', [id])
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
            row = self.get_row(data)
            self.write(self.set_json(row['list']))

        elif data['mode'] == 'saveRow':

            if self.user['CLASS'] == 5:

                if data['data'].get('id'):
                    self.cursor.execute('UPDATE master_orders SET ' + data['data']['type'] + ' = %s WHERE ID = %s',
                                        [data['data']['value'], data['data']['id']])
                else:
                    date_utc = datetime.utcnow()
                    self.cursor.execute(
                        'INSERT INTO master_orders (NUMBER, DESCRIPTION, LINK, USER_CREATED, DATE_CREATED) '
                        'VALUE (%s, %s, %s, %s, %s)',
                        [data['data']['number'], data['data']['description'], data['data']['link'],
                         self.user['ID'], date_utc.strftime('%Y-%m-%d %H:%M:%S')])
                connectionMysql.commit()

                self.write('ok')
            else:
                self.write('error')

        elif data['mode'] == 'changeStatus':

            if self.user['CLASS'] == 10:
                date_utc = datetime.utcnow()

                if data['data']['status'] == 'apply':
                    self.cursor.execute('UPDATE master_orders SET STATUS = %s, DATE_APPLY = %s '
                                        'WHERE ID = %s',
                                        [data['data']['status'],
                                         date_utc.strftime('%Y-%m-%d %H:%M:%S'), data['data']['id']])
                    connectionMysql.commit()
                    date = self.get_date_order(data['data']['id'], 'DATE_APPLY')
                    self.write(self.set_json({'status': 'ok', 'type': 'DATE_APPLY', 'date': date.isoformat()+'+00:00'}))
                    return
                elif data['data']['status'] == 'processed' and data['data']['deliveryMethod'] != '':
                    self.cursor.execute('UPDATE master_orders SET STATUS = %s, DATE_PROCESSED = %s, '
                                        'DELIVERY_METHOD = %s WHERE ID = %s',
                                        [data['data']['status'], date_utc.strftime('%Y-%m-%d %H:%M:%S'),
                                         data['data']['deliveryMethod'], data['data']['id']])
                    connectionMysql.commit()
                    date = self.get_date_order(data['data']['id'], 'DATE_PROCESSED')
                    self.write(self.set_json({'status': 'ok', 'type': 'DATE_PROCESSED', 'date': date.isoformat()+'+00:00'}))
                    return
                elif data['data']['status'] == 'completed':
                    self.cursor.execute('UPDATE master_orders SET STATUS = %s, DATE_COMPLETED = %s '
                                        'WHERE ID = %s',
                                        [data['data']['status'], date_utc.strftime('%Y-%m-%d %H:%M:%S'),
                                         data['data']['id']])
                    connectionMysql.commit()
                    date = self.get_date_order(data['data']['id'], 'DATE_COMPLETED')
                    self.write(self.set_json({'status': 'ok', 'type': 'DATE_COMPLETED', 'date': date.isoformat()+'+00:00'}))
                    return

                self.write(self.set_json({'status': 'error'}))
            else:
                self.write(self.set_json({'status': 'error'}))

        elif data['mode'] == 'deleteRow':
            if self.user['CLASS'] != 0:
                where_delete = ''
                if self.user['CLASS'] == 5:
                    where_delete = ' AND USER_CREATED = %s' % self.user['ID']

                self.cursor.execute('DELETE FROM master_orders WHERE ID = %s' + where_delete, [data['id']])
                connectionMysql.commit()

            row = self.get_row(data)
            self.write(self.set_json(row))

        elif data['mode'] == 'search':
            if self.user['CLASS'] != 0:
                row = self.get_row(data)

            self.write(self.set_json(row))

    def get_row(self, data):
        factor = 10
        row = {'list': {}, 'currentPage': 1}
        count_page = 0
        where_for_user = ''
        where_for_filter = ''
        sql_params = {'format_data': '%Y-%m-%dT%H:%i:%s+00:00'}
        limit = ' LIMIT %(from)s, %(to)s'

        if self.user['CLASS'] == 5:
            where_for_user = 'WHERE mo.USER_CREATED = %(user_id)s AND ACTIVE = \'Y\' '
            sql_params.update({'user_id': self.user['ID']})

        where_or_or = 'WHERE ' if where_for_user == '' else 'AND '

        if data.get('filter') and self.user['CLASS'] != 0:
            where_for_filter = where_or_or + 'mo.STATUS = %(filter)s'
            sql_params.update({'filter': data['filter']})

        where_for_search = ''
        if data.get('textSearch') is not None and self.user['CLASS'] != 0:
            if data.get('searchColumn') is not None:
                if data.get('searchColumn') == 'NUMBER':
                    where_for_search = 'mo.NUMBER LIKE %(search_text)s'
                elif data.get('searchColumn') == 'DESCRIPTION':
                    where_for_search = 'mo.DESCRIPTION LIKE %(search_text)s'
                elif data.get('searchColumn') == 'LINK':
                    where_for_search = 'mo.LINK LIKE %(search_text)s'
            else:
                where_for_search = '(mo.NUMBER LIKE %(search_text)s ' \
                                   'OR mo.DESCRIPTION LIKE %(search_text)s ' \
                                   'OR mo.LINK LIKE %(search_text)s) '

            if where_for_search != '':
                where_for_search = where_or_or + where_for_search
                sql_params.update({'search_text': '%' + data['textSearch'] + '%'})
                sql_params.update({'from': 0, 'to': 20})

        count = self.cursor.execute('SELECT COUNT(mo.ID) as COUNT FROM master_orders as mo '
                                    + where_for_user + where_for_filter + where_for_search, sql_params)

        if count:
            row_count = self.cursor.fetchone()

            if row_count['COUNT'] and row_count['COUNT'] > factor:
                count_page = row_count['COUNT'] / factor
                remainder = count_page % 1
                count_page = int(count_page) + 1 if remainder > 0 else int(count_page)
            elif row_count['COUNT']:
                count_page = 1
            else:
                count_page = 0

        if count_page:
            if data.get('currentPage') is None:
                end_limit = factor
                data['currentPage'] = 1
            else:
                data['currentPage'] = count_page if data.get('currentPage') > count_page else data.get('currentPage')
                end_limit = factor if data.get('currentPage') <= 1 else data.get('currentPage') * factor
                sql_params.update({'from': (end_limit - factor), 'to': factor})

            count = self.cursor.execute('SELECT mo.ID, mo.NUMBER, mo.DESCRIPTION, mo.LINK, mo.USER_CREATED, '
                                        'DATE_FORMAT(mo.DATE_CREATED, %(format_data)s) AS DATE_CREATED, '
                                        'DATE_FORMAT(mo.DATE_APPLY, %(format_data)s) AS DATE_APPLY, '
                                        'DATE_FORMAT(mo.DATE_PROCESSED, %(format_data)s) AS DATE_PROCESSED, '
                                        'DATE_FORMAT(mo.DATE_COMPLETED, %(format_data)s) AS DATE_COMPLETED, '
                                        'mo.DELIVERY_METHOD, mo.STATUS, u.LOGIN '
                                        'FROM master_orders AS mo '
                                        'LEFT JOIN users AS u ON mo.USER_CREATED = u.ID '
                                        + where_for_user + where_for_filter + where_for_search +
                                        'ORDER BY mo.DATE_CREATED DESC'
                                        + limit + '', sql_params)
            if count:
                row['list'] = self.cursor.fetchall()
                row['list'].append({'countPage': count_page})
                row['currentPage'] = data.get('currentPage')

        return row


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
        (r"/search/[1-9]{1,11}", MainHandler),
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
    server.listen(setting['network-port'])
    tornado.ioloop.IOLoop.current().start()
