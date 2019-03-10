import {sendNotification} from './notification';

export const initWebSocket = (ws = new WebSocket(`ws://${window.location.host}/websocket`)) => {
    ws.onmessage = response => {
        const data = JSON.parse(response.data);
        if (window.store.getState().table.list.hasOwnProperty(data.action.data.keyStore)) {
            const store = window.store.getState().table.list[data.action.data.keyStore];
            if (store.ID === data.action.data.id) {
                window.store.dispatch(data.action);
            }
        }
        sendNotification(data.action.type, data.data);
    };
    return ws;
};

export const sendWebSocket = (action, data) => window.ws.send(JSON.stringify({action, data}));