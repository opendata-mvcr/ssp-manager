import {
    VISUALISE_WEBVOWL_REQUEST,
    VISUALISE_WEBVOWL_SUCCESS,
    VISUALISE_WEBVOWL_FAILED,
    VISUALISE_WEBVOWL_CANCEL
} from "./webvowl-action";

const initialState = {
    "isVisible": false,
    "message": ""
};

const reducerName = "webvowl";

function reducer(state = initialState, action) {
    switch (action["type"]) {
        case VISUALISE_WEBVOWL_REQUEST:
            return onRequest(state);
        case VISUALISE_WEBVOWL_SUCCESS:
            return onRequestSuccess(state);
        case VISUALISE_WEBVOWL_FAILED:
            return onRequestFailed(state);
        case VISUALISE_WEBVOWL_CANCEL:
            return onCancel(state);
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
        "message": "Preparing data ..."
    }
}

function onRequestSuccess(state) {
    return {
        ...state,
        "isVisible": false
    }
}


function onRequestFailed(state) {
    return {
        ...state,
        "isVisible": true,
        "message": "Operation failed see logs for more details."
    }
}

function onCancel(state) {
    return {
        ...state,
        "isVisible": false,
    }
}


const reducerSelector = (state) => state[reducerName];

export function isVisibleSelector(state) {
    return reducerSelector(state)["isVisible"]
}

export function messageSelector(state) {
    return reducerSelector(state)["message"]
}