import {
    initializeCache,
    selectEntries,
    selectEntity

} from "../concepts-cache";
import {loadEntities, loadEntity} from "../concept-api";
import {fetchLabel} from "app-service/labels";

export const FETCH_CONCEPTS_REQUEST = "FETCH_CONCEPTS_REQUEST";
export const FETCH_CONCEPTS_SUCCESS = "FETCH_CONCEPTS_SUCCESS";
export const FETCH_CONCEPTS_FAILED = "FETCH_CONCEPTS_FAILED";

export const FETCH_CONCEPT_SUB_CLASS_SUCCESS = "FETCH_CONCEPT_SUB_CLASS_SUCCESS";

export function fetchConcepts(queryString) {
    return (dispatch) => {
        dispatch(fetchConceptsRequest());
        initializeCache().then(() => selectEntries(queryString))
            .then((payload) => {
                const entities = loadEntities(payload);
                dispatch(fetchConceptsSuccess(payload, entities));
                fetchLabels(dispatch, entities);
                fetchBroader(dispatch, entities);
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
        entity["usedInGlossary"].forEach((iri) => toRequest.add(iri));
    });
    toRequest.forEach((iri) => dispatch(fetchLabel(iri)));
}

function fetchBroader(dispatch, entities) {
    const toRequest = new Set();
    entities.forEach((entity) => {
        entity["broader"].forEach((iri) => toRequest.add(iri));
    });
    // Remove those already loaded.
    entities.forEach((entity) => {
        toRequest.delete(entity["@id"]);
    });
    toRequest.forEach((iri) => dispatch(fetchConcept(iri)));
}

function fetchConcept(iri) {
    return (dispatch) => {
        selectEntity(iri).then((payload) => {
            const entity = loadEntity(payload);
            dispatch(fetchConceptSuccess(payload, entity));
            fetchLabels(dispatch, [entity]);
        }).catch((error) => {
            console.log("Can't find detail for concept.", iri);
        });
    };
}

function fetchConceptSuccess(payload, entity) {
    return {
        "type": FETCH_CONCEPT_SUB_CLASS_SUCCESS,
        "jsonld": payload,
        "entity": entity
    }
}


function fetchConceptsFailed(error) {
    return {
        "type": FETCH_CONCEPTS_FAILED,
        "status": error["status"]
    }
}
