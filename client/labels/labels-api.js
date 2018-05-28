export function selectLabel(labelsState, value) {
    return selectLabels(labelsState, value)[0];
}

export function selectLabels(labelsState, value) {
    if (value["@id"] !== undefined) {
        value = value["@id"];
    }
    const labelsEntry = labelsState["labels"][value];
    if (labelsEntry === undefined) {
        console.debug("No label found for: ", value);
        return [value];
    }

    const languages = labelsState["languages"];
    return selectLabelFromEntry(languages, labelsEntry);
}


function selectLabelFromEntry(languages, labelsEntry) {
    for (let index in languages) {
        if (!languages.hasOwnProperty(index)) {
            continue;
        }
        const language = languages[index];
        const labels = labelsEntry[language];
        if (labels === undefined) {
            continue;
        }
        return labels;
    }
    const anyLanguageLabel = selectAnyLanguageLabel(labelsEntry);
    if (anyLanguageLabel) {
        return anyLanguageLabel;
    }
    return [labelFromIri(labelsEntry["@id"])];

}

function selectAnyLanguageLabel(entry) {
    for (let key in entry) {
        if (!entry.hasOwnProperty(key) || key === "@id") {
            continue;
        }
        return entry[key];
    }
}

function labelFromIri(iri) {
    return iri.substr(iri.lastIndexOf("/") + 1);
}