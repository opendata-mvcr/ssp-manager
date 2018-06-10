import {
    FETCH_CONCEPTS_REQUEST,
    FETCH_CONCEPTS_SUCCESS,
    FETCH_CONCEPTS_FAILED
} from "./concept-list-action";
import {STATUS_INITIAL} from "app-service/http";
import {
    STATUS_FAILED,
    STATUS_FETCHED,
    STATUS_FETCHING
} from "app-service/http";

const initialState = {
    "status": STATUS_INITIAL,
    "error": {},
    "data": []
};

const reducerName = "concept-list";

function reducer(state = initialState, action) {
    switch (action["type"]) {
        case FETCH_CONCEPTS_REQUEST:
            return onConceptsRequest(state);
        case FETCH_CONCEPTS_SUCCESS:
            return onConceptsSuccess(state, action);
        case FETCH_CONCEPTS_FAILED:
            return onConceptsFailed(state, action);
        default:
            return state;
    }
}

export default {
    "name": reducerName,
    "reducer": reducer
};

function onConceptsRequest(state) {
    return {
        ...state,
        "status": STATUS_FETCHING,
        "data": []
    }
}

function onConceptsSuccess(state, action) {
    const entities = action["entities"];
    entities.sort((left, right) =>
        left["sortLabel"].localeCompare(right["sortLabel"]));
    return {
        ...state,
        "status": STATUS_FETCHED,
        "data": entities
    }
}


function onConceptsFailed(state, action) {
    return {
        ...state,
        "status": STATUS_FAILED,
        "error": {
            "status": action["status"]
        }
    }
}


const reducerSelector = (state) => state[reducerName];

export function conceptsStatusSelector(state) {
    return reducerSelector(state)["status"];
}

export function conceptsDataSelector(state) {
    return reducerSelector(state)["data"];
}

export function conceptsFetchErrorSelector(state) {
    return reducerSelector(state)["error"];
}