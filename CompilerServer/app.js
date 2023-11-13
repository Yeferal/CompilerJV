const config = require('config');
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const routes = require('./routes');
const { error404Handler, errorHandler } = require('./middleware');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger(config.get('logger')));
app.use(express.json());
app.use(express.urlencoded( {
    extended: false
} ));
app.use(cookieParser());


// Configura CORS
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
  }));





app.get('/', (req, res) => {
    res.send('Hola, mundo!');
});

app.use('/', routes);



app.use(error404Handler);
app.use(errorHandler);

module.exports = app;