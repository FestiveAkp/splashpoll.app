import { QueryCache } from 'react-query';

export const queryCache = new QueryCache();

export const createPoll = async poll => {
    const response = await fetch('https://splashpoll-api.herokuapp.com/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(poll)
    });
    const data = await response.json();
    return data;
}

export const getPoll = async (_, id) => {
    const response = await fetch('https://splashpoll-api.herokuapp.com/api/polls/' + id);
    const data = await response.json();
    return data;
}

export const updatePoll = async ({data, id}) => {
    await fetch('https://splashpoll-api.herokuapp.com/api/polls/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}
