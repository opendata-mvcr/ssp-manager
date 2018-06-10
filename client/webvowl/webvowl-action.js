import {postJson} from "app-service/http";
import {conceptsDataSelector} from "concept/list/concept-list-reducer";
import {isVisibleSelector} from "./webvowl-reducer";

export const VISUALISE_WEBVOWL_REQUEST = "VISUALISE_WEBVOWL_REQUEST";
export const VISUALISE_WEBVOWL_SUCCESS = "VISUALISE_WEBVOWL_SUCCESS";
export const VISUALISE_WEBVOWL_FAILED = "VISUALISE_WEBVOWL_FAILED";
export const VISUALISE_WEBVOWL_CANCEL = "VISUALISE_WEBVOWL_CANCEL";

export function visualiseState() {
    return (dispatch, getState) => {
        dispatch(request());
        const concepts = conceptsDataSelector(getState());
        const iris = concepts.map((object) => object["@id"]);
        const body = {"iris": iris};
        postJson("./api/v1/webvowl", body).then((response) => {
            if (isVisibleSelector(getState())) {
                openWebVowl(response);
                dispatch(requestSuccess(response));
            }
        }).catch((error) => {
            console.error("", error);
            requestFailed(error);
        });
    };
}


function request() {
    return {
        "type": VISUALISE_WEBVOWL_REQUEST
    }
}

function openWebVowl(response) {
    const dataUrl = encodeURIComponent(response["iri"]);
    const url = "http://www.visualdataweb.de/webvowl/#iri=" + dataUrl;
    window.open(url, "_blank");
}


function requestSuccess() {
    return {
        "type": VISUALISE_WEBVOWL_SUCCESS
    }
}

function requestFailed() {
    return {
        "type": VISUALISE_WEBVOWL_FAILED
    }
}

export function cancel() {
    return {
        "type": VISUALISE_WEBVOWL_CANCEL
    }
}