export const fetchGetData = (currentPage = 1, filter) => fetch('/table', {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify({
        mode: 'get',
        currentPage,
        filter,
    }),
});

export const fetchGetId = id => fetch('/table', {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify({
        mode: 'getId',
        id: id,
    }),
});

export const fetchSearch = (currentPage = 1, filter, selectAutocomplete) => fetch('/table', {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify({
        mode: 'search',
        textSearch: selectAutocomplete,
        currentPage,
        filter,
    }),
});

export const fetchSaveData = data => fetch('/table', {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify({
        mode: 'saveRow',
        data,
    }),
});

export const fetchChangeStatus = data => fetch('/table', {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify({
        mode: 'changeStatus',
        data,
    }),
});

export const fetchDeleteRow = data => fetch('/table', {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify({
        mode: 'deleteRow',
        id: data.id,
        currentPage: data.currentPage,
    }),
});

export const fetchAutocomplete = text => fetch('/table', {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify({
        mode: 'search',
        textSearch: text,
    }),
});