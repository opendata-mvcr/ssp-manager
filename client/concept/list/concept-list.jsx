import React from "react";
import {PropTypes} from "prop-types";
import {SSP} from "../vocabulary";
import {Container} from "reactstrap";
import {selectLabel} from "app-service/labels";

export const ConceptListComponent = ({data, labels, entities}) => {
    if (data.length === 0) {
        return (
            <div style={{"marginTop": "4rem", "textAlign": "center"}}>
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
                    labels={labels}
                    entities={entities}/>
            ))}
        </Container>
    )
};

ConceptListComponent.propTypes = {
    "data": PropTypes.array.isRequired,
    "labels": PropTypes.any.isRequired,
    "entities": PropTypes.object.isRequired
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

const ConceptGroup = ({scheme, data, labels, entities}) => {
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
                labels={labels}
                entities={entities}/>
            <ConceptTable
                title="Typ vlastnosti"
                data={dataByType[SSP.Property]}
                labels={labels}
                entities={entities}/>
            <ConceptTable
                title="Typ vztahu"
                data={dataByType[SSP.Relation]}
                labels={labels}
                entities={entities}/>
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

const ConceptTable = ({title, data, labels, entities}) => {
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
                    <TableRow key={item["@id"]} data={item} labels={labels}
                              entities={entities}/>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const TableRow = ({data, labels, entities}) => {
    const subClassOf = createSubClassOfCell(data, labels, entities);
    const usedInGlossary = [];
    data["usedInGlossary"].forEach((iri) => {
        usedInGlossary.push(selectLabel(labels, iri));
        usedInGlossary.push((
            <br key={iri + "-br"}/>
        ));
    });

    const iri = "https://skod.opendata.cz/ssp?iri=" +
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

function createSubClassOfCell(data, labels, entities) {
    const subClassOf = [];
    data["subClassOf"].forEach((iri) => {
        if (subClassOf.length > 0) {
            subClassOf.push((
                <br key={iri + "-br"}/>
            ));
        }

        subClassOf.push((
            <a href={iri} target="_blank" key={iri}>
                {prepareLabelForConcept(labels, iri)}
            </a>
        ));

        const concept = entities[iri];
        if (concept !== undefined && concept["scheme"].length > 0) {
            subClassOf.push(" (");
            let isFirst = true;
            concept["scheme"].forEach((scheme) => {
                if (isFirst) {
                    isFirst = false;
                } else {
                    subClassOf.push(" ,");
                }
                subClassOf.push((
                    <a href={scheme} target="_blank" key={iri + "-scheme"}>
                        {selectLabel(labels, scheme)}
                    </a>
                ));
            });
            subClassOf.push(")");
        }
    });
    return subClassOf;
}

function prepareLabelForConcept(labels, iri) {
    const label = selectLabel(labels, iri);
    if (label !== iri) {
        return label;
    }
    return label.substr(label.lastIndexOf("/") + 1);
}



