import React from "react";
import {PropTypes} from "prop-types";
import {Link, push} from "react-router-redux"
import {Navbar, NavbarBrand, Button} from "reactstrap";
import {visualiseState} from "../webvowl";
import {connect} from "react-redux";
import {parse as parseQueryString} from "query-string";

class _Header extends React.Component {

    constructor(props) {
        super(props);
        //
        this.onSubmit = this.onSubmit.bind(this);
        this.onVisualise = this.onVisualise.bind(this);
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

    onReload(event) {
        event.preventDefault();
        this.props.onReload();
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
                </form>
            </Navbar>
        )
    }

}

_Header.propTypes = {
    "onSearch": PropTypes.func.isRequired,
    "onVisualise": PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
    "search": parseQueryString(state["router"]["location"]["search"])["search"],
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    "onSearch": (searchText) => dispatch(push('?search=' + searchText)),
    "onVisualise": () => dispatch(visualiseState())
});

export const Header = connect(
    mapStateToProps,
    mapDispatchToProps)
(_Header);