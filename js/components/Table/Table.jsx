import React from 'react';

import style from './Table.less';
import PreLoader from "../PreLoader/PreLoader.jsx";

export default class Table extends React.Component {
    constructor(props) {
        super(props);
    };

    componentDidMount() {
        this.props.getData();
    }

    componentDidUpdate() {
        //...
        //debugger;
    }

    render() {

        //debugger;

        return <PreLoader fetching={this.props.table.fetching}>
            <div className={style['table']}>
                <div className={style['th']}>
                    <div className={style['td']}>
                        <div>#</div>
                    </div>
                    <div className={style['td']}>
                        <div>Описание заказа</div>
                    </div>
                    <div className={style['td']}>
                        <div>Ссылка(и)</div>
                    </div>
                    <div className={style['td']}>
                        <div>Кто создал</div>
                    </div>
                    <div className={style['td']}>
                        <div>Дата создания / выполнения</div>
                    </div>
                    <div className={style['td']}>
                        <div>Трек-номер</div>
                    </div>
                    <div className={style['td']}>
                        <div/>
                    </div>
                </div>
                {this.props.table.list.map(row => {
                    if (row.hasOwnProperty('page')) return null;
                    return <div className={style['tr']}>
                        <div className={style['td']}>
                            <div>{row.NUMBER}</div>
                        </div>
                        <div className={style['td']}>
                            <div>{row.BODY}</div>
                        </div>
                        <div className={style['td']}>
                            <div>{row.WHERE}</div>
                        </div>
                        <div className={style['td']}>
                            <div>{row.LOGIN}</div>
                        </div>
                        <div className={style['td']}>
                            <div>{row.CREATED} / {row.DATAPAY}</div>
                        </div>
                        <div className={style['td']}>
                            <div>{row.TRACKNUMBER}</div>
                        </div>
                        <div className={style['td']}>
                            <div>{row.COMPLETED}</div>
                        </div>
                    </div>
                })}
            </div>
        </PreLoader>;
    };
}