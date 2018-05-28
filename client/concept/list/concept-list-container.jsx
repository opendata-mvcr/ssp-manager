import React from "react";
import {connect} from "react-redux";
import {fetchConcepts} from "./concept-list-action";
import {
    conceptsStatusSelector,
    conceptsDataSelector,
    conceptsFetchErrorSelector
} from "./concept-list-reducer"
import {isLoading, hasFailed} from "app-service/http";
import {ConceptListComponent} from "./concept-list";
import {labelsSelector} from "labels";
import {parse as parseQueryString} from "query-string";
import {LoadingIndicator} from "app-ui/loading";

// TODO Add init and clean up methods.

class _ConceptListContainer extends React.Component {

    constructor(props) {
        super(props);
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        const params = parseQueryString(this.props.query);
        this.props.fetch(params["search"]);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.query !== prevProps.query) {
            this.fetchData();
        }
    }

    render() {
        if (hasFailed(this.props.status)) {
            const {status} = this.props.error;
            // TODO Extract to another component.
            return (
                <div style={{"marginTop": "4rem", "textAlign": "center"}}>
                    Nepodařilo se načíst data (status {status}).<br/>
                    Zkuste to prosím později.
                </div>
            )
        }
        if (isLoading(this.props.status)) {
            return (
                <LoadingIndicator/>
            );
        }

        const {data, labels} = this.props;
        return (
            <ConceptListComponent
                data={data}
                labels={labels}/>
        )
    }

}


const mapStateToProps = (state, ownProps) => ({
    "status": conceptsStatusSelector(state),
    "data": conceptsDataSelector(state),
    "error": conceptsFetchErrorSelector(state),
    "labels": labelsSelector(state),
    "query": state["router"]["location"]["search"]
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    "fetch": (query) => {
        dispatch(fetchConcepts(query));
    }
});

export const ConceptListContainer = connect(
    mapStateToProps,
    mapDispatchToProps)
(_ConceptListContainer);
