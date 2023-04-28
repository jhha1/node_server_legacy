const path = require('path');
const { createLogger, format, transports } = require('winston');
const mt = require('moment-timezone');
const config = require('../../config/config.json');

const LOG_PATH = `../../${config["log"]["folderName"]}`;

const { combine, label, printf } = format;

const myFormat = printf(info => `${info.date} [${info.level}]: ${info.label} - ${info.message}`); // NOTE: 로그 형식 설정

const LOG_TYPE = Object.freeze({
    1: 'convert',
    2: 'mail',
    3: 'sql',
    4: 'user-copy',
});

const KTC = format((info) => {
    info.date = mt().tz('Asia/Seoul').format('YYMMDD hh:mm:ss');
    return info;
});

/**
 * application log를 남기기 위함.
 * @param {*} logType
 * @returns
 */
const appLogger = (logType) => {
    const init = createLogger({
        format: combine(
            label({ label: logType }), // NOTE: 어떤 서비스인지 알기 위함
            KTC(),
            myFormat,
        ),
        transports: [
            new transports.File({ filename: path.join(__dirname, LOG_PATH, 'app-error.log'), level: 'error' }), // NOTE: 에러는 별도로 보기 위함
            new transports.File({ filename: path.join(__dirname, LOG_PATH, mt().tz('Asia/Seoul').format('YYYY-MM-DD'), 'app.log') }), // NOTE: 모든 로그 (에러 포함)
        ],
    });
    init.add(new transports.Console());
    return init;
};

/**
 * http status 로그를 남기기 위함.
 */
const httpLogger = createLogger({
    format: combine(
        label({ label: 'http' }),
        KTC(),
        myFormat,
    ),
    transports: [
        new transports.File({ filename: path.join(__dirname, LOG_PATH, mt().tz('Asia/Seoul').format('YYYY-MM-DD'), 'http.log') }),
    ],
});

const httpLogStream = {
    write: (message) => { // NOTE: morgan에서 쓰기 위해 이 형태로 fix 되야함.
        httpLogger.log({
            level: 'info',
            message: message,
        });
    },
};

exports.LOG_TYPE = LOG_TYPE;
exports.appLogger = appLogger;
exports.httpLogStream = httpLogStream;