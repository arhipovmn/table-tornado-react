import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import style from './PreLoader.css';

export default class PreLoader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={classNames(this.props.className ? this.props.className : null, style['pre-loader'])}>
            {this.props.fetching
                ? <div className={style['fetching']}>Загрузка...</div> : this.props.children}
        </div>;
    }
}

PreLoader.propTypes = {
    fetching: PropTypes.bool.isRequired,
    className: PropTypes.string,
};

PreLoader.defaultProps = {
    fetching: false,
};