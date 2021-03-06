import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import {Link} from 'react-router-dom';

import {checkClass} from '../../../../helper/helperAuth';
import {getNameStatus} from '../../../../helper/helperStatus';

import PreLoader from '../../../PreLoader/PreLoader.jsx';
import {popupAlert} from '../../../PopupAlert/PopupAlert.jsx';
import {getColorStatus} from '../../../../helper/helperStatus';
import {getDeliveryMethod} from "../../../../helper/helperDeliveryMethod";

import style from './Row.less';

export default class Row extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editDescription: false,
            editLink: false,
            fetching: false,
            deliveryMethod: '',
        };

        this.refs['trackNumber'] = {
            value: '',
        };
    }

    onSave(data) {
        this.props.saveData({
            keyStore: this.props.keyStore,
            id: this.props.row.ID,
            type: data.type,
            value: this.refs[`${data.type.toLowerCase()}`].value,
            fetching: fetching => this.setState({fetching}),
        });
        this.setState({[`edit${data.type.substr(0, 1).toUpperCase()}${data.type.substr(1).toLowerCase()}`]: false});
    }

    editDescription() {
        if (!checkClass(5)) return;
        this.setState({editDescription: true}, () => this.refs['description'].focus());
    }

    editLink() {
        if (!checkClass(5)) return;
        this.setState({editLink: true}, () => this.refs['link'].focus());
    }

    changeStatus(status) {
        if (status === 'processed') {
            if ((this.state.deliveryMethod === 'ru.aliexpress' || this.state.deliveryMethod === 'mobiround')
                && !this.refs['trackNumber'].value) {
                popupAlert({
                    text: <span>Не указан трек-номер!</span>,
                    onOk: () => {
                    },
                });
                return;
            } else if (!this.state.deliveryMethod) {
                popupAlert({
                    text: <span>Не указан способ доставки!</span>,
                    onOk: () => {
                    },
                });
                return;
            }
        }
        popupAlert({
            text: <span>Вы действительно хотите сменить статус на
                <b>{` ${getNameStatus(status, false)} `}</b>
                для заказа <b>#{this.props.row.NUMBER}</b></span>,
            onYes: () => this.props.changeStatus({
                keyStore: this.props.keyStore,
                id: this.props.row.ID,
                status,
                deliveryMethod: this.state.deliveryMethod,
                trackNumber: this.refs.hasOwnProperty('trackNumber') ? this.refs['trackNumber'].value : '',
                fetching: fetching => this.setState({fetching}),
            }),
            onNo: () => {
            },
        });
    }

    renderStatus() {
        if (!checkClass(10)) return null;
        switch (this.props.row.STATUS) {
            case 'new':
                return <div>
                    <button onClick={() => ::this.changeStatus('apply')}>{getNameStatus('apply')}</button>
                </div>;
            case 'apply':
                if (!this.state.deliveryMethod) {
                    return <div>Способ доставки:
                        <br/>
                        <label onClick={() => this.setState({deliveryMethod: 'ru.aliexpress'})}>
                            {getDeliveryMethod('ru.aliexpress')}:
                            <input type={'radio'}
                                   checked={this.state.deliveryMethod === 'ru.aliexpress'}/>
                        </label>
                        <br/>
                        <label onClick={() => this.setState({deliveryMethod: '138gsm'})}>
                            {getDeliveryMethod('138gsm')}:
                            <input type={'radio'}
                                   checked={this.state.deliveryMethod === '138gsm'}/>
                        </label>
                        <br/>
                        <label onClick={() => this.setState({deliveryMethod: 'irk.green-spark'})}>
                            {getDeliveryMethod('irk.green-spark')}:
                            <input type={'radio'}
                                   checked={this.state.deliveryMethod === 'irk.green-spark'}/>
                        </label>
                        <br/>
                        <label onClick={() => this.setState({deliveryMethod: 'mobiround'})}>
                            {getDeliveryMethod('mobiround')}:
                            <input type={'radio'}
                                   checked={this.state.deliveryMethod === 'mobiround'}/>
                        </label>
                        <br/>
                        <label onClick={() => this.setState({deliveryMethod: '4ip'})}>
                            {getDeliveryMethod('4ip')}:
                            <input type={'radio'}
                                   checked={this.state.deliveryMethod === '4ip'}/>
                        </label>
                        <br/>
                        <label onClick={() => this.setState({deliveryMethod: 'stock'})}>
                            {getDeliveryMethod('stock')}:
                            <input type={'radio'}
                                   checked={this.state.deliveryMethod === 'stock'}/>
                        </label>
                    </div>;
                } else {
                    if (this.state.deliveryMethod === 'ru.aliexpress') {
                        return <div>
                            <input placeholder={'трек-номер'} defaultValue={''} ref={'trackNumber'}/>
                            <br/>
                            <button onClick={() => ::this.changeStatus('processed')}>
                                {getNameStatus('processed')}
                            </button>
                        </div>;
                    }
                    if (this.state.deliveryMethod === 'mobiround') {
                        return <div>
                            <input placeholder={'трек-номер'} defaultValue={''} ref={'trackNumber'}/>
                            <br/>
                            <button onClick={() => ::this.changeStatus('processed')}>
                                {getNameStatus('processed')}
                            </button>
                        </div>;
                    }
                    return <div>
                        Способ доставки: {getDeliveryMethod(this.state.deliveryMethod)}
                        <br/>
                        <button onClick={() => ::this.changeStatus('processed')}>
                            {getNameStatus('processed')}
                        </button>
                    </div>;
                }
            case 'processed':
                return <div>
                    <button onClick={() => ::this.changeStatus('completed')}>{getNameStatus('completed')}</button>
                </div>;
            default:
                return <div/>;
        }
    }

    deleteRow() {
        popupAlert({
            text: <span>Вы действительно хотите удалить заказа <b>#{this.props.row.NUMBER}</b></span>,
            onYes: () => {
                this.props.deleteRow({
                    id: this.props.row.ID,
                    currentPage: this.props.currentPage,
                });
            },
            onNo: () => {
            },
        });
    }

    render() {
        return <PreLoader className={style['tr']} fetching={this.state.fetching}>
            <div className={style['td']}>
                <div>
                    <Link to={`/table/${this.props.row.ID}`}
                          onClick={() => this.props.getId(this.props.row.ID)}>
                        {this.props.row.NUMBER}
                    </Link>
                </div>
                {window.auth ? <button title={'Удалить'}
                                       onClick={::this.deleteRow}>X</button> : null}
            </div>
            <div className={style['td']}>
                <div>
                    <div className={style['description']}>
                        <div className={classNames(this.state.editDescription ? style['edit-description'] : false)}
                             style={checkClass(5) ? {cursor: 'pointer'} : {}}
                             onDoubleClick={::this.editDescription}>
                            {this.state.editDescription
                                ? <textarea defaultValue={this.props.row.DESCRIPTION} ref={'description'}
                                            onBlur={() => ::this.onSave({type: 'DESCRIPTION'})}
                                            onKeyDown={e => e.key === 'Enter' && e.ctrlKey
                                                ? ::this.onSave({type: 'DESCRIPTION'}) : false}/>
                                : <div>Описание заказа: {this.props.row.DESCRIPTION}</div>}
                        </div>
                        <div>
                            {this.state.editLink
                                ? <input defaultValue={this.props.row.LINK} ref={'link'}
                                         onBlur={() => ::this.onSave({type: 'LINK'})}
                                         onKeyDown={e => ((e.key === 'Enter' && e.ctrlKey) || e.key === 'Enter')
                                             ? ::this.onSave({type: 'LINK'}) : false}/>
                                : <div>
                                    <div>
                                        <a href={this.props.row.LINK}
                                           target={'_blank'}>{this.props.row.LINK}</a>
                                    </div>
                                    {checkClass(5) ?
                                        <div onClick={::this.editLink}>[<span>ред</span>]</div> : <div/>}
                                </div>}
                        </div>
                    </div>
                    <div>
                        Кто заказал: {this.props.row.LOGIN}
                    </div>
                    <div>
                        Дата создания: {moment(this.props.row.DATE_CREATED).format('DD.MM.YYYY HH:mm')}
                    </div>
                </div>
            </div>
            <div className={classNames(style['td'], getColorStatus(this.props.row.STATUS, 'fon'))}>
                <div>
                    <div className={style['status']}>
                        <div>Статус: {getNameStatus(this.props.row.STATUS)}</div>
                        {this.renderStatus()}
                    </div>
                    {this.props.row.DELIVERY_METHOD
                        ? <div>
                            <div>Способ доставки: {this.props.row.DELIVERY_METHOD}</div>
                            {this.props.row.TRACK_NUMBER
                                ? <div>{`Трек-номер: `}
                                    <a href={`https://gdeposylka.ru/courier/china-ems/tracking/${this.props.row.TRACK_NUMBER}`}
                                       target={'_blank'}>{this.props.row.TRACK_NUMBER}</a>
                                </div>
                                : null}
                        </div>
                        : null}
                    <div>
                        {this.props.row.DATE_APPLY
                            ?
                            <div>{`Дата принятия: ${moment(this.props.row.DATE_APPLY).format('DD.MM.YYYY HH:mm')}`}</div>
                            : null}
                        {this.props.row.DATE_PROCESSED ?
                            <div>{`Дата обработки: ${moment(this.props.row.DATE_PROCESSED).format('DD.MM.YYYY HH:mm')}`}</div> : null}
                        {this.props.row.DATE_COMPLETED ?
                            <div>{`Дата выполнения: ${moment(this.props.row.DATE_COMPLETED).format('DD.MM.YYYY HH:mm')}`}</div> : null}
                    </div>
                </div>
            </div>
        </PreLoader>;
    }
}

Row.propTypes = {
    keyStore: PropTypes.number.isRequired,
    row: PropTypes.shape({
        ID: PropTypes.number.isRequired,
        NUMBER: PropTypes.string.isRequired,
        DESCRIPTION: PropTypes.string.isRequired,
        LINK: PropTypes.string.isRequired,
        USER_CREATED: PropTypes.number.isRequired,
        DATE_CREATED: PropTypes.string.isRequired,
        DATE_APPLY: PropTypes.string,
        DATE_PROCESSED: PropTypes.string,
        DATE_COMPLETED: PropTypes.string,
        DELIVERY_METHOD: PropTypes.string,
        TRACK_NUMBER: PropTypes.string,
        STATUS: PropTypes.string.isRequired,
    }).isRequired,
    currentPage: PropTypes.number.isRequired,
};

Row.defaultProps = {
    keyStore: 0,
    row: {
        ID: 0,
        NUMBER: 0,
        DESCRIPTION: '',
        LINK: '',
        DATE_CREATED: '',
        DATE_APPLY: '',
        DATE_PROCESSED: '',
        DATE_COMPLETED: '',
        DELIVERY_METHOD: '',
        TRACK_NUMBER: '',
        STATUS: '',
    },
    currentPage: 1,
};