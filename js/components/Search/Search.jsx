import React from 'react';
import Autocomplete from 'react-autocomplete';
import classNames from 'classnames';

import {fetchAutocomplete} from '../../helper/tableAjax';
import {search} from '../../action/table'

import style from './Search.less';

export default class Table extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            textSearch: '',
            fetching: false,
            itemsAutocomplete: [],
            newStoreTableList: [],
        };
    };

    render() {

        const searchTextInString = (string, text) => string.toLowerCase().indexOf(text.toLowerCase()) !== -1;

        return <Autocomplete
            getItemValue={item => item.label}
            items={this.state.itemsAutocomplete}
            renderItem={(item, isHighlighted) => {
                const searchColumn = column => {
                    switch (column) {
                        case 'DESCRIPTION':
                            return 'найдено в описание';
                        case 'LINK':
                            return 'найдено в ссылке';
                        case 'NUMBER':
                            return 'найдено в номере заказа';
                        default:
                            return '';
                    }
                };
                const renderLabel = label => {
                    const index = label.toLowerCase().indexOf(this.state.textSearch.toLowerCase());
                    const newLabel = label.slice(index, (index + this.state.textSearch.length));
                    return <span>
                        {label.slice(index - 16, index)}
                        <b>{newLabel}</b>
                        {label.slice(index + this.state.textSearch.length, index + this.state.textSearch.length + 16)}
                    </span>;
                };
                return this.state.fetching
                    ? <div className={style['preloader']}>Загрузка...</div>
                    : <div className={classNames(isHighlighted ? style['active'] : null, style['item'])}>
                        <div>Номер заказа <span>{item.number}</span>{<span>, {searchColumn(item.column)}</span>}</div>
                        <div>{renderLabel(item.label)}</div>
                    </div>;
            }}
            wrapperStyle={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                paddingBottom: '20px',
            }}
            menuStyle={{
                borderRadius: '0 0 10px 10px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                background: '#ffffff',
                fontSize: '90%',
                position: 'absolute',
                overflow: 'auto',
                maxHeight: '50%',
                maxWidth: '50%',
                borderWidth: this.state.textSearch ? '0 1px 1px 1px' : '0',
                borderStyle: 'solid',
                borderColor: '#99baca',
                overflowX: 'hidden',
                overflowY: 'auto',
            }}
            shouldItemRender={() => true}
            value={this.state.textSearch}
            onChange={e => {
                const textSearch = e.target.value,
                    createItem = (item, column) => searchTextInString(item[column], textSearch)
                        ? itemsAutocomplete.push({label: item[column], column, number: item['NUMBER']}) : null;
                let itemsAutocomplete = [], newStoreTableList = [];
                if (textSearch.length >= 2 && !this.state.fetching) {
                    itemsAutocomplete = [{label: ''}];
                    this.setState({fetching: true, textSearch, itemsAutocomplete}, () => fetchAutocomplete(textSearch)
                        .then(response => response.json())
                        .then(json => {
                            itemsAutocomplete = [];
                            if (json.list.length) {
                                json.list.forEach(responseSearch => {
                                    if (responseSearch.hasOwnProperty('countPage')) return;
                                    createItem(responseSearch, 'DESCRIPTION');
                                    createItem(responseSearch, 'LINK');
                                    createItem(responseSearch, 'NUMBER');
                                });
                                newStoreTableList = json;
                            }
                            this.setState({fetching: false, itemsAutocomplete, newStoreTableList});
                        }));
                } else {
                    this.setState({textSearch, itemsAutocomplete});
                }
            }}
            inputProps={{
                className: style['input'],
                placeholder: 'Поиск',
            }}
            onSelect={selectAutocomplete => {
                this.props.history.push('/search/1');
                this.props.handlerSearch({
                    textSearch: this.state.textSearch,
                    selectAutocomplete,
                });
                search(window.store.dispatch, 1, '', selectAutocomplete);
            }}/>;
    };
}