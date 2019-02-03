import React from 'react';
import {connect} from 'react-redux';

import Table from '../components/Table/Table.jsx';

import {getData} from "../action/table";

const mapDispatchToProps = dispatch => ({
    getData: page => getData(dispatch, page),
});

const mapStateToProps = state => ({
    table: state.table,
});

const TableContainer = connect(mapStateToProps, mapDispatchToProps)(Table);

export default TableContainer;