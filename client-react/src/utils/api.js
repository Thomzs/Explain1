const URI = 'http://127.0.0.1:5000';

export const getTerritoryInfo = async (territory_id) => {
    const response = await fetch(`${URI}/territory/${territory_id}/info`);
    const body = await response.json();

    if (response.status !== 200) {
        throw new Error(body.message)
    }
    return body;
}

export const getTerritoryChildren = async (territory_id) => {
    const response = await fetch(`${URI}/territory/${territory_id}/children`);
    const body = await response.json();

    console.log(body);
    if (response.status !== 200) {
        throw new Error(body.message)
    }
    return body;
}

export const getTerritoryByName = async (territory_name) => {
    const response = await fetch(`${URI}/search/${territory_name}`);
    const body = await response.json();

    console.log(body);
    if (response.status !== 200) {
        throw new Error(body.message)
    }
    return body;
}