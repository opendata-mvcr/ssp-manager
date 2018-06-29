import {register} from "app/register.js";
import reducer from "./webvowl-reducer"
import {WebVowlContainer} from "./webvowl-container";

export {visualiseState, visualiseResource} from "./webvowl-action"

register({
    "reducer": reducer.reducer,
    "name": reducer.name,
    "component-static": WebVowlContainer
});