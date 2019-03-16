import {sendNotification} from './notification';

export const initWebSocket = () => {
    if (!window.auth) return;
    const ws = new WebSocket(`ws://${window.location.host}/websocket`);
    ws.onmessage = onMessage;
    return ws;
};

const onMessage = response => {
    const data = JSON.parse(response.data),
        store = window.store.getState();

    switch (data.action.type) {
        case 'CHANGE_STATUS':
            if (data.action.hasOwnProperty('data')) {
                const indexList = store.table.list.findIndex(row => row.ID === data.action.data.id);
                if (indexList !== -1) {
                    data.action.data.keyStore = indexList;
                    window.store.dispatch(data.action);
                }
            }
            break;
        case 'GET_DATA':
          break;
    }

    if (data.hasOwnProperty('notify')) {
        sendNotification(data.action.type, data.data);
    }
};

/**
 * Отправить сообщение на ws сервер
 * @param action - тоже самое что в dispatch() редакса отправляем, чтобы другие клиенты это так же выполнили на своей стороне
 * @param data - any {}, крч вспомогательный объект, например одна строка таблицы (store.getState().table.list[N])
 * @returns {*}
 */
export const sendWebSocket = (action, data) =>
    !window.ws ? undefined : window.ws.send(JSON.stringify({action, data}));