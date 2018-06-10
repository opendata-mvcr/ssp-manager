import React from "react";
import {Header} from "./header";
import {connect} from "react-redux";
import {push} from "react-router-redux";
import {hot} from "react-hot-loader";
import {visualiseState} from "webvowl/index"
import {getRegistered} from "./register";

function _DefaultLayout(props) {
    return (
        <div>
            <Header onSearch={props.onSearch} onVisualise={props.onVisualise}/>
            <div style={{"height": "4rem"}}/>
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

export const DefaultLayout = hot(module)(connect(null, (dispatch, ownProps) => ({
    "onSearch": (searchText) => dispatch(push('?search=' + searchText)),
    "onVisualise": () => dispatch(visualiseState())
}))(_DefaultLayout));
