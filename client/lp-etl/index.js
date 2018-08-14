import {register} from "app/register.js";
import reducer from "./lp-etl-reducer"

export {
    statusSelector,
    isFetchingSelector,
    STATUS
} from "./lp-etl-reducer";

export {
    executePipeline
} from "./lp-etl-action";

register({
    "reducer": reducer.reducer,
    "name": reducer.name
});