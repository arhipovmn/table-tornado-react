import React from 'react';
import PropTypes from 'prop-types';

import {fetchAuth} from '../../helper/authAjax';

import PreLoader from "../PreLoader/PreLoader.jsx";

import style from './Auth.less';

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

        fetchAuth(this.state.login, this.state.password).then(response => {
            response.json().then(json => {
                if (json.text === 'ok') {
                    window.auth = true;
                    window.user_class = json.CLASS;
                    this.props.handlerAuth(window.auth);
                } else {
                    throw json.text;
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
