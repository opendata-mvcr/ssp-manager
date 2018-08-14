import React from "react";
import "./loading.css";

export const LoadingIndicator = () => (
    <div style={{"marginTop": "4rem", "textAlign": "center"}}>
        Prosím čekejte načítám data ...
    </div>
);

// More spinners can be found at http://tobiasahlin.com/spinkit/ under MIT

export const HorizontalLoadingSpinner = ({style}) => (
    <div className="spinner" style={style}>
        <div className="rect1"></div>
        <div className="rect2"></div>
        <div className="rect3"></div>
        <div className="rect4"></div>
        <div className="rect5"></div>
    </div>
);
