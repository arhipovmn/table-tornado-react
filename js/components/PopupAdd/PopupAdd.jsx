import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import {fetchGetData, fetchSaveData} from '../../helper/tableAjax';
import {sendWebSocket} from "../../app/webSocket";

import PreLoader from '../PreLoader/PreLoader.jsx';
import {popupAlert} from '../PopupAlert/PopupAlert.jsx';

import style from './PopupAdd.less';

class Add extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fetching: false,
        };
    };

    popupClose() {
        document.body.removeChild(this.props.div);
    }

    submit() {
        this.setState({fetching: true});

        fetchSaveData({
            number: this.refs['number'].value,
            description: this.refs['description'].value,
            link: this.refs['link'].value,
        }).then(response => response.text())
            .then(text => {
                ::this.popupClose();
                if (text === 'ok') {
                    return fetchGetData(1);
                } else {
                    throw text;
                }
            })
            .then(response => response.json())
            .then(json => {
                if (!Object.keys(json).length) throw 'empty';
                const action = {
                    type: 'GET_DATA',
                    newState: json,
                    currentPage: 1,
                };
                window.store.dispatch(action);
                sendWebSocket(action, {});
            }).catch(error => {
            popupAlert({
                text: error,
                onOk: ::this.popupClose,
            });
            console.error(error);
        });
    }

    render() {

        return <form className={style['popup']} onSubmit={::this.submit}>
            <PreLoader fetching={this.state.fetching}>
                <div className={style['close']} onClick={::this.popupClose}>
                    [<span>Закрыть</span>]
                </div>
                <div className={style['name']}>
                    Номер заказа
                </div>
                <div className={style['field']}>
                    <input style={{width: '50%'}}
                           placeholder={'Введите номер заказа'}
                           ref={'number'}
                           defaultValue={''}/>
                </div>
                <div className={style['name']}>
                    Описание
                </div>
                <div className={style['field']}>
                    <textarea placeholder={'Введите описание'}
                              ref={'description'}
                              defaultValue={''}/>
                </div>
                <div className={style['name']}>
                    Ссылка
                </div>
                <div className={style['field']}>
                    <input placeholder={'Введите ссылка'}
                           ref={'link'}
                           defaultValue={''}/>
                </div>
                <div className={style['button']}>
                    <button onClick={::this.submit}>Добавить</button>
                </div>
            </PreLoader>
        </form>;
    };
}

export const popupAdd = () => {
    const div = document.createElement('div');
    div.classList.add(style['fon']);
    ReactDOM.render(<Add div={div}/>, document.body.appendChild(div))
};

PreLoader.propTypes = {
    div: PropTypes.object.isRequired,
};