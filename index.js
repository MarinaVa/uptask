/* global __dirname */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
//const expressValidator = require('express-validator');
const helpers = require('./helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const db = require('./config/db');
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
        .then(()=> console.log('Connection ok'))
        .catch(error => console.log(error));
const app = express();

//app.use(expressValidator());

app.use(express.static('public'));

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: true}));

const routes = require('./routes');
const passport = require('./config/passport');


app.set('views', path.join(__dirname, './views'));

app.use(flash());

app.use(cookieParser());

app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUnutilialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(req.user);
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

app.use('/', routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host);

require('./handlers/email');