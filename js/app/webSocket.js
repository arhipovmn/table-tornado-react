import {sendNotification} from './notification';

export const initWebSocket = (ws = new WebSocket(`ws://${window.location.host}/websocket`)) => {
    ws.onmessage = response => {
        const data = JSON.parse(response.data);
        const indexList = window.store.getState().table.list.findIndex(row => row.ID === data.action.data.id);
        if (indexList !== -1) {
            data.action.data.keyStore = indexList;
            window.store.dispatch(data.action);
        }
        if (data.hasOwnProperty('notify')) {
            sendNotification(data.action.type, data.data);
        }
    };
    return ws;
};

export const sendWebSocket = (action, data) => window.ws.send(JSON.stringify({action, data}));