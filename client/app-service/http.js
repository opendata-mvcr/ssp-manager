export const STATUS_INITIAL = "initial";
export const STATUS_FETCHING = "fetching";
export const STATUS_FETCHED = "fetched";
export const STATUS_FAILED = "failed";

// TODO Fetch API have options for: cache, headers (Accept), redirect

export function getJson(url) {
    return fetch(url).then(json);
}

function json(response) {
    if (response.status > 199 && response.status < 300) {
        return response.json();
    }
    console.log("Request failed.", response);
    return Promise.reject({
        "type": "http",
        "status": response.status
    })
}

export function postJson(url, body) {
    return fetch(url, {
        "body": JSON.stringify(body),
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
    }).then(json);
}

export function isLoading(status) {
    return status === undefined || status !== STATUS_FETCHED;
}

export function hasFailed(status) {
    return status === STATUS_FAILED;
}
