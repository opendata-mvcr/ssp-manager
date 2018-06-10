import React from "react";
import {PropTypes} from "prop-types";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";
import {STATUS_LOADING, STATUS_SHOW_URL, STATUS_FAILED} from "./webvowl-reducer"

export const WebVowl = ({status, url, close}) => (
    <Modal isOpen={true} backdrop="static">
        <ModalHeader>WebOWL visualisation</ModalHeader>
        {getBody(status, url, close)}
        <ModalFooter>
            <Button color="secondary" onClick={close}>
                {getCloseButtonLabel(status)}
            </Button>
        </ModalFooter>
    </Modal>
);

function getBody(status, url, close) {
    switch (status) {
        case STATUS_LOADING:
            return (
                <ModalBody>
                    Preparing data.
                </ModalBody>
            );
        case STATUS_SHOW_URL:
            return (
                <ModalBody>
                    Your browser prevents opening a new window with
                    visualisation. <br/>
                    You can open the {" "}
                    <a href={url} target="_blank"
                       onClick={close}>
                        visualisation
                    </a> {" "}
                    manually.
                </ModalBody>
            );
        case STATUS_FAILED:
        default:
            return (
                <ModalBody>
                    Something went wrong :( <br/>
                    Check logs for more details.
                </ModalBody>
            );
    }
}



function getCloseButtonLabel(status) {
    if (status === STATUS_LOADING) {
        return "Cancel"
    }
    return "Close";
}