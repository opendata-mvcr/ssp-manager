import {register} from "app/register.js";
import {ConceptListContainer} from "./concept-list-container";
import reducer from "./concept-list-reducer"

register({
    "reducer": reducer.reducer,
    "name": reducer.name,
    "url": "/",
    "component": ConceptListContainer
});