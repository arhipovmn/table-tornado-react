import React from 'react';
import {connect} from 'react-redux';

import Row from '../component/Row/Row.jsx';

import {saveData} from "../../../action/table";

const mapDispatchToProps = (dispatch, getState) => ({
    saveData: data => saveData(dispatch, data),
});

const mapStateToProps = (state, getState) => ({
    table: state.table,
});

export default connect(mapStateToProps, mapDispatchToProps)(Row);