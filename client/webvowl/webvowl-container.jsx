import React from "react";
import {connect} from "react-redux";
import {cancel} from "./webvowl-action";
import {isVisibleSelector, messageSelector} from "./webvowl-reducer";
import {WebVowl} from "./webvowl";

class _WebVowlContainer extends React.PureComponent {
    render() {
        if (!this.props.isVisible) {
            return null;
        }
        return (
            <WebVowl message={this.props.message}
                     cancel={this.props.cancel}/>
        )
    }
}


const mapStateToProps = (state, ownProps) => ({
    "isVisible": isVisibleSelector(state),
    "message": messageSelector(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    "cancel": () => dispatch(cancel())
});

export const WebVowlContainer = connect(
    mapStateToProps,
    mapDispatchToProps)
(_WebVowlContainer);
