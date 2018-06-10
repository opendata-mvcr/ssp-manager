import React from "react";
import {PropTypes} from "prop-types";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";


export const WebVowl = ({message, cancel}) => (
    <Modal isOpen={true} backdrop="static">
        <ModalHeader>Preparing WebOWL visualisation</ModalHeader>
        <ModalBody>
            {message}
        </ModalBody>
        <ModalFooter>
            <Button color="secondary" onClick={cancel}>Cancel</Button>
        </ModalFooter>
    </Modal>
);