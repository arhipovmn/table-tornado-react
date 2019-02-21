import React from 'react';
import Autocomplete from 'react-autocomplete';
import classNames from 'classnames';

import {fetchAutocomplete} from '../../helper/tableAjax';

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
                            return 'в описание';
                        case 'LINK':
                            return 'в ссылке';
                        case 'NUMBER':
                            return 'в номере заказа';
                        default:
                            return '';
                    }
                };
                return this.state.fetching
                    ? <div>Загрузка</div>
                    : <div className={classNames(isHighlighted ? style['active'] : null, style['item'])}>
                        <div><span>№ {item.number}, </span><span>{searchColumn(item.column)}</span></div>
                        <div>{item.label}</div>
                    </div>;
            }}
            wrapperStyle={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
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
            shouldItemRender={(item, value) => searchTextInString(item.label, value)}
            value={this.state.textSearch}
            onChange={e => {
                const textSearch = e.target.value,
                    itemsAutocomplete = [],
                    createItem = (item, column) => searchTextInString(item[column], textSearch)
                        ? itemsAutocomplete.push({label: item[column], column, number: item['NUMBER']}) : null;
                let newStoreTableList = [];
                if (textSearch.length >= 2 && !this.state.fetching) {
                    this.setState({fetching: true, textSearch, itemsAutocomplete}, () => fetchAutocomplete(textSearch)
                        .then(response => response.json())
                        .then(json => {
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
            }}
            onSelect={selectAutocomplete => {
                this.props.history.push('/search/1');
                this.props.handlerSearch({
                    textSearch: this.state.textSearch,
                    selectAutocomplete,
                });
            }}/>;
    };
}