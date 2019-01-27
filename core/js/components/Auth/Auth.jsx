import React from 'react';
import PropTypes from 'prop-types';

import style from './Auth.less';

export default class Auth extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            login: '',
            password: '',
            error: false,
        };
    };

    onSubmit(e) {
        e.preventDefault();

        const auth = {
            login: this.state.login,
            password: this.state.password,
        };

        fetch('/auth', {
            method: 'POST',
            cache: 'no-cache',
            body: JSON.stringify(auth),
        }).then(responce => {
            responce.text().then(text => {
                if (text === 'ok') {
                    window.auth = true;
                    this.props.handlerAuth(window.auth);
                } else {
                    throw text;
                }
            }).catch(() => {
                this.setState({error: true});
            });
        }).catch(error => {
            console.error('nor responce');
        });
    }

    render() {
        return <form className={style['auth']} onSubmit={this.onSubmit.bind(this)}>
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
        </form>;
    };
}

Auth.propTypes = {
    handlerAuth: PropTypes.func,
};
