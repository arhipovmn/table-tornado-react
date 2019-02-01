import {fetchData} from '../helper/tableAjax';

export const getData = dispatch => {
    fetchData().then(responce => {
        responce.json().then(json => {
            if (!Object.keys(json).length) throw 'empty';
            return dispatch({
                type: 'GET_DATA',
                newState: json,
            });
        }).catch(error => {
            console.error(error);
        });
    }).catch(error => {
        console.error(`nor responce ${error}`);
    });
};