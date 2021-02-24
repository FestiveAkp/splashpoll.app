// Retrieve a single poll w/ error handling
export default async function getPoll(context) {
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
