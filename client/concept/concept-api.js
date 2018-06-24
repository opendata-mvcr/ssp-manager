import {default as jsonld, helpers} from "../app-service/jsonld";
import {SKOS, RDFS, APP, SSP} from "./vocabulary";

export function loadEntities(jsonLdPayload) {
    const output = [];
    jsonld.iterateResources(jsonLdPayload, (resource) => {
        if (isConceptResource(resource)) {
            const entity = resourceToEntity(resource);
            output.push(entity);
        }
    });
    return output;
}

function resourceToEntity(resource) {
    const sortLabel = helpers.stringToArray(
        jsonld.string(resource, SKOS.prefLabel)
    ).join(" ").toLowerCase();
    return {
        "@id": jsonld.id(resource),
        "@type": jsonld.types(resource),
        "sortLabel": sortLabel,
        "scheme": jsonld.refs(resource, SKOS.inScheme),
        "broader": jsonld.refs(resource, SKOS.broader),
        "usedInGlossary": jsonld.refs(resource, APP.pouzitVGlosari),
        "excel": jsonld.values(resource, APP.excel)
    }
}

function isConceptResource(resource) {
    const types = jsonld.types(resource);
    return types.includes(SSP.Object) ||
        types.includes(SSP.Property) ||
        types.includes(SSP.Relation);
}

export function loadEntity(jsonLdPayload) {
    return jsonld.iterateResources(jsonLdPayload, (resource) => {
        if (isConceptResource(resource)) {
            return resourceToEntity(resource);
        }
    });
}
