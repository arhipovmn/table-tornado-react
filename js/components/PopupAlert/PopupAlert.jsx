import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";

import PreLoader from "../PreLoader/PreLoader.jsx";

import style from './PopupAlert.less';

class Alert extends React.Component {
    constructor(props) {
        super(props);
    };

    popupClose() {
        document.body.removeChild(this.props.div);
    }

    render() {

        return <div className={style['popup']}>
            <div>
                {this.props.text instanceof Error
                    ? this.props.text.toString() : this.props.text}
            </div>
            {this.props.onYes && this.props.onNo
                ? <div>
                    <button onClick={() => {
                        if (typeof this.props.onYes === 'function') {
                            this.props.onYes();
                        }
                        ::this.popupClose();
                    }}>Да
                    </button>
                    <button onClick={() => {
                        if (typeof this.props.onNo === 'function') {
                            this.props.onNo();
                        }
                        ::this.popupClose();
                    }}>Нет
                    </button>
                </div>
                : <div>
                    <button onClick={() => {
                        if (typeof this.props.onOk === 'function') {
                            this.props.onOk();
                        }
                        ::this.popupClose();
                    }}>ОК
                    </button>
                </div>
            }
        </div>;
    };
}

export const popupAlert = data => {
    const div = document.createElement('div');
    div.classList.add(style['fon']);
    ReactDOM.render(<Alert div={div}
                           text={data.text}
                           onOk={data.onOk}
                           onYes={data.onYes}
                           onNo={data.onNo}/>, document.body.appendChild(div))
};

PreLoader.propTypes = {
    div: PropTypes.object.isRequired,
    text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]).isRequired,
    onOk: PropTypes.func,
    onYes: PropTypes.func,
    onNo: PropTypes.func,
};

PreLoader.defaultProps = {
    div: undefined,
    text: '',
    onYes: undefined,
    onNo: undefined,
};