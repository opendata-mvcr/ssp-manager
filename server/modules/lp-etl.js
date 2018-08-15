const request = require("request"); // https://github.com/request/request
const config = require("../config");

const CHECK_INTERVAL = 10 * 1000;

const STATUS = {
    "initial": "initial",
    "running": "running",
    "finished": "finished",
    "failed": "failed"
};

const execution = {
    "url": null,
    "lastCheck": 0,
    "status": STATUS.initial
};

function getExecutionStatus() {
    return updateExecutionStatus().then(() => {
        return {"status": execution.status};
    });
}

function updateExecutionStatus() {
    // No execution was run.
    if (execution.url === null) {
        return Promise.resolve();
    }
    // Make sure we are not checking too often.
    const time = (new Date()).getTime();
    if (time - execution.lastCheck < CHECK_INTERVAL) {
        return Promise.resolve();
    }
    execution.lastCheck = time;
    const url = execution.url + "/overview";
    return new Promise((resolve, reject) => {
        request.get({"url": url}, (error, response, bodyAsStr) => {
            if (error) {
                onUpdateFailed();
                reject(error);
            }
            parseExecutionOverview(JSON.parse(bodyAsStr));
            resolve();
        });
    });
}

function onUpdateFailed(){
    // For simplicity we just assume that the pipeline is no longer running.
    execution.url = null;
    execution.status = STATUS.failed;
}

function parseExecutionOverview(overview) {
    if (overview["status"] === undefined) {
        throw  {
            "name": "InvalidData",
            "message": "Missing status property in overview."
        }
    }
    const status = overview["status"]["@id"];
    switch (status) {
        case "http://etl.linkedpipes.com/resources/status/finished":
            execution.status = STATUS.finished;
            break;
        case "http://etl.linkedpipes.com/resources/status/failed":
            execution.status = STATUS.failed;
            break;
        default:
            execution.status = STATUS.running;
            break;
    }
}

function startExecution() {
    if (isExecutionRunning()) {
        return Promise.resolve({
            "status": "already-running"
        });
    }
    const url = getStartExecutionUrl();
    return new Promise((resolve, reject) => {
        request.post(url, (error, response, bodyAsStr) => {
            if (error) {
                reject(error);
            }
            onExecutionStarted(JSON.parse(bodyAsStr));
            resolve({
                "status": "started"
            });
        });
    });
}

function getStartExecutionUrl() {
    return config.etl + "/resources/executions?pipeline=" + config.pipeline;
}

function isExecutionRunning() {
    return execution.status === STATUS.running;
}

function onExecutionStarted(response) {
    // This IRI may include public URL, however we want to access directly
    // using config.etl. URL.
    let url = response.iri;
    url = config.etl + url.substr(url.indexOf("/resources/"));
    execution.url = url;
    execution.status = STATUS.running;
    execution.lastCheck = 0;
}

module.exports = {
    "getStatus": getExecutionStatus,
    "start": startExecution
};