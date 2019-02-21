import React from 'react';
import Autocomplete from 'react-autocomplete';
import classNames from 'classnames';
import {Redirect} from 'react-router';

import {fetchAutocomplete} from '../../helper/tableAjax';

import style from './Search.css';

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
                return this.state.fetching
                    ? <div>Загрузка</div>
                    : <div className={classNames(isHighlighted
                        ? style['bold'] : null, style['item'])}>{item.label}</div>;
            }}
            wrapperStyle={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
            }}
            shouldItemRender={(item, value) => searchTextInString(item.label, value)}
            value={this.state.textSearch}
            onChange={e => {
                const textSearch = e.target.value,
                    itemsAutocomplete = [],
                    createItem = (item, column) => searchTextInString(item[column], textSearch)
                        ? itemsAutocomplete.push({label: item[column], column}) : null;
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
            onSelect={() => {
                this.props.history.push('/search/1');
                this.props.handlerSearch(this.state.textSearch);
            }}/>;
    };
}