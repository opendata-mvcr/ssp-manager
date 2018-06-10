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

// TODO Fetch data from Virtuoso.
const DATA = {
    "@graph": [
        {
            "@id": "https://ssp.opendata.cz/slovn\u00EDk/legislativn\u00ED/p\u0159edpis/111/2009/pojem/Registr-obyvatel",
            "@type": "https://ssp.opendata.cz/slovn\u00EDk/z\u00E1kladn\u00ED/pojem/typ-objektu",
            "http://www.w3.org/2000/01/rdf-schema#subClassOf": {"@id": "https://ssp.opendata.cz/slovn\u00EDk/z\u00E1kladn\u00ED/pojem/objekt-pr\u00E1va"},
            "http://www.w3.org/2004/02/skos/core#prefLabel": {
                "@value": "Registr obyvatel",
                "@language": "cs"
            },
            "https://skod.opendata.cz/slovn\u00EDk/aplika\u010Dn\u00ED/excel": "Registr obyvatel (111/2009)",
            "http://www.w3.org/2004/02/skos/core#inScheme": {"@id": "https://ssp.opendata.cz/slovn\u00EDk/legislativn\u00ED/p\u0159edpis/111/2009/glos\u00E1\u0159"},
            "https://skod.opendata.cz/slovn\u00EDk/aplika\u010Dn\u00ED/pouzitVGlosari": {"@id": "https://ssp.opendata.cz/slovn\u00EDk/legislativn\u00ED/p\u0159edpis/111/2009/glos\u00E1\u0159"}
        }
    ]
};
