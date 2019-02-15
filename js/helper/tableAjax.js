export const fetchGetData = (currentPage = 1) => fetch('/table', {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify({
        mode: 'get',
        currentPage: currentPage,
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