import React from "react";
import {Header} from "./header";
import {connect} from "react-redux";
import {push} from "react-router-redux";
import { hot } from "react-hot-loader";

function _DefaultLayout(props) {
    return (
        <div>
            <Header onSearch={props.onSearch}/>
            <div style={{"height": "4rem"}}/>
            {React.cloneElement(props.children, props)}
        </div>
    )
}

export const DefaultLayout = hot(module)(connect(null, (dispatch, ownProps) => ({
    "onSearch": (searchText) => dispatch(push('?search=' + searchText))
}))(_DefaultLayout));

