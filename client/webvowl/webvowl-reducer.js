import {
    VISUALISE_WEBVOWL_REQUEST,
    VISUALISE_WEBVOWL_SHOW_URL,
    VISUALISE_WEBVOWL_FAILED,
    VISUALISE_WEBVOWL_CLOSE
} from "./webvowl-action";

export const STATUS_LOADING = "STATUS_LOADING";
export const STATUS_SHOW_URL = "STATUS_SHOW_URL";
export const STATUS_FAILED = "STATUS_FAILED";

const initialState = {
    "isVisible": false,
    "status": "",
    "url": ""
};

const reducerName = "webvowl";

function reducer(state = initialState, action) {
    switch (action["type"]) {
        case VISUALISE_WEBVOWL_REQUEST:
            return onRequest(state);
        case VISUALISE_WEBVOWL_SHOW_URL:
            return onShowUtl(state, action);
        case VISUALISE_WEBVOWL_FAILED:
            return onRequestFailed(state);
        case VISUALISE_WEBVOWL_CLOSE:
            return onClose(state);
        default:
            return state;
    }
}

export default {
    "name": reducerName,
    "reducer": reducer
};

function onRequest(state) {
    return {
        ...state,
        "isVisible": true,
        "status": STATUS_LOADING
    }
}

function onShowUtl(state, action) {
    return {
        ...state,
        "isVisible": true,
        "status": STATUS_SHOW_URL,
        "url": action["url"]
    }
}


function onRequestFailed(state) {
    return {
        ...state,
        "isVisible": true,
        "status": STATUS_FAILED
    }
}

function onClose(state) {
    return {
        ...state,
        "isVisible": false,
    }
}


const reducerSelector = (state) => state[reducerName];

export function isVisibleSelector(state) {
    return reducerSelector(state)["isVisible"]
}

export function statusSelector(state) {
    return reducerSelector(state)["status"]
}

export function urlSelector(state) {
    return reducerSelector(state)["url"]
}
