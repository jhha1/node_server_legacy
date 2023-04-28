const mysql = require('mysql2/promise');
const config = require('../../config/config.json');

const dbConnectionPool = {}; // db 커넥션 Object

/**
 * 앱 부팅 시 DB 연결
 */
function connect() {
    _connectMysql();
}

function _connectMysql() {
    try {
        let currentConfig = Object.assign(config["rdb"][SERVER_ENV], {
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        dbConnectionPool[SERVER_ENV] = mysql.createPool(currentConfig);
        console.log(`${SERVER_ENV} DB CONNECT`);
    } catch (err) {
        console.log(`${SERVER_ENV} db 연결 안됨`, err);
        throw err;
    }
}

function getConnection() {
    return dbConnectionPool[SERVER_ENV].getConnection();;
}

exports.connect = connect;
exports.getConnection = getConnection;