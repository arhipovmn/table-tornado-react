import {fetchData} from '../helper/tableAjax';

export const getData = (dispatch, page = 1) => {
    dispatch({
        type: 'FETCHING',
        fetching: true,
    });
    fetchData(page).then(response => {
        response.json().then(json => {
            if (!Object.keys(json).length) throw 'empty';
            return dispatch({
                type: 'GET_DATA',
                newState: json,
                page: page
            });
        }).catch(error => {
            console.error(error);
        });
    }).catch(error => {
        console.error(`nor response ${error}`);
    });
};