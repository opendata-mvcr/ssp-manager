import React from "react";
import {Header} from "./header-container";
import {hot} from "react-hot-loader";
import {getRegistered} from "./register";


function _DefaultLayout(props) {
    return (
        <div>
            <Header/>
            {/* On small devices the menu is bigger, so use extra space. */}
            <div style={{"height": "5rem"}} className="my-5 my-sm-0"/>
            {React.cloneElement(props.children, props)}
            {getStaticComponents()}
        </div>
    )
}

function getStaticComponents() {
    const output = [];
    getRegistered().forEach((entry) => {
        if (entry["component-static"] === undefined) {
            return null;
        }
        const Component = entry["component-static"];
        output.push(
            <Component key={entry["name"]}/>
        );
    });
    return output;
}

export const DefaultLayout = hot(module)(_DefaultLayout);
