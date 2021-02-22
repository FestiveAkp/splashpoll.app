// Create a new poll w/ error handling
export default async function createPollRequest(newPoll) {
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
