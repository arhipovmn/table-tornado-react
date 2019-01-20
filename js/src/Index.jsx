import React from 'react';
import ReactDOM from 'react-dom';

class Index extends React.Component {
    constructor(props) {

        super(props);
    }


    componentDidMount() {
        debugger;

        const request = new Request('/', {method: 'POST', body: '{"foo": "bar"}'});
        fetch(request).then(responce => {
            debugger;
        }).catch(error => {
            debugger;
        });

    }


    render () {

        let yes = 'yes';

        return `Hello world! ${yes}`;
    };
}

ReactDOM.render(<Index />, document.getElementById('root'));