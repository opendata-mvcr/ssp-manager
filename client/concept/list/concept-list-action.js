import {initializeCache, selectEntries} from "../concepts-cache";
import {loadEntities} from "../concept-api";
import {fetchLabel} from "app-service/labels";

export const FETCH_CONCEPTS_REQUEST = "FETCH_CONCEPTS_REQUEST";
export const FETCH_CONCEPTS_SUCCESS = "FETCH_CONCEPTS_SUCCESS";
export const FETCH_CONCEPTS_FAILED = "FETCH_CONCEPTS_FAILED";

export function fetchConcepts(queryString) {
    return (dispatch) => {
        dispatch(fetchConceptsRequest());
        initializeCache().then(() => selectEntries(queryString))
            .then((payload) => {
                const entities = loadEntities(payload);
                dispatch(fetchConceptsSuccess(payload, entities));
                fetchLabels(dispatch, entities);
            }).catch((error) => {
            if (error["type"] === "http") {
                dispatch(fetchConceptsFailed(error));
            } else {
                return Promise.reject(error);
            }
        })
    };
}

function fetchConceptsRequest() {
    return {
        "type": FETCH_CONCEPTS_REQUEST
    }
}

function fetchConceptsSuccess(payload, entities) {
    return {
        "type": FETCH_CONCEPTS_SUCCESS,
        "jsonld": payload,
        "entities": entities
    }
}

function fetchLabels(dispatch, entities) {
    const toRequest = new Set();
    entities.forEach((entity) => {
        entity["scheme"].forEach((iri) => toRequest.add(iri));
        entity["subClassOf"].forEach((iri) => toRequest.add(iri));
        entity["usedInGlossary"].forEach((iri) => toRequest.add(iri));
    });
    toRequest.forEach((iri) => dispatch(fetchLabel(iri)));
}

function fetchConceptsFailed(error) {
    return {
        "type": FETCH_CONCEPTS_FAILED,
        "status": error["status"]
    }
}
