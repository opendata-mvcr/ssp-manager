import {
    FETCH_CONCEPTS_REQUEST,
    FETCH_CONCEPTS_SUCCESS,
    FETCH_CONCEPTS_FAILED,
    FETCH_CONCEPT_SUB_CLASS_SUCCESS
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
    "data": [],
    "entities": {}
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
        case FETCH_CONCEPT_SUB_CLASS_SUCCESS:
            return onFetchSubClass(state, action);
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
    const data = action["entities"];
    data.sort((left, right) =>
        left["sortLabel"].localeCompare(right["sortLabel"]));
    const entities = {};
    action["entities"].forEach((item) => {
        entities[item["@id"]] = item;
    });
    return {
        ...state,
        "status": STATUS_FETCHED,
        "data": data,
        "entities" : entities
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

function onFetchSubClass(state, action) {
    return {
        ...state,
        "entities" : {
            ...state["entities"],
            [action["entity"]["@id"]]: action["entity"]
        }
    };
}

const reducerSelector = (state) => state[reducerName];

export function conceptsStatusSelector(state) {
    return reducerSelector(state)["status"];
}

/**
 * Return data to visualise.
 */
export function conceptsDataSelector(state) {
    return reducerSelector(state)["data"];
}

export function conceptsFetchErrorSelector(state) {
    return reducerSelector(state)["error"];
}


/**
 * Return all stored entities in dictionary under IRI.
 */
export function entitiesSelector(state) {
    return reducerSelector(state)["entities"];
}
