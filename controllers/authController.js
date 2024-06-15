const crypto = require('crypto');
const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');
const {enviarEmail} = require('../handlers/email');

exports.autentificarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'iniciar-session',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

exports.usuarioAutenticado = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/iniciar-session');
    }
}

exports.cerrarSession = (req, res) => {
    req.session.destroy(() => {
        res.redirect('./iniciar-session');
    });
}

exports.enviarToken = async (req, res) => {
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where: {email}});

    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }

    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    await usuario.save();

    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    await enviarEmail({
        to: usuario.email,
        subject: 'Reestablecer password',
        file: 'restablecer-password',
        resetUrl
    }); 

    req.flash('correcto', 'Se envio un mensaje a tu correo');
    res.redirect('/iniciar-session');
} 

exports.resetPasswordForm = async (req, res) => {
    const {token} = req.params;
    const usuario = await Usuarios.findOne({where: {token}});

    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }
    
    res.render('resetPassword', {title: 'Restablecer contrasena'});
}

exports.actualizarPassword = async (req, res) => {
    const {token} = req.params;
    const usuario = await Usuarios.findOne({where: {
        token,
        expiracion: {
            [Op.gte]: Date.now()
        }
    }});

    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }
    
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    await usuario.save();

    req.flash('correcto', 'El password se ha cambiado correctamente');

    res.redirect('/iniciar-session');
}