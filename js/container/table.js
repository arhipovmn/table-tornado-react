import React from 'react';
import {connect} from 'react-redux';

import Table from '../components/Table/Table.jsx';

import {getData, search} from '../action/table';

const mapDispatchToProps = dispatch => ({
    getData: (currentPage, filter) => getData(dispatch, currentPage, filter),
    search: (currentPage, filter, selectAutocomplete) => search(dispatch, currentPage, filter, selectAutocomplete),
});

const mapStateToProps = state => ({
    table: state.table,
});

export default connect(mapStateToProps, mapDispatchToProps)(Table);