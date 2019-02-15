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
                {this.props.currentPage - 6 >= 1
                    ? <Link to={`/page/1`} onClick={() => this.props.getData(1)}>1</Link> : null}
                {this.props.currentPage - 6 >= 1
                    ? <span>...</span> : null}
                {this.props.currentPage - 5 >= 1
                    ? <Link to={`/page/${this.props.currentPage - 5}`}
                            onClick={() => this.props.getData(this.props.currentPage - 5)}>{`<<`}</Link> : null}
                {this.props.currentPage - 4 >= 1
                    ? <Link to={`/page/${this.props.currentPage - 4}`}
                            onClick={() => this.props.getData(this.props.currentPage - 4)}>{this.props.currentPage - 4}</Link> : null}
                {this.props.currentPage - 3 >= 1
                    ? <Link to={`/page/${this.props.currentPage - 3}`}
                            onClick={() => this.props.getData(this.props.currentPage - 3)}>{this.props.currentPage - 3}</Link> : null}
                {this.props.currentPage - 2 >= 1
                    ? <Link to={`/page/${this.props.currentPage - 2}`}
                            onClick={() => this.props.getData(this.props.currentPage - 2)}>{this.props.currentPage - 2}</Link> : null}
                {this.props.currentPage - 1 >= 1
                    ? <Link to={`/page/${this.props.currentPage - 1}`}
                            onClick={() => this.props.getData(this.props.currentPage - 1)}>{this.props.currentPage - 1}</Link> : null}
            </div>
            <div>
                <b>{this.props.currentPage}</b>
            </div>
            <div>
                {this.props.currentPage + 1 <= this.props.countPage
                    ? <Link to={`/page/${this.props.currentPage + 1}`}
                            onClick={() => this.props.getData(this.props.currentPage + 1)}>{this.props.currentPage + 1}</Link> : null}
                {this.props.currentPage + 2 <= this.props.countPage
                    ? <Link to={`/page/${this.props.currentPage + 2}`}
                            onClick={() => this.props.getData(this.props.currentPage + 2)}>{this.props.currentPage + 2}</Link> : null}
                {this.props.currentPage + 3 <= this.props.countPage
                    ? <Link to={`/page/${this.props.currentPage + 3}`}
                            onClick={() => this.props.getData(this.props.currentPage + 3)}>{this.props.currentPage + 3}</Link> : null}
                {this.props.currentPage + 4 <= this.props.countPage
                    ? <Link to={`/page/${this.props.currentPage + 4}`}
                            onClick={() => this.props.getData(this.props.currentPage + 4)}>{this.props.currentPage + 4}</Link> : null}
                {this.props.currentPage + 5 <= this.props.countPage
                    ? <Link to={`/page/${this.props.currentPage + 5}`}
                            onClick={() => this.props.getData(this.props.currentPage + 5)}>{`>>`}</Link> : null}
                {this.props.currentPage + 6 <= this.props.countPage
                    ? <span>...</span> : null}
                {this.props.currentPage + 6 <= this.props.countPage
                    ? <Link to={`/page/${this.props.countPage}`}
                            onClick={() => this.props.getData(this.props.countPage)}>{this.props.countPage}</Link> : null}
            </div>
        </div>;
    }
}


Paginator.propTypes = {
    currentPage: PropTypes.number.isRequired,
    countPage: PropTypes.number.isRequired,
};

Paginator.defaultProps = {
    currentPage: 1,
    countPage: 1,
};