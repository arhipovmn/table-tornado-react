import React from 'react';

import style from './Table.less';
import PreLoader from "../PreLoader/PreLoader.jsx";
import Paginator from "../Paginator/Paginator.jsx";

export default class Table extends React.Component {
    constructor(props) {
        super(props);

        props.getData(this.props.match.params.hasOwnProperty('key') ? +this.props.match.params.key : 1);
        this.componentMount = true;
    };

    componentDidUpdate(){
        if (!this.componentMount && this.props.match.params.key !== undefined && this.props.table.page !== +this.props.match.params.key) {
            this.props.getData(this.props.match.params.hasOwnProperty('key') ? +this.props.match.params.key : 1);
            this.componentMount = true;
        } else {
            this.componentMount = false;
        }
    }

    static renderDateExecution(row) {
        return (row.DATE_COMPLETED
            ? `Дата выполнения: ${row.DATE_COMPLETED}`
            : (row.DATE_APPLY
                ? <div>{`Дата принятия: ${row.DATE_APPLY}`}</div>
                : null));
    }

    render() {
        const pageCount = this.props.table.list.length ? this.props.table.list[(this.props.table.list.length - 1)].page : 1;

        return <PreLoader fetching={this.props.table.fetching}>
            <div className={style['center']}>
                <Paginator page={this.props.table.page} pageCount={pageCount}/>
            </div>
            <div className={style['center']}>
                <div className={style['table']}>
                    <div className={style['th']}>
                        <div className={style['td']}>
                            <div>#</div>
                        </div>
                        <div className={style['td']}>
                            <div>Детали заказ</div>
                        </div>
                        <div className={style['td']}>
                            <div>Детали исполнения</div>
                        </div>
                    </div>
                    {this.props.table.list.map((row, key) => {
                        if (row.hasOwnProperty('page')) return null;
                        return <div key={key} className={style['tr']}>
                            <div className={style['td']}>
                                <div>{row.NUMBER}</div>
                            </div>
                            <div className={style['td']}>
                                <div>
                                    <div className={style['description']}>
                                        <div>Описание заказа: {row.BODY}</div>
                                        <div>{row.WHERE}</div>
                                    </div>
                                    <div>
                                        Кто заказал: {row.LOGIN}
                                    </div>
                                    <div>
                                        Дата создания: {row.DATE_CREATED}
                                    </div>
                                </div>
                            </div>
                            <div className={style['td']}>
                                <div>
                                    <div>
                                        Статус: {row.STATUS}
                                    </div>
                                    {Table.renderDateExecution(row)}
                                    {row.TRACKNUMBER ? <div>{`Трек-номер: ${row.TRACKNUMBER}`}</div> : null}
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
            <div className={style['center']}>
                <Paginator page={this.props.table.page} pageCount={pageCount}/>
            </div>
        </PreLoader>;
    };
}