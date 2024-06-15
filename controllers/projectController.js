const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.home = async (req, res) => {
        const usuarioId = res.locals.usuario.id;
        const proyectos = await Proyectos.findAll({where: {usuarioId}});
        res.render('index', {
            title: "Inicio",
            proyectos
        });
};

exports.formularioProyecto = async (req, res) => {
        const usuarioId = res.locals.usuario.id;
        const proyectos = await Proyectos.findAll({where: {usuarioId}});
        res.render('nuevoProyecto', {
            title: "Nuevo Proyecto",
            proyectos
        });
};

exports.formularioEditar = async (req, res) => {
        const usuarioId = res.locals.usuario.id;
        const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
        const proyectoPromise = Proyectos.findOne({
            where: {
                id: req.params.id,
                usuarioId
            }
        });
    
        const [proyecto, proyectos]= await Promise.all([proyectoPromise, proyectosPromise]);
        
        res.render('nuevoProyecto', {
            title: "Editar Proyecto",
            proyectos,
            proyecto
        });
};

exports.proyectoPorUrl = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });
    
    const [proyecto, proyectos]= await Promise.all([proyectoPromise, proyectosPromise]);
    
    const tareas = await Tareas.findAll({where: {proyectoId: proyecto.id}});
    
    res.render('tareas', {
        title: proyecto.nombre,
        tareas,
        proyecto,
        proyectos
    });
};

exports.nuevoProyecto = async (req, res) => {
        const proyectos = await Proyectos.findAll();
        const {nombre} = req.body;
        
        let errores = [];
        
        if(!nombre) {
            errores.push({'texto': 'Agrega un nombre al Proyecto'});
        }
        
        if(errores.length > 0) {
            res.render('nuevoProyecto', {
               title: 'Nuevo Proyecto',
               errores,
               proyectos
            });
        } else {
            const usuarioId = res.locals.usuario.id;
            const proyecto = await Proyectos.create({nombre, usuarioId});
            res.redirect('/');
        }
};

exports.editarProyecto = async (req, res) => {
        
        const {nombre} = req.body;
        
        let errores = [];
        
        if(!nombre) {
            errores.push({'texto': 'Agrega un nombre al Proyecto'});
        }
        
        const usuarioId = res.locals.usuario.id;
        const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
        const proyectoPromise = Proyectos.findOne({
            where: {
                id: req.params.id,
                usuarioId
            }
        });
    
        const [proyecto, proyectos]= await Promise.all([proyectoPromise, proyectosPromise]);
        
        if(errores.length > 0) {
            res.render('nuevoProyecto', {
               title: 'Editar Proyecto',
               errores,
               proyectos,
               proyecto
            });
        } else {
            
            await Proyectos.update({"nombre": nombre}, {"where": {"id": req.params.id}});
            res.redirect('/');
        }
};

exports.deleteProyecto = async (req, res, next) => {     
            const usuarioId = res.locals.usuario.id;    
            const deleted = await Proyectos.destroy({"where": {"url": req.params.url, usuarioId}});
            
            if(!deleted) {
                return next();
            }
            
            res.send('Deleted');
};




