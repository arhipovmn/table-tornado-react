import React from 'react';

import classNames from 'classnames';

import PreLoader from '../PreLoader/PreLoader.jsx';
import Paginator from '../Paginator/Paginator.jsx';
import Row from './container/row';
import {popupAdd} from '../PopupAdd/PopupAdd.jsx';
import Search from '../Search/Search.jsx';
import {getColorStatus} from '../../helper/helperStatus';

import style from './Table.less';

export default class Table extends React.Component {
    constructor(props) {
        super(props);

        if (props.rows) {
            props.getData(1);
        }

        if (props.row) {
            props.getId(+props.match.params.key);
        }

        this.filter = '';

        this.dataSearch = {
            textSearch: '',
            selectAutocomplete: '',
        };
    };

    handlerPaginator(currentPage, filter) {
        if (filter) this.filter = filter;
        this.dataSearch.selectAutocomplete
            ? this.props.search(currentPage, this.filter, this.dataSearch.selectAutocomplete)
            : this.props.getData(currentPage, this.filter);
    }

    handlerSearch(dataSearch) {
        this.dataSearch = dataSearch;
    }

    render() {
        if (this.props.noFilterAndSearch) {
            this.dataSearch = {
                textSearch: '',
                selectAutocomplete: '',
            };
            this.filter = '';
        }

        const countPage = this.props.table.list.length ? this.props.table.list[(this.props.table.list.length - 1)].countPage : 1;

        return <div className={style['center']}>
            {window.auth
                ? <div className={style['head-table']}>
                    <Search handlerSearch={::this.handlerSearch} {...this.props}/>
                </div>
                : null}
            <div className={style['head-table']}>
                <div>
                    {this.dataSearch.selectAutocomplete ? <div className={style['search-text']}><b>Резульат для
                        поиска:</b> {this.dataSearch.textSearch}</div> : null}
                    {window.auth
                        ? <div className={style['filter-button']}>
                            <button className={classNames(getColorStatus('new', 'button'))}
                                    onClick={() => ::this.handlerPaginator(1, 'new')}>Новые
                            </button>
                            <button className={classNames(getColorStatus('apply', 'button'))}
                                    onClick={() => ::this.handlerPaginator(1, 'apply')}>Принятые
                            </button>
                            <button className={classNames(getColorStatus('processed', 'button'))}
                                    onClick={() => ::this.handlerPaginator(1, 'processed')}>Обработанные
                            </button>
                            <button className={classNames(getColorStatus('completed', 'button'))}
                                    onClick={() => ::this.handlerPaginator(1, 'completed')}>Выполненные
                            </button>
                        </div>
                        : null}
                </div>
                <div>{window.auth && window.user_class === 5
                    ? <button onClick={e => popupAdd(e)}>Добавить заказ</button>
                    : null}</div>
            </div>
            <PreLoader fetching={this.props.table.fetching} className={style['center']}>
                <Paginator currentPage={this.props.table.currentPage} countPage={countPage}
                           getData={::this.handlerPaginator}
                           page={this.dataSearch.selectAutocomplete ? 'search' : 'page'}/>
                <div className={style['table']}>
                    <div className={style['th']}>
                        <div title={'Номер заказа'} className={style['td']}>
                            <div>№</div>
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
                        return <Row key={key} row={row}
                                    keyStore={key}
                                    currentPage={this.props.table.currentPage}/>
                    })}
                </div>
                <Paginator currentPage={this.props.table.currentPage} countPage={countPage}
                           getData={::this.handlerPaginator}
                           page={this.dataSearch.selectAutocomplete ? 'search' : 'page'}/>
            </PreLoader>
        </div>;
    };
}