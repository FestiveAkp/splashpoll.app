import Pusher from 'pusher-js';

// Create a new poll w/ error handling
export async function createPollRequest(newPoll) {
    // Fetch poll from API
    const response = await fetch('https://splashpoll-api.herokuapp.com/v1/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(newPoll)
    });

    // Handle HTTP errors
    if (!response.ok) {
        throw new Error(response.status);
    }

    // Return the data
    const data = await response.json();
    return data;
}

// Retrieve a single poll w/ error handling
export async function getPollRequest(context) {
    // Fetch poll from API
    const id = context.params.id;
    const response = await fetch('https://splashpoll-api.herokuapp.com/v1/polls/' + id);

    // Handle HTTP errors
    if (!response.ok) {
        console.log(response.status);
        if (response.status === 404) {
            context.res.statusCode = 404;
            return { props: { error: true, status: '404' } };
        } else {
            context.res.statusCode = 500;
            return { props: { error: true, status: '500' } };
        }
    }

    // Return the data
    const data = await response.json();
    return { props: data };
}

// Submit votes for a single poll w/ error handling
export async function voteRequest(id, data) {
    const response = await fetch('https://splashpoll-api.herokuapp.com/v1/polls/' + id + '/vote', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(response.status);
    }
}

// Acquire Pusher instance for listening to poll votes
export function getVotesListener(id, callback) {
    // Start streaming poll results from server
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;
    const pusher = new Pusher('132012a7ff56d99a91a8', { cluster: 'us2' });
    const channel = pusher.subscribe(`polls.${id}`);
    channel.bind('PollVotesUpdated', callback);
    return pusher;
}
