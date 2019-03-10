import React from 'react';
import {Switch, Redirect} from 'react-router';
import {BrowserRouter, Route, NavLink} from 'react-router-dom';
import classNames from 'classnames';

import Table from '../../container/table';
import Auth from '../Auth/Auth.jsx';
import {getData} from '../../action/table';

import style from './Index.less';

export default class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            auth: window.auth,
        };
    }

    handlerAuth(auth) {
        this.setState({auth});
    }

    render() {
        return <BrowserRouter>
            <div className={style['root']}>
                <div className={classNames(style['router-link'], this.state.auth ? style['router-link-auth'] : false)}>
                    <div>
                        [<NavLink exact to={'/'}
                                  isActive={(match, location) => (match ? true : location.pathname.includes('/page/'))}
                                  activeClassName={style['selected']}
                                  onClick={() => getData(window.store.dispatch, 1)}>Таблица</NavLink>]
                        {!this.state.auth
                            ? <span> [<NavLink to={'/auth'} activeClassName={style['selected']}>Войти</NavLink>]</span>
                            : null}
                    </div>
                    <div/>
                    {this.state.auth
                        ? <div>
                            Добро пожаловать, <b>{window.user_name}</b>!
                            [<a href={'/quit'}>Выход</a>]
                        </div>
                        : <div/>}
                </div>
                <div className={style['content']}>
                    <Switch>
                        <Route exact path={'/'} render={props => <Table noFilterAndSearch {...props}/>}/>
                        <Route exact sensitive strict path={'/page/:key'} render={props => <Table {...props}/>}/>
                        <Route exact sensitive strict path={'/search/:key'} render={props => <Table {...props}/>}/>
                        <Route path={'/auth'} render={() => this.state.auth
                            ? <Redirect to={'/'}/>
                            : <Auth handlerAuth={::this.handlerAuth}/>}/>
                    </Switch>
                </div>
            </div>
        </BrowserRouter>;
    };
}