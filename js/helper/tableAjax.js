export const fetchData = () => {
    return fetch('/table', {
            method: 'POST',
            cache: 'no-cache',
            body: JSON.stringify({
                mode: 'get',
                page: 1,
            }),
        });
};