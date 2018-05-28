const SSP_PREFIX = "https://ssp.opendata.cz/slovník/základní/pojem/";

export const SSP = {
    "Object": SSP_PREFIX + "typ-objektu",
    "Property": SSP_PREFIX + "typ-vlastnosti",
    "Relation": SSP_PREFIX + "typ-vztahu"
};

const APP_PREFIX = "https://skod.opendata.cz/slovník/aplikační/";
export const APP = {
    "pouzitVGlosari" : APP_PREFIX + "pouzitVGlosari",
    "excel"  : APP_PREFIX + "excel"
};

const SKOS_PREFIX = "http://www.w3.org/2004/02/skos/core#";
export const SKOS = {
    "prefLabel" : SKOS_PREFIX + "prefLabel",
    "inScheme" : SKOS_PREFIX + "inScheme"
};

const DCT_PREFIX = "http://purl.org/dc/terms/";
export const DCT = {};

const RDFS_PREFIX = "http://www.w3.org/2000/01/rdf-schema#";
export const RDFS = {
    "subClassOf" : RDFS_PREFIX + "subClassOf",
    "label": RDFS_PREFIX + "label"
};

const OWL_PREFIX = "http://www.w3.org/2002/07/owl#";
export const OWL = {};


const DCAT_PREFIX = "http://www.w3.org/ns/dcat#";
export const DCAT = {};


