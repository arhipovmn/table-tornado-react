import {fetchGetData, fetchSaveData, fetchChangeStatus} from '../helper/tableAjax';
import {popupAlert} from "../components/PopupAlert/PopupAlert.jsx";

export const getData = (dispatch, page = 1) => {
    dispatch({
        type: 'FETCHING',
        fetching: true,
    });
    fetchGetData(page)
        .then(response => response.json())
        .then(json => {
            if (!Object.keys(json).length) throw 'empty';
            dispatch({
                type: 'GET_DATA',
                newState: json,
                page: page,
            });
        }).catch(error => {
        popupAlert({
            text: error,
        });
        console.error(error);
    });
};

export const saveData = (dispatch, data) => {
    data.fetching(true);
    fetchSaveData({
        id: data.id,
        type: data.type,
        value: data.value,
    }).then(response => response.text()).then(text => {
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
        popupAlert({
            text: error,
            onKo: () => {
                data.fetching(false);
            },
        });
        console.error(error);
    });
};

export const changeStatus = (dispatch, data) => {
    data.fetching(true);
    fetchChangeStatus({
        id: data.id,
        status: data.status,
        trackNumber: data.trackNumber,
    }).then(response => response.json()).then(json => {
        if (!Object.keys(json).length) throw 'empty';
        if (json.status === 'error') throw 'error';
        data.date_type = json.type;
        data.date = json.date;
        dispatch({
            type: 'CHANGE_STATUS',
            data,
        });
        data.fetching(false);
    }).catch(error => {
        popupAlert({
            text: error,
            onKo: () => {
                data.fetching(false);
            },
        });
        console.error(error);
    });
};