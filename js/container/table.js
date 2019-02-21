import React from 'react';
import {connect} from 'react-redux';

import Table from '../components/Table/Table.jsx';

import {getData, search} from '../action/table';

const mapDispatchToProps = dispatch => ({
    getData: currentPage => getData(dispatch, currentPage),
    search: (currentPage, textSearch) => search(dispatch, currentPage, textSearch),
});

const mapStateToProps = state => ({
    table: state.table,
});

export default connect(mapStateToProps, mapDispatchToProps)(Table);