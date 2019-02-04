import {fetchGetData, fetchSaveData} from '../helper/tableAjax';

export const getData = (dispatch, page = 1) => {
    dispatch({
        type: 'FETCHING',
        fetching: true,
    });
    fetchGetData(page).then(response => {
        response.json().then(json => {
            if (!Object.keys(json).length) throw 'empty';
            dispatch({
                type: 'GET_DATA',
                newState: json,
                page: page,
            });
        }).catch(error => {
            console.error(error);
        });
    }).catch(error => {
        console.error(`not response ${error}`);
    });
};

export const saveData = (dispatch, data) => {
    data.fetching(true);
    fetchSaveData(data).then(response => {
        response.text().then(text => {
            if (!Object.keys(text).length) throw 'empty';
            if (text === 'ok') {
                dispatch({
                    type: 'SAVE_DATA',
                    data,
                });
                data.fetching(false);
            } else {
                throw text;
            }
        }).catch(error => {
            data.fetching(false);
            console.error(error);
        });
    }).catch(error => {
        data.fetching(false);
        console.error(`not response ${error}`);
    });
};