const Tareas = require('../models/Tareas');
const Proyectos = require('../models/Proyectos');

exports.nuevaTarea = async (req, res) => {
        const proyectos = await Proyectos.findAll();
        const {tarea} = req.body;
        
        let errores = [];
        
        if(!tarea) {
            errores.push({'texto': 'Agrega un nombre a la Tarea'});
        }
        
        const proyecto = await Proyectos.findOne({where: {id: req.params.id}});
        const proyectoId = proyecto.id;
        
        if(errores.length > 0) {
            res.render('tareas', {
               title: 'Nueva Tarea',
               errores,
               proyectos,
               proyecto
            });
        } else {
            const estado = 0;
            
            const tareaCreated = await Tareas.create({tarea, estado, proyectoId});
            res.redirect(`/proyectos/${proyecto.url}`);
        }
};

exports.cambiarEstadoTarea = async (req, res) => {
        
        const {id} = req.params;
        
        const tarea = await Tareas.findOne({where: {id}});
        
        let estado = 0;
        
        if(tarea.estado === estado) {
            estado = 1;
        }
        
        tarea.estado = estado;
        
        await tarea.save();
        
        res.status(200).send('Todo bien');
};


exports.eliminarTarea = async (req, res, next) => {         
            const deleted = await Tareas.destroy({"where": {"id": req.params.id}});
            
            if(!deleted) {
                return next();
            }
            
            res.send('Eliminado correctamente');
};