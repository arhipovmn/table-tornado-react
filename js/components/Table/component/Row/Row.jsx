import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import {checkClass} from '../../../../helper/helperAuth';
import {getNameStatus} from '../../../../helper/helperStatus';

import PreLoader from '../../../PreLoader/PreLoader.jsx';
import {popupAlert} from '../../../PopupAlert/PopupAlert.jsx';

import style from './Row.less';

export default class Row extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editDescription: false,
            editLink: false,
            fetching: false,
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
        if (status === 'processed' && !this.refs['trackNumber'].value) {
            popupAlert({
                text: <span>Не указан трек-номер!</span>,
                onOk: () => {
                },
            });
        } else {
            popupAlert({
                text: <span>Вы действительно хотите сменить статус на
                <b>{` ${getNameStatus(status, false)} `}</b>
                для заказа <b>#{this.props.row.NUMBER}</b></span>,
                onYes: () => {
                    this.props.changeStatus({
                        keyStore: this.props.keyStore,
                        id: this.props.row.ID,
                        status,
                        trackNumber: this.refs.hasOwnProperty('trackNumber') ? this.refs['trackNumber'].value : '',
                        fetching: fetching => this.setState({fetching}),
                    });
                },
                onNo: () => {
                },
            });
        }
    }

    renderStatus() {
        if (!checkClass(10)) return null;
        switch (this.props.row.STATUS) {
            case 'new':
                return <div>
                    <button onClick={() => ::this.changeStatus('apply')}>{getNameStatus('apply')}</button>
                </div>;
            case 'apply':
                return <div>
                    <input placeholder={'трек-номер'} defaultValue={''} ref={'trackNumber'}/>
                    <button onClick={() => ::this.changeStatus('processed')}>{getNameStatus('processed')}</button>
                </div>;
            case 'processed':
                return <div>
                    <button onClick={() => ::this.changeStatus('completed')}>{getNameStatus('completed')}</button>
                </div>;
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
                <div>{this.props.row.NUMBER}</div>
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
                                        <div onClick={::this.editLink}>[<span>ред</span>]</div> : null}
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
            <div className={style['td']}>
                <div>
                    <div className={style['status']}>
                        <div>Статус: {getNameStatus(this.props.row.STATUS)}</div>
                        {this.renderStatus()}
                    </div>
                    <div>
                        {this.props.row.TRACKNUMBER
                            ? <div>{`Трек-номер: `}
                                <a href={`https://gdeposylka.ru/courier/china-ems/tracking/${this.props.row.TRACKNUMBER}`}
                                   target={'_blank'}>{this.props.row.TRACKNUMBER}</a>
                            </div> : null}
                    </div>
                    <div>
                        {this.props.row.DATE_APPLY
                            ? <div>{`Дата принятия: ${moment(this.props.row.DATE_APPLY).format('DD.MM.YYYY HH:mm')}`}</div>
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
        DATE_CREATED: PropTypes.string.isRequired,
        DATE_APPLY: PropTypes.string,
        DATE_PROCESSED: PropTypes.string,
        DATE_COMPLETED: PropTypes.string,
        TRACKNUMBER: PropTypes.string,
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
        TRACKNUMBER: '',
        STATUS: '',
    },
    currentPage: 1,
};