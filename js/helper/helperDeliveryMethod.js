export const getDeliveryMethod = deliveryMethod => {
    switch (deliveryMethod) {
        case 'ru.aliexpress':
            return 'ru.aliexpress';
        case '138gsm':
            return '138gsm';
        case 'irk.green-spark':
            return 'irk.green-spark';
        case 'mobiround':
            return 'mobiround';
        case '4ip':
            return '4ip';
        case 'stock':
            return 'Склад';
        default:
            return '';
    }
};