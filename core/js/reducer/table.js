export default function reducer(state = [], action) {
    switch (action.type) {
        case 'GET_DATA':
            return [...action.newState];
        default:
            return state;
    }
};