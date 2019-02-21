import React from 'react';

import PreLoader from '../PreLoader/PreLoader.jsx';
import Paginator from '../Paginator/Paginator.jsx';
import Row from './container/row';
import {popupAdd} from '../PopupAdd/PopupAdd.jsx';

import style from './Table.less';

export default class Table extends React.Component {
    constructor(props) {
        super(props);

        props.textSearch ? props.search(props.table.currentPage, props.textSearch)
            : props.getData(this.props.match.params.hasOwnProperty('key') ? +this.props.match.params.key : 1);
    };

    handlerPaginator(currentPage) {
        this.props.textSearch
            ? this.props.search(currentPage, this.props.textSearch)
            : this.props.getData(currentPage);
    }

    render() {
        const countPage = this.props.table.list.length ? this.props.table.list[(this.props.table.list.length - 1)].countPage : 1;

        return <div className={style['center']}>
            <div className={style['head-table']}>
                <div/>
                <div>{window.auth && window.user_class === 5
                    ? <button onClick={e => popupAdd(e)}>Добавить заказ</button>
                    : null}</div>
            </div>
            <PreLoader fetching={this.props.table.fetching} className={style['center']}>
                <Paginator currentPage={this.props.table.currentPage} countPage={countPage}
                           getData={::this.handlerPaginator}
                           page={this.props.textSearch ? 'search' : 'page'}/>
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
                        if (row.hasOwnProperty('countPage')) return null;
                        //debugger;
                        return <Row key={key} row={row}
                                    keyStore={key}
                                    currentPage={this.props.table.currentPage}/>
                    })}
                </div>
                <Paginator currentPage={this.props.table.currentPage} countPage={countPage}
                           getData={::this.handlerPaginator}
                           page={this.props.textSearch ? 'search' : 'page'}/>
            </PreLoader>
        </div>;
    };
}