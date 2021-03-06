import {
    fetchGetData,
    fetchGetId,
    fetchSaveData,
    fetchChangeStatus,
    fetchDeleteRow,
    fetchSearch,
} from '../helper/tableAjax';
import {popupAlert} from '../components/PopupAlert/PopupAlert.jsx';
import {sendWebSocket} from '../app/webSocket';

export const getData = (dispatch, currentPage = 1, filter = '') => {
    dispatch({
        type: 'FETCHING',
        fetching: true,
    });
    fetchGetData(currentPage, filter)
        .then(response => response.json())
        .then(json => {
            dispatch({
                type: 'GET_DATA',
                newState: json,
                currentPage: currentPage,
            });
        }).catch(error => {
        console.error(error);
    });
};

export const getId = (dispatch, id) => {
    dispatch({
        type: 'FETCHING',
        fetching: true,
    });
    fetchGetId(id)
        .then(response => response.json())
        .then(json => {
            dispatch({
                type: 'GET_DATA',
                newState: json,
                currentPage: 1,
            });
        }).catch(error => {
        console.error(error);
    });
};

export const search = (dispatch, currentPage = 1, filter = '', selectAutocomplete) => {
    dispatch({
        type: 'FETCHING',
        fetching: true,
    });
    fetchSearch(currentPage, filter, selectAutocomplete)
        .then(response => response.json())
        .then(json => {
            if (!Object.keys(json).length) throw 'empty';
            dispatch({
                type: 'GET_DATA',
                newState: json.list,
                currentPage: currentPage,
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
        deliveryMethod: data.deliveryMethod,
        trackNumber: data.trackNumber,
    }).then(response => response.json()).then(json => {
        if (!Object.keys(json).length) throw 'empty';
        if (json.status === 'error') throw 'error';
        data.date_type = json.type;
        data.date = json.date;
        const action = {
            type: 'CHANGE_STATUS',
            data,
        };
        dispatch(action);
        sendWebSocket(action, window.store.getState().table.list[data.keyStore]);
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

export const deleteRow = (dispatch, data) => {
    dispatch({
        type: 'FETCHING',
        fetching: true,
    });
    fetchDeleteRow(data)
        .then(response => response.json())
        .then(json => {
            if (!Object.keys(json).length) throw 'empty';
            dispatch({
                type: 'GET_DATA',
                newState: json.list,
                currentPage: json.currentPage,
            });
        }).catch(error => {
        popupAlert({
            text: error,
        });
        console.error(error);
    });
};