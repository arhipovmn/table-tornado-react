import styleStatus from './css/styleStatus.css';

export const getNameStatus = (status, verb = true) => {
    switch (status) {
        case 'new':
            return verb ? 'Новый' : 'Новый';
        case 'apply':
            return verb ? 'Принято' : 'Принятый';
        case 'processed':
            return verb ? 'Обработано' : 'Обработаный';
        case 'completed':
            return verb ? 'Выполнено' : 'Выполненый';
    }
};

export const getColorStatus = (status, elementsName) => styleStatus[`status-background-color-${elementsName}-${status}`];