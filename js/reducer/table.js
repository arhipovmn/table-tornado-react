export default function reducer(state = [], action) {
    switch (action.type) {

        case 'FETCHING':
            state.fetching = action.fetching;
            return Object.assign({}, state);

        case 'GET_DATA':
            state = {
                list: [...action.newState],
                fetching: false,
                page: +action.page,
            };
            return state;

        case 'SAVE_DATA':
            state.list[action.data.keyStore][action.data.type] = action.data.value;
            return Object.assign({}, state);

        case 'CHANGE_STATUS':
            state.list[action.data.keyStore]['STATUS'] = action.data.status;
            if (action.data.trackNumber) {
                state.list[action.data.keyStore]['TRACKNUMBER'] = action.data.trackNumber;
            }
            state.list[action.data.keyStore][action.data.date_type] = action.data.date;
            return Object.assign({}, state);

        default:
            return state;
    }
};