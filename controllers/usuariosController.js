const Usuarios = require('../models/Usuarios');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        title: 'Crear cuenta en Uptask'
    });
};

 exports.crearCuenta = (req, res) => {
    const {email, password} = req.body;
    
    Usuarios.create({
        email,
        password
    })
    .then(() => {
        res.redirect('/iniciar-session');
    })
    .catch(error => {
        req.flash('error', error.errors.map(error => error.message));
        res.render( 'crearCuenta', {
            title: 'Crear cuenta en Uptask',
            mensajes: req.flash(),
            email,
            password
        });
    });
};

exports.formIniciarSession = (req, res) => {
    const {error} = res.locals.mensajes;

    res.render('formIniciarSession', {
        title: 'Iniciar session',
        errores: error
    });
};

exports.reestablecerPasswordForm = (req, res) => {
    const {error} = res.locals.mensajes;

    res.render('formReestablecerPassword', {
        title: 'Reestablecer Password',
        errores: error
    });
};

