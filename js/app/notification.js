import {getNameStatus} from '../helper/helperStatus';
import {search} from "../action/table";

export const sendNotification = (type, data) => {
    Notification.requestPermission().then(permission => {
        if (permission === 'denied') return false;
        if (type === 'CHANGE_STATUS') {
            const notification = new Notification('Изменен статус', {
                body: `Изменен статус у заказа №${data.NUMBER}, на "${getNameStatus(data.STATUS, false)}"`,
                data: data.NUMBER,
            });
            /*notification.onclick = e => {
                debugger;
                search(window.store.dispatch, 1, '', notification.data);
            }*/
        }
    });
};