function iterateResources(jsonld, consumer) {
    if (Array.isArray(jsonld)) {
        console.error("iterateResources.isArray");
    } else {
        return iterateResourcesInObject(jsonld, consumer);
    }
}

function iterateResourcesInObject(jsonld, consumer) {
    const graphIri = jsonld["@id"];
    const graph = jsonld["@graph"];
    for (let index in graph) {
        if (!graph.hasOwnProperty(index)) {
            continue;
        }
        const resource = graph[index];
        const result = consumer(resource, graphIri);
        if (result !== undefined) {
            return result;
        }
    }
    return undefined;

}

function getId(value) {
    if (value["@id"]) {
        return value["@id"];
    } else if (value["id"]) {
        return value["id"];
    } else {
        // Missing reference - ie. blank node.
        return undefined;
    }
}

function getTypes(resource) {
    if (resource["@type"]) {
        const type = resource["@type"];
        if (Array.isArray(type)) {
            return type;
        } else {
            return [type];
        }
    } else {
        return [];
    }
}

function getRefs(resource, predicate) {
    const value = resource[predicate];
    if (value === undefined) {
        return [];
    }
    const result = [];
    if (Array.isArray(value)) {
        for (let index in value) {
            if (!value.hasOwnProperty(index)) {
                continue;
            }
            pushIriToResult(value[index], result);
        }
    } else {
        pushIriToResult(value, result);
    }
    return result;
}

function pushIriToResult(value, result) {
    if (value["@id"] !== undefined) {
        result.push(value["@id"]);
    } else if (value["id"] !== undefined) {
        result.push(value["id"]);
    } else if (value["@value"] !== undefined) {
        console.warn("IRI stored as value: ", value);
        result.push(value["@value"]);
    } else {
        console.error("Invalid IRI value: ", value);
    }
}

function getValues(resource, predicate) {
    const values = resource[predicate];
    if (Array.isArray(values)) {
        return values;
    } else {
        return [values];
    }
}

function getString(resource, predicate) {
    const values = resource[predicate];
    const result = {};
    if (Array.isArray(values)) {
        for (let index in values) {
            if (!values.hasOwnProperty(index)) {
                continue;
            }
            addStringToResult(values[index], result);
        }
    } else {
        addStringToResult(values, result);
    }
    return result;
}

function addStringToResult(value, result) {
    let str;
    let language;

    if (value === undefined) {
        return;
    }

    if (value["@value"] === undefined) {
        str = value;
    } else {
        str = value["@value"];
    }

    if (value["@language"] === undefined) {
        language = "";
    } else {
        language = value["@language"];
    }

    if (result[language] === undefined) {
        result[language] = [str];
    } else {
        result[language].push(str);
    }
}

function wrapFirst(fnc) {
    return (...args) => first(fnc(...args));
}

function first(data) {
    if (data.length > 0) {
        return data[0];
    } else {
        return undefined;
    }
}

// TODO Add tests based on the current data.

export default {
    "id": getId,
    "type": wrapFirst(getTypes),
    "types": getTypes,
    "ref": wrapFirst(getRefs),
    "refs": getRefs,
    "value": wrapFirst(getValues),
    "values": getValues,
    "string": getString,
    //
    "iterateResources": iterateResources
};

function stringToArray(value) {
    const result = [];
    for (let key in value) {
        if (!value.hasOwnProperty(key)) {
            continue;
        }
        result.push(...value[key]);
    }
    return result;
}

export const helpers = {
    "stringToArray": stringToArray
};
