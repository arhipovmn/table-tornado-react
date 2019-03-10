import {getNameStatus} from '../helper/helperStatus';

export const sendNotification = (type, data) => {
    Notification.requestPermission().then(permission => {
        if (permission === 'denied') return false;
        if (type === 'CHANGE_STATUS') {
            new Notification('Изменен статус', {
                body: `Изменен статус у заказа №${data.NUMBER}, на "${getNameStatus(data.STATUS, false)}"`,
                onclick: e => {
                    debugger;

                },
            });
        }
    });
};