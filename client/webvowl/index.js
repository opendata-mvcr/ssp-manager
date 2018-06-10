import {register} from "app/register.js";
import {visualiseState as _visualiseState} from "./webvowl-action"
import reducer from "./webvowl-reducer"
import {WebVowlContainer} from "./webvowl-container";

export const visualiseState = _visualiseState;

register({
    "reducer": reducer.reducer,
    "name": reducer.name,
    "component-static": WebVowlContainer
});