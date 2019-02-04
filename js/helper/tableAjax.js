export const fetchGetData = (page = 1) => fetch('/table', {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify({
        mode: 'get',
        page: page,
    }),
});

export const fetchSaveData = data => fetch('/table', {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify({
        mode: 'save',
        data,
    }),
});
