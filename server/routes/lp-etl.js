const express = require("express");
const etl = require("../modules/lp-etl");

(function initialize() {
    const router = express.Router();
    router.get("", createExecutionStatusFunction());
    router.post("", createStartExecutionsFunction());
    module.exports = router;
})();

function createExecutionStatusFunction() {
    return (req, res) => {
        etl.getStatus().then((response) => {
            res.status(200).json(response);
        }).catch((error) => {
            res.status(500).json(error);
        });
    }
}

function createStartExecutionsFunction() {
    return (req, res) => {
        // Refresh status.
        etl.getStatus()
            .then(() => etl.start())
            .then((response) => {
                res.status(200).json(response);
            })
            .catch((error) => {
                res.status(500).json(error);
            });
    }
}

