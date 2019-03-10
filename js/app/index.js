import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import reducer from '../reducer/index';
import defaultStore from './store';
import {initWebSocket} from './webSocket';

import Index from '../components/Index/Index.jsx';

window.store = createStore(reducer, defaultStore, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
window.ws = initWebSocket();

if (document.getElementById('index')) {
    ReactDOM.render(<Provider store={window.store}>
        <Index/>
    </Provider>, document.getElementById('index'));
}