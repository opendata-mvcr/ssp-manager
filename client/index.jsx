import React from "react";
import ReactDOM from "react-dom";
import {browserHistory} from "react-router";
import {create as createStore} from "./app/store";
import {ConnectedRouter} from "react-router-redux";
import {createRouter} from "./app/routes";
import {Provider} from "react-redux";
import createHistory from "history/createBrowserHistory";
import "bootstrap/dist/css/bootstrap.min.css";

const history = createHistory();
const store = createStore(history);

ReactDOM.render((
    <Provider store={store}>
        <ConnectedRouter history={history}>
            {createRouter(history)}
        </ConnectedRouter>
    </Provider>
), document.getElementById("app"));



// import swal from "sweetalert";
// import React from "react";
//
// import {Button} from "reactstrap";
//
// (() => {
//     ReactDOM.render((
//         <div>
//             <Button color="danger">Danger!</Button>
//         </div>
//     ), document.getElementById("app"));
// })();
//
//
// function showDialog() {
//     swal("Here"s the title!", "...and here"s the text!");
// }