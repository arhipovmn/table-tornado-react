import React from 'react';
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

import style from './Paginator.less'

export default class Paginator extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={style['paginator']}>
            <div>
                {this.props.page > 1
                    ? <Link to={`/page/${this.props.page <= 4
                        ? 1 : this.props.page - 4}`}>{'<<<'}</Link> : null}
                {this.props.page > 1
                    ? <Link to={`/page/${this.props.page - 1}`}>{'<'}</Link> : null}
            </div>
            <div>
                {this.props.page}
            </div>
            <div>
                {this.props.pageCount > 1 && this.props.page !== this.props.pageCount
                    ? <Link to={`/page/${this.props.page + 1}`}>{'>'}</Link> : null}
                {this.props.pageCount > 1 && this.props.pageCount >= 5 && this.props.page !== this.props.pageCount
                    ? <Link to={`/page/${this.props.page + 4 > this.props.pageCount
                        ? this.props.pageCount : (this.props.page + 4) }`}>{'>>>'}</Link> : null}
            </div>
        </div>;
    }
}


Paginator.propTypes = {
    page: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
};

Paginator.defaultProps = {
    page: 1,
    pageCount: 1,
};