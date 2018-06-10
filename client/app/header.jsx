import React from "react";
import {PropTypes} from "prop-types";
import {Link} from "react-router-redux"
import {Navbar, NavbarBrand} from "reactstrap";

export class Header extends React.Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onVisualise = this.onVisualise.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.onSearch(this.searchText.value)
    }

    onVisualise(event) {
        event.preventDefault();
        this.props.onVisualise();
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
                    <input className="form-control"
                           style={{"width": "20rem"}}
                           type="search"
                           placeholder="Hledaný pojem"
                           aria-label="Hledej"
                           ref={(input) => this.searchText = input}
                    />
                    <button className="btn my-0 ml-sm-2 btn-outline-success">
                        Hledej
                    </button>
                    <button className="btn my-0 ml-sm-2 btn-outline-primary"
                            onClick={this.onVisualise}>
                        Vizualizuj
                    </button>
                </form>
            </Navbar>
        )
    }

}

Header.propTypes = {
    "onSearch": PropTypes.func.isRequired,
    "onVisualise": PropTypes.func.isRequired
};
