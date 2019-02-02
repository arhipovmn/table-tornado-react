export default function reducer(state = [], action) {
    switch (action.type) {
        case 'FETCHING':
            state.fetching = action.fetching;
            return Object.assign({}, state);
        case 'GET_DATA':
            state = {
                list: [...action.newState],
                fetching: false,
            };
            return state;
        default:
            return state;
    }
};