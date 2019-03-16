import {sendNotification} from './notification';

export const initWebSocket = () => {
    if (!window.auth) return;
    const ws = new WebSocket(`ws://${window.location.host}/websocket`);
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

/**
 * Отправить сообщение на ws сервер
 * @param action - тоже самое что в dispatch() редакса отправляем, чтобы другие клиенты это так же выполнили на своей стороне
 * @param data - any {}, крч вспомогательный объект, например одна строка таблицы (store.getState().table.list[N])
 * @returns {*}
 */
export const sendWebSocket = (action, data) =>
    !window.ws ? undefined : window.ws.send(JSON.stringify({action, data}));