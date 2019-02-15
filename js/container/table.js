import React from 'react';
import {connect} from 'react-redux';

import Table from '../components/Table/Table.jsx';

import {getData} from "../action/table";

const mapDispatchToProps = dispatch => ({
    getData: currentPage => getData(dispatch, currentPage),
});

const mapStateToProps = state => ({
    table: state.table,
});

export default connect(mapStateToProps, mapDispatchToProps)(Table);