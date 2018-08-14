import React from "react";
import {PropTypes} from "prop-types";
import {push} from "react-router-redux"
import {Navbar, NavbarBrand, Button} from "reactstrap";
import {STATUS} from "lp-etl";
import {visualiseState} from "../webvowl";
import {connect} from "react-redux";
import {isFetchingSelector, executePipeline, statusSelector} from "../lp-etl";
import {HorizontalLoadingSpinner} from "app-ui/loading";
import {parse as parseQueryString} from "query-string";

class _Header extends React.Component {

    constructor(props) {
        super(props);
        //
        this.onSubmit = this.onSubmit.bind(this);
        this.onVisualise = this.onVisualise.bind(this);
        this.onExecute = this.onExecute.bind(this);
        this.createExecuteButton = this.createExecuteButton.bind(this);
        //
        this.inputRef = React.createRef();
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.onSearch(this.inputRef.current.value);
    }

    onVisualise(event) {
        event.preventDefault();
        this.props.onVisualise();
    }

    onExecute(event) {
        event.preventDefault();
        this.props.onExecute();
    }

    componentDidMount() {
        if (this.props.search !== undefined) {
            this.inputRef.current.value = this.props.search;
        }
    }

    render() {
        return (
            <Navbar expand="md"
                    className="navbar-light bg-light justify-content-between fixed-top">
                <NavbarBrand href='/'>
                    SSP Manager
                </NavbarBrand>
                <form className="form-inline"
                      onSubmit={this.onSubmit}>
                    <input className="form-control my-2"
                           style={{"width": "20rem"}}
                           type="search"
                           placeholder="Hledaný pojem"
                           aria-label="Hledej"
                           ref={this.inputRef}
                    />
                    <Button outline className="btn my-0 ml-2" color="success">
                        Hledej
                    </Button>
                    <Button outline className="btn my-0 ml-2" color="primary"
                            onClick={this.onVisualise}>
                        Vizualizuj
                    </Button>
                    {this.createExecuteButton()}
                </form>
            </Navbar>
        )
    }

    createExecuteButton() {
        let indicator = null;
        if (this.props.status === STATUS.running) {
            indicator = (
                <HorizontalLoadingSpinner style={{"marginLeft": "1rem"}}/>
            );
        }

        let disabled = this.props.isFetching;
        let label;
        let color = "primary";

        switch (this.props.status) {
            case STATUS.initial:
                label = "Přegeneruj";
                break;
            case STATUS.running:
                label = "Generuji";
                disabled = true;
                break;
            case STATUS.finished:
                label = "Hotovo, prosím stiskni F5";
                color = "success";
                disabled = true;
                break;
            case STATUS.failed:
                label = "Chyba";
                color = "danger";
                disabled = true;
                break;
        }

        return (
            <Button outline
                    className="btn my-0 ml-2"
                    style={{"display": "inline-flex"}}
                    color={color}
                    onClick={this.onExecute}
                    disabled={disabled}>
                <div>{label}</div>
                {indicator}
            </Button>
        )
    }

}

_Header.propTypes = {
    "onSearch": PropTypes.func.isRequired,
    "onVisualise": PropTypes.func.isRequired,
    "onExecute": PropTypes.func.isRequired,
    "isFetching": PropTypes.bool.isRequired,
    "status": PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
    "isFetching": isFetchingSelector((state)),
    "status": statusSelector((state)),
    "search": parseQueryString(state["router"]["location"]["search"])["search"]
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    "onSearch": (searchText) => dispatch(push('?search=' + searchText)),
    "onVisualise": () => dispatch(visualiseState()),
    "onExecute": () => dispatch(executePipeline())
});

export const Header = connect(
    mapStateToProps,
    mapDispatchToProps)
(_Header);