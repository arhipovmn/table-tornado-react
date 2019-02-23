export default function reducer(state = [], action) {
    switch (action.type) {
        case 'FETCHING':
            state.fetching = action.fetching;
            return Object.assign({}, state);

        case 'GET_DATA':
            state = {
                list: [...action.newState],
                fetching: false,
                currentPage: +action.currentPage,
            };
            return state;

        case 'SAVE_DATA':
            state.list[action.data.keyStore][action.data.type] = action.data.value;
            return Object.assign({}, state);

        case 'CHANGE_STATUS':
            state.list[action.data.keyStore]['STATUS'] = action.data.status;
            if (action.data.deliveryMethod) {
                state.list[action.data.keyStore]['DELIVERY_METHOD'] = action.data.deliveryMethod;
            }
            state.list[action.data.keyStore][action.data.date_type] = action.data.date;
            return Object.assign({}, state);

        default:
            return state;
    }
};