import {register} from "app/register.js";
import {
    selectLabel as _selectLabel
} from "./labels-api";
import {
    default as reducer,
    labelsSelector as _labelsSelector
} from "./labels-reducer";
import {fetchLabel as _fetchLabel} from "./labels-action";

export const selectLabel = _selectLabel;
export const labelsSelector = _labelsSelector;
export const fetchLabel = _fetchLabel;

register({
    "reducer": reducer.reducer,
    "name": reducer.name,
    "url": undefined,
    "component": undefined
});