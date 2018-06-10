import React from "react";
import {connect} from "react-redux";
import {close} from "./webvowl-action";
import {isVisibleSelector, statusSelector, urlSelector} from "./webvowl-reducer";
import {WebVowl} from "./webvowl";

class _WebVowlContainer extends React.PureComponent {
    render() {
        if (!this.props.isVisible) {
            return null;
        }
        return (
            <WebVowl status={this.props.status}
                     url={this.props.url}
                     close={this.props.close}/>
        )
    }
}


const mapStateToProps = (state, ownProps) => ({
    "isVisible": isVisibleSelector(state),
    "status": statusSelector(state),
    "url": urlSelector(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    "close": () => dispatch(close())
});

export const WebVowlContainer = connect(
    mapStateToProps,
    mapDispatchToProps)
(_WebVowlContainer);
