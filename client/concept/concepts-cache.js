import {default as jsonld, helpers} from "app-service/jsonld";
import {SKOS, SSP} from "./vocabulary";
import {getJson} from "app-service/http";

let cache = null;

export function initializeCache() {
    if (cache === null) {
        return getJson("./api/v1/concepts").then((payload) => {
            cache = [];
            addDataToCache(payload);
        });
    }
    return Promise.resolve();
}

function addDataToCache(payload) {
    jsonld.iterateResources(payload, (resource) => {
        if (!isConceptResource(resource)) {
            return;
        }
        const searchLabel = helpers.stringToArray(
            jsonld.string(resource, SKOS.prefLabel)).join(" ");
        cache.push({
            "label": sanitizeQueryString(searchLabel),
            "@id": jsonld.id(resource),
            "resource": resource
        })
    });
}

function isConceptResource(resource) {
    const types = jsonld.types(resource);
    return types.includes(SSP.Object) ||
        types.includes(SSP.Property) ||
        types.includes(SSP.Relation);
}

function sanitizeQueryString(str) {
    let strLower = str.toLowerCase();
    let output = "";
    for (let index = 0; index < str.length; index++) {
        const char = strLower[index];
        output += CHAR_MAP[char] || char;
    }
    return output;
}

const CHAR_MAP = {
    "ě": "e",
    "š": "s",
    "č": "c",
    "ř": "r",
    "ž": "z",
    "ý": "y",
    "á": "a",
    "í": "i",
    "é": "e",
    "ú": "u",
    "ů": "u"
};

export function selectEntries(queryString) {
    if (queryString === undefined || queryString === "") {
        return Promise.resolve({"@graph": []});
    }
    const sanitizedQueryString = sanitizeQueryString(queryString);
    const output = [];
    cache.forEach((item) => {
        if (item["label"].search(sanitizedQueryString) > -1) {
            output.push(item["resource"]);
        }
    });
    return Promise.resolve({"@graph": output});
}

export function selectEntity(iri) {
    for (let index in cache) {
        const item = cache[index];
        if (item["@id"] === iri) {
            return Promise.resolve({"@graph": [item["resource"]]});
        }
    }
    return Promise.reject();
}