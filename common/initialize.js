const db = require("../database/pool");

function initializeAppServer() {
    global.SERVER_ENV = process.argv[2];

    db.connect();
}

exports.initializeAppServer = initializeAppServer;