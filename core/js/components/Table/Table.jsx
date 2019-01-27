import React from 'react';

export default class Table extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            list: {},
        };
    };

    componentDidMount() {

        fetch('/table_get', {
            method: 'POST',
            cache: 'no-cache',
            body: JSON.stringify({
                    mode: 'get',
                page: 1,
            }),
        }).then(responce => {

            debugger;

            /*responce.text().then(text => {
                if (text === 'ok') {
                    window.auth = true;
                    this.props.handlerAuth(window.auth);
                } else {
                    throw text;
                }
            }).catch(() => {
                this.setState({error: true});
            });*/

        }).catch(error => {
            /*console.error('nor responce');*/
        });

    }

    render() {
        return `table`;
    };
}