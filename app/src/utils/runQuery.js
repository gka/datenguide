export default function(query, variables) {
    return new Promise((resolve, reject) => {
        fetch('https://api-next.datengui.de/graphql', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query, variables })
        })
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
}
