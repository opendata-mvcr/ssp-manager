import React from "react";
import {PropTypes} from "prop-types";
import {SSP} from "../vocabulary";
import {Container} from "reactstrap";
import {selectLabel} from "app-service/labels";

export const ConceptListComponent = ({data, labels, entities, visualiseResource}) => {
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
                    entities={entities}
                    visualiseResource={visualiseResource}/>
            ))}
        </Container>
    )
};

ConceptListComponent.propTypes = {
    "data": PropTypes.array.isRequired,
    "labels": PropTypes.any.isRequired,
    "entities": PropTypes.object.isRequired,
    "visualiseResource": PropTypes.func.isRequired
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

const ConceptGroup = ({scheme, data, labels, entities, visualiseResource}) => {
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
                entities={entities}
                visualiseResource={visualiseResource}/>
            <ConceptTable
                title="Typ vlastnosti"
                data={dataByType[SSP.Property]}
                labels={labels}
                entities={entities}
                visualiseResource={visualiseResource}/>
            <ConceptTable
                title="Typ vztahu"
                data={dataByType[SSP.Relation]}
                labels={labels}
                entities={entities}
                visualiseResource={visualiseResource}/>
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

const ConceptTable = ({title, data, labels, entities, visualiseResource}) => {
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
                    <TableRow key={item["@id"]}
                              data={item}
                              labels={labels}
                              entities={entities}
                              visualiseResource={visualiseResource}/>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const TableRow = ({data, labels, entities, visualiseResource}) => {
    const broader = createBroaderCell(data, labels, entities);
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
                <button className="btn btn-sm mr-1 btn-outline-primary"
                        onClick={() => visualiseResource(data["@id"])}>
                    <span className="fa fa-search">
                    </span>
                </button>
                <a href={iri}>{selectLabel(labels, data)}</a>
            </td>
            <td>{usedInGlossary}</td>
            <td>{broader}</td>
            <td>{data["excel"]}</td>
        </tr>
    )
};

function createBroaderCell(data, labels, entities) {
    const broader = [];
    data["broader"].forEach((iri) => {
        if (broader.length > 0) {
            broader.push((
                <br key={iri + "-br"}/>
            ));
        }

        broader.push((
            <a href={iri} target="_blank" key={iri}>
                {prepareLabelForConcept(labels, iri)}
            </a>
        ));

        const concept = entities[iri];
        if (concept !== undefined && concept["scheme"].length > 0) {
            broader.push(" (");
            let isFirst = true;
            concept["scheme"].forEach((scheme) => {
                if (isFirst) {
                    isFirst = false;
                } else {
                    broader.push(" ,");
                }
                broader.push((
                    <a href={scheme} target="_blank" key={iri + "-scheme"}>
                        {selectLabel(labels, scheme)}
                    </a>
                ));
            });
            broader.push(")");
        }
    });
    return broader;
}

function prepareLabelForConcept(labels, iri) {
    const label = selectLabel(labels, iri);
    if (label !== iri) {
        return label;
    }
    return label.substr(label.lastIndexOf("/") + 1);
}



