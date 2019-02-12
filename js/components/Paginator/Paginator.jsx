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
                {this.props.page - 6 >= 1
                    ? <Link to={`/page/1`}>1</Link> : null}
                {this.props.page - 6 >= 1
                    ? <span>...</span> : null}
                {this.props.page - 5 >= 1
                    ? <Link to={`/page/${this.props.page - 5}`}>{`<<`}</Link> : null}
                {this.props.page - 4 >= 1
                    ? <Link to={`/page/${this.props.page - 4}`}>{this.props.page - 4}</Link> : null}
                {this.props.page - 3 >= 1
                    ? <Link to={`/page/${this.props.page - 3}`}>{this.props.page - 3}</Link> : null}
                {this.props.page - 2 >= 1
                    ? <Link to={`/page/${this.props.page - 2}`}>{this.props.page - 2}</Link> : null}
                {this.props.page - 1 >= 1
                    ? <Link to={`/page/${this.props.page - 1}`}>{this.props.page - 1}</Link> : null}
            </div>
            <div>
                <b>{this.props.page}</b>
            </div>
            <div>
                {this.props.page + 1 <= this.props.pageCount
                    ? <Link to={`/page/${this.props.page + 1}`}>{this.props.page + 1}</Link> : null}
                {this.props.page + 2 <= this.props.pageCount
                    ? <Link to={`/page/${this.props.page + 2}`}>{this.props.page + 2}</Link> : null}
                {this.props.page + 3 <= this.props.pageCount
                    ? <Link to={`/page/${this.props.page + 3}`}>{this.props.page + 3}</Link> : null}
                {this.props.page + 4 <= this.props.pageCount
                    ? <Link to={`/page/${this.props.page + 4}`}>{this.props.page + 4}</Link> : null}
                {this.props.page + 5 <= this.props.pageCount
                    ? <Link to={`/page/${this.props.page + 5}`}>{`>>`}</Link> : null}
                {this.props.page + 6 <= this.props.pageCount
                    ? <span>...</span> : null}
                {this.props.page + 6 <= this.props.pageCount
                    ? <Link to={`/page/${this.props.pageCount}`}>{this.props.pageCount}</Link> : null}
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