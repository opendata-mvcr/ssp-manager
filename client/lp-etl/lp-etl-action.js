import {getJson, post} from "app-service/http";
import {STATUS} from "./lp-etl-reducer";

export const FETCH_STATUS_REQUEST = "FETCH_STATUS_REQUEST";
export const FETCH_STATUS_SUCCESS = "FETCH_STATUS_SUCCESS";
export const FETCH_STATUS_FAILED = "FETCH_STATUS_FAILED";

export const START_EXECUTION_REQUEST = "START_EXECUTION_REQUEST";
export const START_EXECUTION_SUCCESS = "START_EXECUTION_SUCCESS";
export const START_EXECUTION_FAILED = "START_EXECUTION_FAILED";

let timer = null;

export function executePipeline() {
    return (dispatch) => {
        dispatch(startExecutionRequest());
        post("./api/v1/lp-etl").then((status) => {
            dispatch(startExecutionSuccess(status));
            startMonitoring(dispatch);
        }).catch((error) => {
            dispatch(startExecutionFailed(error));
        });
    };
}

function startExecutionRequest() {
    return {
        "type": START_EXECUTION_REQUEST
    }
}

function startExecutionSuccess(payload) {
    return {
        "type": START_EXECUTION_SUCCESS,
        "payload": payload
    }
}

function startExecutionFailed(error) {
    return {
        "type": START_EXECUTION_FAILED,
        "error": error
    }
}

function startMonitoring(dispatch) {
    clearInterval(timer);
    timer = setInterval(() => dispatch(fetchStatus()), 7 * 1000);
    console.log("Start monitoring.")
}

function fetchStatus() {
    return (dispatch) => {
        dispatch(fetchStatusRequest());
        getJson("./api/v1/lp-etl").then((payload) => {
            const status = parseStatusResponse(payload);
            if (status !== STATUS.running) {
                stopMonitoring();
            }
            dispatch(fetchStatusSuccess(status));
        }).catch((error) => {
            dispatch(fetchStatusFailed(error));
        });
    };
}

function fetchStatusRequest() {
    return {
        "type": FETCH_STATUS_REQUEST
    }
}

function parseStatusResponse(payload) {
    switch (payload.status) {
        case "initial":
            return STATUS.initial;
        case "running":
            return STATUS.running;
        case "finished":
            return STATUS.finished;
        case "failed":
            return STATUS.finished;
        default:
            console.error("Unknown status:", payload);
            return STATUS.initial;
    }
}

function stopMonitoring() {
    clearInterval(timer);
    timer = null;
    console.log("Stop monitoring.")
}

function fetchStatusSuccess(status) {
    return {
        "type": FETCH_STATUS_SUCCESS,
        "status": status
    }
}

function fetchStatusFailed(error) {
    return {
        "type": FETCH_STATUS_FAILED,
        "error": error
    }
}