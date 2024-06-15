const tareas = document.querySelector('.listado-pendientes');
import axios from 'axios';
import Swal from 'sweetalert2';
import {actualizarAvance} from '../funciones/avance';

if(tareas) {
    tareas.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const tareaId = icono.parentElement.parentElement.dataset.tarea;
            
            const url = `${location.origin}/tareas/${tareaId}`;
            
            axios.patch(url, {tareaId})
                .then(respuesta => {
                   if(respuesta.status === 200) {
                       icono.classList.toggle('completo');
                       actualizarAvance();
                   }
                })
                .catch(e => console.log(e));
        }
        
        if(e.target.classList.contains('fa-trash')) {
            const icono = e.target;
            const tareaId = icono.parentElement.parentElement.dataset.tarea;
            
            const url = `${location.origin}/tareas/${tareaId}`;
            
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(url)
                        .then(respuesta => {
                            if(respuesta.status === 200) {
                                Swal.fire({
                                    title: "Deleted!",
                                    text: respuesta.data,
                                    icon: "success"
                                });
                                icono.parentElement.parentElement.remove();
                            }
                            
                            actualizarAvance();
                        })
                        .catch(e => console.log(e));
        
                }        
            });
        }
    });
}
export default tareas;

