import React from "react";
import "../modules";
import {getRegistered} from "./register";
import {Router, Route, Switch} from "react-router-dom";
import {DefaultLayout} from "./default-layout";

export function createRouter(history) {
    return (
        <Router history={history}>
            <DefaultLayout>
                <Switch>
                    {getRegisteredRoutes().map((entry) => (
                        <Route key={entry.url}
                               path={entry.url}
                               exact={true}
                               component={entry.component}
                        />
                    ))}
                </Switch>
            </DefaultLayout>
        </Router>
    )
}

function getRegisteredRoutes() {
    const routes = [];
    getRegistered().forEach((entry) => {
        if (entry.url === undefined || entry.component === undefined) {
            return;
        }
        routes.push(entry);
    });
    return routes;
}