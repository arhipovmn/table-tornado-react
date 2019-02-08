import React from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router';
import {createStore} from 'redux';
import {Provider} from 'react-redux'
import {BrowserRouter, Route, NavLink} from "react-router-dom";
import classNames from 'classnames';

import reducer from '../../reducer/index';
import defaultStore from '../../reducer/initStore';

import Table from '../../container/table';
import Auth from '../Auth/Auth.jsx';
import {popupAdd} from '../PopupAdd/PopupAdd.jsx';

import style from './Index.less';

class Index extends React.Component {
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
                                  activeClassName={style['selected']}>Таблица</NavLink>]
                    </div>
                    {this.state.auth ? <div><button onClick={e => popupAdd(e)}>Добавить заказ</button></div> : null}
                    <div>[{this.state.auth
                        ? <a href={'/quit'}>Выход</a>
                        : <NavLink to={'/auth'} activeClassName={style['selected']}>Войти</NavLink>}]
                    </div>
                </div>
                <div className={style['content']}>
                    <Route exact path={'/'} render={props => <Table {...props}/>}/>
                    <Route exact sensitive strict path={'/page/:key'} render={props => <Table {...props}/>}/>
                    <Route path={'/auth'} render={() => this.state.auth
                        ? <Redirect to={'/'}/>
                        : <Auth handlerAuth={::this.handlerAuth}/>}/>
                </div>
            </div>
        </BrowserRouter>;
    };
}

window.store = createStore(reducer, defaultStore, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

if (document.getElementById('index')) {
    ReactDOM.render(<Provider store={window.store}>
        <Index/>
    </Provider>, document.getElementById('index'));
}