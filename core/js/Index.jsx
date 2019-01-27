import React from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router';
import {BrowserRouter, Route, NavLink} from "react-router-dom";

import classNames from 'classnames';

import Table from './components/Table/Table.jsx';
import Auth from './components/Auth/Auth.jsx';

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
                    <div>[<NavLink exact to={'/'} activeClassName={style['selected']}>Таблица</NavLink>]</div>
                    <div>[{this.state.auth
                        ? <a href={'/quit'}>Выход</a>
                        : <NavLink to={'/auth'} activeClassName={style['selected']}>Войти</NavLink>}]
                    </div>
                </div>
                <div className={style['content']}>
                    <Route exact path={'/'} component={Table}/>
                    <Route path={'/auth'} render={() => this.state.auth
                        ? <Redirect to={'/'}/>
                        : <Auth handlerAuth={this.handlerAuth.bind(this)}/>}/>
                </div>
            </div>
        </BrowserRouter>;
    };
}

if (document.getElementById('index')) {
    ReactDOM.render(<Index/>, document.getElementById('index'));
}