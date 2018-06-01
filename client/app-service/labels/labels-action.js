import {getJson} from "app-service/http";
import {labelsSelector} from "./labels-reducer";

export const FETCH_LABEL_REQUEST = "FETCH_LABEL_REQUEST";
export const FETCH_LABEL_SUCCESS = "FETCH_LABEL_SUCCESS";

export function fetchLabel(iri) {
    const url = "api/v1/labels?iri=" + encodeURI(iri);
    return (dispatch, getState) => {
        const state = labelsSelector(getState());
        if (state["labels"][iri] !== undefined) {
            // We already have some data.
            return;
        }
        dispatch(fetchLabelRequest(iri));
        getJson(url).then((payload) => {
            dispatch(fetchLabelSuccess(payload));
        });
    }
}

function fetchLabelRequest(iri) {
    return {
        "type": FETCH_LABEL_REQUEST,
        "iri": iri
    }
}

function fetchLabelSuccess(jsonld) {
    return {
        "type": FETCH_LABEL_SUCCESS,
        "jsonld": jsonld
    }
}
