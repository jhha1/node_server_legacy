const express = require('express');
const path = require('path');
const glob = require('glob');
const morgan = require('morgan');
const logger = require('./src/utils/logger');
const bodyParser = require('body-parser');
const initializer = require('./src/common/initialize');

const app = express();
const SERVER_PORT = 8888;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/view'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    global.site_path = req.path;
    next();
});

const routes = glob.sync(`${__dirname}/src/routes/*.js`);
for (const route of routes) {
    require(route)(app);
}

app.use(morgan('combined', { stream: logger.httpLogStream }));
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err,
        title: 'error',
    });
});

initializer.initializeAppServer();

app.listen(SERVER_PORT, () => {
    console.log(`Server running on port: ${SERVER_PORT}`);
});
