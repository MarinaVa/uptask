const express = require('express');
const projectController = require('../controllers/projectController');
const tareaController = require('../controllers/tareaController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const router = express.Router();
const {body} = require('express-validator');

module.exports = function() {
    router.get('/', 
        authController.usuarioAutenticado,
        projectController.home
    );
    router.get('/nosotros', (req, res) => {
        res.render('nosotros', {
            title: 'Nosotros'
        });
    });
    router.get('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        projectController.formularioProyecto
    );
    router.post('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        projectController.nuevoProyecto
    );
    router.post('/nuevo-proyecto/:id', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        projectController.editarProyecto
    );
    router.post('/nueva-tarea/:id', 
        authController.usuarioAutenticado,
        body('tarea').not().isEmpty().trim().escape(),
        tareaController.nuevaTarea
    );
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado,
        projectController.proyectoPorUrl,
    );
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        projectController.formularioEditar
    );
    router.delete('/proyectos/:url', 
        authController.usuarioAutenticado,
        projectController.deleteProyecto
    );
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareaController.cambiarEstadoTarea
    );
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareaController.eliminarTarea
    );
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/iniciar-session', usuariosController.formIniciarSession);
    router.post('/iniciar-session', authController.autentificarUsuario);
    router.get('/cerrar-session', authController.cerrarSession);
    router.get('/reestablecer', usuariosController.reestablecerPasswordForm);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.resetPasswordForm);
    router.post('/reestablecer/:token', authController.actualizarPassword);
    return router;
};


