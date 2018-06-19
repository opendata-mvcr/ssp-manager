import {postJson} from "app-service/http";
import {conceptsDataSelector} from "concept/list/concept-list-reducer";
import {isVisibleSelector} from "./webvowl-reducer";

export const VISUALISE_WEBVOWL_REQUEST = "VISUALISE_WEBVOWL_REQUEST";
export const VISUALISE_WEBVOWL_SHOW_URL = "VISUALISE_WEBVOWL_SHOW_URL";
export const VISUALISE_WEBVOWL_FAILED = "VISUALISE_WEBVOWL_FAILED";
export const VISUALISE_WEBVOWL_CLOSE = "VISUALISE_WEBVOWL_CLOSE";

export function visualiseState() {
    return (dispatch, getState) => {
        dispatch(request());
        const concepts = conceptsDataSelector(getState());
        const iris = concepts.map((object) => object["@id"]);
        const body = {"iris": iris};
        postJson("./api/v1/webvowl", body).then((response) => {
            if (isVisibleSelector(getState())) {
                const url = getWebOvwlUrl(response);
                if (openWebVowl(url)) {
                    dispatch(close(response));
                } else {
                    dispatch(showUrl(url))
                }
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

function getWebOvwlUrl(response) {
    return GLOBAL_CONFIG.WEBOVWL + "#iri=" + encodeURI(response["iri"]);
}

function openWebVowl(url) {
    return window.open(url, "_blank") !== null;
}

function showUrl(url) {
    return {
        "type": VISUALISE_WEBVOWL_SHOW_URL,
        "url": url
    }
}

function requestFailed() {
    return {
        "type": VISUALISE_WEBVOWL_FAILED
    }
}

export function close() {
    return {
        "type": VISUALISE_WEBVOWL_CLOSE
    }
}