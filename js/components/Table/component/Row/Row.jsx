import React from 'react';
import PropTypes from "prop-types";
import classNames from 'classnames';

import {checkAuth} from '../../../../helper/helperAuth';

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

    static renderDateExecution(row) {
        return (row.DATE_COMPLETED
            ? `Дата выполнения: ${row.DATE_COMPLETED}`
            : (row.DATE_APPLY
                ? <div>{`Дата принятия: ${row.DATE_APPLY}`}</div>
                : null));
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
        if (!checkAuth(5)) return;
        this.setState({editBody: true})
    }

    editLink() {
        if (!checkAuth(5)) return;
        this.setState({editLink: true})
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
                                    <div onClick={this.editLink.bind(this)}>[<span>ред</span>]</div>
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
                    <div>
                        Статус: {this.props.row.STATUS}
                    </div>
                    {Row.renderDateExecution(this.props.row)}
                    {this.props.row.TRACKNUMBER ? <div>{`Трек-номер: ${this.props.row.TRACKNUMBER}`}</div> : null}
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