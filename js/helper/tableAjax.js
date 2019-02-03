export const fetchData = (page = 1) => fetch('/table', {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify({
        mode: 'get',
        page: page,
    }),
});