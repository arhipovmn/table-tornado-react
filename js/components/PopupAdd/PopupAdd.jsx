import React from 'react';
import ReactDOM from 'react-dom';

import {fetchGetData, fetchSaveData} from '../../helper/tableAjax';

import PreLoader from '../PreLoader/PreLoader.jsx';

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

        ::this.setState({fetching: true}, () => {
            fetchSaveData({
                number: this.refs['number'].value,
                description: this.refs['description'].value,
                link: this.refs['link'].value,
            }).then(response => {

                response.text().then(text => {
                    if (!Object.keys(text).length) throw 'empty';

                    if (text === 'ok') {

                        fetchGetData(1).then(response => {
                            response.json().then(json => {
                                if (!Object.keys(json).length) throw 'empty';

                                window.store.dispatch({
                                    type: 'GET_DATA',
                                    newState: json,
                                    page: 1,
                                });

                            }).catch(error => {
                                console.error(error);
                            });
                        }).catch(error => {
                            console.error(`not response ${error}`);
                        });

                        ::this.popupClose();

                    } else {
                        throw text;
                    }

                }).catch(error => {
                    ::this.popupClose();
                    console.error(error);
                });
            }).catch(error => {
                ::this.popupClose();
                console.error(`not response ${error}`);
            });
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

export const popupAdd = e => {
    const div = document.createElement('div');
    div.classList.add(style['fon']);
    ReactDOM.render(<Add div={div}/>, document.body.appendChild(div))
};