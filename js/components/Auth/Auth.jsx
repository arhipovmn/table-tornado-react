import React from 'react';
import PropTypes from 'prop-types';

import style from './Auth.less';
import PreLoader from "../PreLoader/PreLoader.jsx";

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

        fetch('/auth', {
            method: 'POST',
            cache: 'no-cache',
            body: JSON.stringify({
                login: this.state.login,
                password: this.state.password,
            }),
        }).then(response => {
            response.text().then(text => {
                if (text === 'ok') {
                    window.auth = true;
                    this.props.handlerAuth(window.auth);
                } else {
                    throw text;
                }
            }).catch(() => {
                this.setState({fetching: false, error: true});
            });
        }).catch(error => {
            console.error('not response');
        });
    }

    render() {
        return <PreLoader fetching={this.state.fetching}>
            <form className={style['auth']} onSubmit={this.onSubmit.bind(this)}>
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
