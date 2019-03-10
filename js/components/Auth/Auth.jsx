import React from 'react';
import PropTypes from 'prop-types';

import {fetchAuth} from '../../helper/authAjax';

import PreLoader from '../PreLoader/PreLoader.jsx';
import {popupAlert} from '../../components/PopupAlert/PopupAlert.jsx';

import style from './Auth.less';
import {initWebSocket} from "../../app/webSocket";

export default class Auth extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            login: '',
            password: '',
            error: false,
            fetching: false,
        };
    };

    onSubmit(e) {
        e.preventDefault();

        this.setState({fetching: true});

        fetchAuth(this.state.login, this.state.password)
            .then(response => response.json())
            .then(json => {
                if (json.text === 'ok') {
                    window.auth = true;
                    window.user_name = json.LOGIN;
                    window.user_class = json.CLASS;
                    this.props.handlerAuth(window.auth);
                    window.ws = initWebSocket();
                } else {
                    throw json.text;
                }
            }).catch(error => {
            popupAlert({
                text: error,
                onKo: () => {
                    this.setState({fetching: false, error: true});
                },
            });
            console.error(error);
        });
    }

    render() {
        return <PreLoader fetching={this.state.fetching}>
            <form className={style['auth']} onSubmit={::this.onSubmit}>
                <label>
                    <span>Логин: </span>
                    <input type={'text'} value={this.state.login}
                           onChange={e => this.setState({login: e.target.value})}/></label>
                <label>
                    <span>Пароль: </span>
                    <input type={'password'} value={this.state.password}
                           onChange={e => this.setState({password: e.target.value})}/></label>
                <div>
                    <button>Вход</button>
                    {this.state.error ? <span>Неправильный логин или пароль</span> : null}
                </div>
            </form>
        </PreLoader>;
    };
}

Auth.propTypes = {
    handlerAuth: PropTypes.func,
};
