import React from 'react';
import ReactDOM from 'react-dom';

class Index extends React.Component {
    constructor(props) {

        super(props);
    }


    render () {

        let yes = 'yes';

        return `Hello world! ${yes}`;
    };
}

ReactDOM.render(<Index />, document.getElementById('root'));