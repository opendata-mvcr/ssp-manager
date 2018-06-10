const fs = require("fs");
const express = require("express");

const request = require("request");
const bodyParser = require('body-parser');

const config = require("../config");
const fileStorage = require("../modules/file-storage");

let requestCounter = 0;
const cacheSize = 32;

(function initialize() {
    const router = express.Router();

    router.post("", bodyParser.json(), createPrepareDataFunction());
    router.get("/:name", bodyParser.json(), createGetDataFunction());

    module.exports = router;
})();

function createPrepareDataFunction() {
    return (req, res) => {

        const index = ++requestCounter % cacheSize;
        const name = "query-cache-" + zfill(index, 2);
        const path = fileStorage.get(name);
        const query = createSparqlQuery(req.body["iris"]);

        // Use post to query virtuoso.
        const form = {
            "format": "text/turtle",
            "timeout": 0,
            "query": query
        };
        const stream = request.post(config.endpoint, {"form": form})
            .pipe(fs.createWriteStream(path));

        stream.on("finish", () => {
            res.json({"iri": config["url"] + "/api/v1/webvowl/" + name});
        });
    }
}

function zfill(number, size) {
    number = number.toString();
    while (number.length < size) number = "0" + number;
    return number;
}

function createSparqlQuery(iris) {
    let values = iris.map((value) => "    <" + value + ">").join("\n");
    return `
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

CONSTRUCT {

  ?pojem a ?typPojmu ;
    rdfs:label ?nazevPojmuNazevGlosare ;
    rdfs:subClassOf ?specializovanyPojem1 .

  ?zobrazenyPojem a ?typZobrazenehoPojmu ;
    rdfs:label ?nazevZobrazenehoPojmuNazevGlosare ;
    rdfs:subClassOf ?specializovanyPojem .

  ?specializovanyPojem a ?typSpecializovanehoPojmu ;
    rdfs:label ?nazevSpecializovanehoPojmuNazevGlosare .

} WHERE {

  VALUES ?pojem {
` + values + `
  }

  ?pojem a ?typPojmu ;
    skos:prefLabel ?nazevPojmu ;
    skos:inScheme ?glosarPojmu ;
    rdfs:subClassOf ?specializovanyPojem1 .

  FILTER (?typPojmu != skos:Concept)

  ?glosarPojmu rdfs:label ?nazevGlosare .

  BIND(CONCAT(?nazevPojmu, " (", ?nazevGlosare, ")") AS ?nazevPojmuNazevGlosare)

  {
    SELECT ?zobrazenyPojem ?pojem
    WHERE {
      ?pojem rdfs:subClassOf/rdfs:subClassOf* ?zobrazenyPojem .
    }
  } UNION {
    SELECT ?zobrazenyPojem ?pojem
    WHERE {
      ?zobrazenyPojem rdfs:subClassOf/rdfs:subClassOf* ?pojem .
    }
  }

  ?zobrazenyPojem a ?typZobrazenehoPojmu ;
    skos:prefLabel ?nazevZobrazenehoPojmu ;
    skos:inScheme ?glosarZobrazenehoPojmu .

  FILTER (?typZobrazenehoPojmu != skos:Concept)

  ?glosarZobrazenehoPojmu rdfs:label ?nazevGlosareZobrazenehoPojmu .

  BIND(CONCAT(?nazevZobrazenehoPojmu, " (", ?nazevGlosareZobrazenehoPojmu, ")") AS ?nazevZobrazenehoPojmuNazevGlosare)

  OPTIONAL {
    ?zobrazenyPojem rdfs:subClassOf ?specializovanyPojem .

    ?specializovanyPojem a ?typSpecializovanehoPojmu ;
      skos:prefLabel ?nazevSpecializovanehoPojmu ;
      skos:inScheme ?glosarSpecializovanehoPojmu .

    FILTER (?typSpecializovanehoPojmu != skos:Concept)

    ?glosarSpecializovanehoPojmu rdfs:label ?nazevGlosareSpecializovanehoPojmu .

    BIND(CONCAT(?nazevSpecializovanehoPojmu, " (", ?nazevGlosareSpecializovanehoPojmu, ")") AS ?nazevSpecializovanehoPojmuNazevGlosare)
  }
}`;
}

function createGetDataFunction() {
    return (req, res) => {
        const name = req.params.name;
        if (!isSaveFileName(name)) {
            res.status(403);
            res.json({
                "error": "Invalid path."
            });
            return;
        }
        const path = fileStorage.get(name);
        streamFileToResponse(res, path, "text/turtle");
    }
}

function isSaveFileName(str) {
    // TODO We can check for a pattern as we known how it should look.
    return str.indexOf(".") === -1
}

function streamFileToResponse(response, filePath, type) {
    fs.stat(filePath, (error, stat) => {
        if (error) {
            // TODO Send error response.
            throw error;
        }
        response.writeHead(200, {
            "Content-Type": type,
            "Content-Length": stat.size
        });
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(response);
    });
}
