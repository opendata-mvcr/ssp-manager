import jsonld from "app-service/jsonld";
import {SKOS, RDFS} from "./vocabulary";
import {FETCH_LABEL_REQUEST} from "./labels-action";

const initialState = {
    "languages": ["cs", ""],
    "labels": {}
};

const reducerName = "labels";

function reducer(state = initialState, action) {
    if (action["type"] === FETCH_LABEL_REQUEST) {
        return onFetchLabelRequest(state, action);
    }
    if (action["jsonld"] !== undefined) {
        return onJsonld(state, action);
    }
    return state;
}

export default {
    "name": reducerName,
    "reducer": reducer
};

function onFetchLabelRequest(state, action) {
    if (state["labels"][action["iri"]] !== undefined) {
        return state;
    }
    return {
        ...state,
        "labels" : {
            ...state["labels"],
            [action["iri"]] : {
                "@id": action["iri"]
            }
        }
    }
}

function onJsonld(state, action) {
    const labels = {...state["labels"]};
    jsonld.iterateResources(action["jsonld"], (entity) => {
        const iri = jsonld.id(entity);
        let newLabelEntry = {
            "@id": iri,
            ...labels[iri]
        };
        merge(newLabelEntry, jsonld.string(entity, SKOS.prefLabel));
        merge(newLabelEntry, jsonld.string(entity, RDFS.label));
        labels[iri] = newLabelEntry;
    });
    return {
        ...state,
        "labels": labels
    };
}

function merge(labels, newLabels) {
    if (newLabels === undefined) {
        return;
    }
    for (let key in newLabels) {
        if (!newLabels.hasOwnProperty(key) ) {
            continue;
        }
        // TODO Introduce some form of a merging strategy.
        const filteredNewValues = filterEmpty(newLabels[key]);
        if (filteredNewValues.length > 0) {
            labels[key] = filteredNewValues;
        }
    }
}

function filterEmpty(values) {
    return values.filter(value => value !== "")
}

const reducerSelector = (state) => state[reducerName];

export function labelsSelector(state) {
    return reducerSelector(state);
}







