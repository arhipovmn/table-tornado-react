export const fetchAuth = (login, password) => fetch('/auth', {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify({
        login,
        password,
    }),
});