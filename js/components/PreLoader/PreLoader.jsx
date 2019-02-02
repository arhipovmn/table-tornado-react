import React from 'react';
import PropTypes from 'prop-types';

import style from './PreLoader.css';

export default class PreLoader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={style['pre-loader']}>
            {this.props.fetching
                ? <div className={style['fetching']}>Загрузка...</div> : this.props.children}
        </div>;
    }
}

PreLoader.propTypes = {
    fetching: PropTypes.bool.isRequired,
};

PreLoader.defaultProps = {
    fetching: false,
};