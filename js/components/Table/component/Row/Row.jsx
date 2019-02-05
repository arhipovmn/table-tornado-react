import React from 'react';
import PropTypes from "prop-types";
import classNames from 'classnames';

import {checkClass} from '../../../../helper/helperAuth';

import PreLoader from '../../../PreLoader/PreLoader.jsx';

import style from './Row.less';

export default class Row extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editBody: false,
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

    editBody() {
        if (!checkClass(5)) return;
        this.setState({editBody: true}, () => this.refs['body'].focus());
    }

    editLink() {
        if (!checkClass(5)) return;
        this.setState({editLink: true}, () => this.refs['link'].focus());
    }

    changeStatus(status) {
        if(status === 'processed' && !this.refs['trackNumber'].value) return false;
        this.props.changeStatus({
            keyStore: this.props.keyStore,
            id: this.props.row.ID,
            status,
            trackNumber: this.refs.hasOwnProperty('trackNumber') ? this.refs['trackNumber'].value : '',
            fetching: fetching => this.setState({fetching}),
        });
    }

    renderStatus() {
        if (!checkClass(10)) return null;
        switch (this.props.row.STATUS) {
            case 'new':
                return <div>
                    <button onClick={this.changeStatus.bind(this, 'apply')}>Принять</button>
                </div>;
            case 'apply':
                return <div>
                    <input placeholder={'Трек-номер'} defaultValue={''} ref={'trackNumber'} />
                    <button onClick={this.changeStatus.bind(this, 'processed')}>Обработано</button>
                </div>;
            case 'processed':
                return <div>
                    <button onClick={this.changeStatus.bind(this, 'completed')}>Выполнено</button>
                </div>;
        }
    }

    render() {
        return <PreLoader className={style['tr']} fetching={this.state.fetching}>
            <div className={style['td']}>
                <div>{this.props.row.NUMBER}</div>
            </div>
            <div className={style['td']}>
                <div>
                    <div className={style['description']}>
                        <div className={classNames(this.state.editBody ? style['edit-description'] : false)}
                             onDoubleClick={this.editBody.bind(this)}>
                            {this.state.editBody
                                ? <textarea defaultValue={this.props.row.BODY} ref={'body'}
                                            onBlur={this.onSave.bind(this, {type: 'BODY'})}/>
                                : <div>Описание заказа: {this.props.row.BODY}</div>}
                        </div>
                        <div>
                            {this.state.editLink
                                ? <input defaultValue={this.props.row.LINK} ref={'link'}
                                         onBlur={this.onSave.bind(this, {type: 'LINK'})}/>
                                : <div>
                                    <div>
                                        <a href={this.props.row.LINK}
                                           target={'_blank'}>{this.props.row.LINK}</a>
                                    </div>
                                    {checkClass(5) ? <div onClick={this.editLink.bind(this)}>[<span>ред</span>]</div> : null}
                                </div>}
                        </div>
                    </div>
                    <div>
                        Кто заказал: {this.props.row.LOGIN}
                    </div>
                    <div>
                        Дата создания: {this.props.row.DATE_CREATED}
                    </div>
                </div>
            </div>
            <div className={style['td']}>
                <div>
                    <div className={style['status']}>
                        <div>Статус: {this.props.row.STATUS}</div>
                        {this.renderStatus()}
                    </div>
                    <div>
                        {this.props.row.TRACKNUMBER
                            ? <div>Трек-номер:
                                <a href={`https://gdeposylka.ru/courier/china-ems/tracking/${this.props.row.TRACKNUMBER}`}
                                   target={'_blank'}>{this.props.row.TRACKNUMBER}</a>
                            </div> : null}
                    </div>
                    <div>
                        {this.props.row.DATE_APPLY ? <div>{`Дата принятия: ${this.props.row.DATE_APPLY}`}</div> : null}
                        {this.props.row.DATE_PROCESSED ? <div>{`Дата обработки: ${this.props.row.DATE_PROCESSED}`}</div> : null}
                        {this.props.row.DATE_COMPLETED ? <div>{`Дата выполнения: ${this.props.row.DATE_COMPLETED}`}</div> : null}
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
        NUMBER: PropTypes.number.isRequired,
        BODY: PropTypes.string.isRequired,
        LINK: PropTypes.string.isRequired,
        DATE_CREATED: PropTypes.string.isRequired,
        DATE_APPLY: PropTypes.string,
        DATE_PROCESSED: PropTypes.string,
        DATE_COMPLETED: PropTypes.string,
        TRACKNUMBER: PropTypes.string,
        STATUS: PropTypes.string.isRequired,
    }).isRequired
};

Row.defaultProps = {
    keyStore: 0,
    row: {
        ID: 0,
        NUMBER: 0,
        BODY: '',
        LINK: '',
        DATE_CREATED: '',
        DATE_APPLY: '',
        DATE_PROCESSED: '',
        DATE_COMPLETED: '',
        TRACKNUMBER: '',
        STATUS: '',
    }
};