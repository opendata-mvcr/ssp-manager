import React from "react";
import {PropTypes} from "prop-types";
import {SSP} from "../vocabulary";
import {Container} from "reactstrap";
import {selectLabel} from "labels";

export const ConceptListComponent = ({data, labels}) => {
    if (data.length === 0){
        return (
            <div style={{"marginTop" : "4rem", "textAlign": "center"}}>
                Začni vyhledáním pojmu, v pravém horním rohu.
            </div>
        )
    }
    const groups = splitByScheme(data);
    return (
        <Container fluid={true}>
            {Object.keys(groups).map((key) => (
                <ConceptGroup
                    key={key}
                    scheme={key}
                    data={groups[key]}
                    labels={labels}/>
            ))}
        </Container>
    )
};

ConceptListComponent.propTypes = {
    "data": PropTypes.array.isRequired,
    "labels": PropTypes.any.isRequired
};

function splitByScheme(data) {
    const output = {};
    data.forEach((entry) => {
        const schemes = entry["scheme"] || [null];
        schemes.forEach((scheme) => {
            if (output[scheme] === undefined) {
                output[scheme] = [];
            }
            output[scheme].push(entry)
        });
    });
    return output;
}

const ConceptGroup = ({scheme, data, labels}) => {
    const dataByType = splitByType(data);
    return (
        <div>
            <h2 style={{"textAlign": "center"}}>
                <a href={scheme} target="_blank">
                    {selectLabel(labels, scheme)}
                </a>
            </h2>
            <ConceptTable
                title="Typ objektu"
                data={dataByType[SSP.Object]}
                labels={labels}/>
            <ConceptTable
                title="Typ vlastnosti"
                data={dataByType[SSP.Property]}
                labels={labels}/>
            <ConceptTable
                title="Typ vztahu"
                data={dataByType[SSP.Relation]}
                labels={labels}/>
        </div>
    )
};

function splitByType(data) {
    // TODO Multiple types
    const output = {
        [SSP.Object]: [],
        [SSP.Property]: [],
        [SSP.Relation]: []
    };
    data.forEach((entry) => {
        const types = entry["@type"] || [null];
        types.forEach((type) => {
            if (output[type] === undefined) {
                return;
            }
            output[type].push(entry)
        });
    });
    return output;

}

const ConceptTable = ({title, data, labels}) => {
    if (data.length === 0) {
        return null;
    }
    return (
        <div>
            <h3>{title}</h3>
            <table className="table table-striped"
                   style={{"wordBreak": "break-word"}}>
                <thead>
                <tr>
                    <th style={{"width": "20%"}}>Název</th>
                    <th style={{"width": "40%"}}>Použití</th>
                    <th style={{"width": "20%"}}>Specializuje</th>
                    <th style={{"width": "20%"}}>Excel</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                    <TableRow key={item["@id"]} data={item} labels={labels}/>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const TableRow = ({data, labels}) => {
    const subClassOf = [];
    data["subClassOf"].forEach((iri) => {
        subClassOf.push((
            <a href={iri} target="_blank" key={iri}>
                {selectLabel(labels, iri)}
            </a>
        ));
        subClassOf.push((
            <br key={iri + "-br"}/>
        ));
    });
    const usedInGlossary = [];
    data["usedInGlossary"].forEach((iri) => {
        usedInGlossary.push(selectLabel(labels, iri));
        usedInGlossary.push((
            <br key={iri + "-br"}/>
        ));
    });
    subClassOf.splice(subClassOf.length - 1, 1);
    const iri =  "https://skod.opendata.cz/ssp?iri=" +
        encodeURIComponent(data["@id"]);
    return (
        <tr>
            <td>
                <a href={iri}>{selectLabel(labels, data)}</a>
            </td>
            <td>{usedInGlossary}</td>
            <td>{subClassOf}</td>
            <td>{data["excel"]}</td>
        </tr>
    )
};





