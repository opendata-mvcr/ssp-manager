import {
    FETCH_STATUS_REQUEST,
    FETCH_STATUS_SUCCESS,
    FETCH_STATUS_FAILED,
    START_EXECUTION_REQUEST,
    START_EXECUTION_SUCCESS,
    START_EXECUTION_FAILED
} from "./lp-etl-action";

export const STATUS = {
    "initial": "initial",
    "running": "running",
    "finished": "finished",
    "failed": "failed"
};

const initialState = {
    "status": STATUS.initial,
    "fetching": false
};

const reducerName = "lp-etl";

function reducer(state = initialState, action) {
    switch (action["type"]) {
        case FETCH_STATUS_REQUEST:
            return onStatusRequest(state);
        case FETCH_STATUS_SUCCESS:
            return onStatusSuccess(state, action);
        case FETCH_STATUS_FAILED:
            return onStatusFailed(state, action);
        case START_EXECUTION_REQUEST:
            return onExecutionRequest(state);
        case START_EXECUTION_SUCCESS:
            return onExecutionSuccess(state, action);
        case START_EXECUTION_FAILED:
            return onExecutionFailed(state, action);
        default:
            return state;
    }
}

export default {
    "name": reducerName,
    "reducer": reducer
};

function onStatusRequest(state) {
    return {
        ...state,
        "fetching": true
    }
}

function onStatusSuccess(state, action) {
    return {
        ...state,
        "status": action.status,
        "fetching": false
    }
}

function onStatusFailed(state, action) {
    console.error("Can't get status:", action);
    return {
        ...state,
        "fetching": false
    }
}

function onExecutionRequest(state) {
    return {
        ...state,
        "fetching": true
    }
}

function onExecutionSuccess(state, action) {
    return {
        ...state,
        "status": STATUS.running,
        "fetching": false
    }
}

function onExecutionFailed(state, action) {
    console.error("Can't post new execution:", action);
    return {
        ...state,
        "fetching": false
    }
}

const reducerSelector = (state) => state[reducerName];

export function isFetchingSelector(state) {
    return reducerSelector(state)["fetching"];
}

export function statusSelector(state) {
    return reducerSelector(state)["status"];
}

