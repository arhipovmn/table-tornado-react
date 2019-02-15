import React from 'react';
import {connect} from 'react-redux';

import Row from '../component/Row/Row.jsx';

import {saveData, changeStatus, deleteRow} from "../../../action/table";

const mapDispatchToProps = dispatch => ({
    saveData: data => saveData(dispatch, data),
    changeStatus: data => changeStatus(dispatch, data),
    deleteRow: data => deleteRow(dispatch, data),
});

const mapStateToProps = state => ({
    table: state.table,
});

export default connect(mapStateToProps, mapDispatchToProps)(Row);