import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');
if(btnEliminar) {
btnEliminar.addEventListener('click', e => {
    
    const proyectUrl = e.target.dataset.proyectoUrl;
    
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
            const url = `${location.origin}/proyectos/${proyectUrl}`;
            
            axios.delete(url, {params: {proyectUrl}})
                .then(respuesta => console.log('delete'))
                .catch(e => console.log(e));
            
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
            
            setTimeout(() => {
                window.location = '/';
            }, 3000);
        }
    }).catch(e => {
        Swal.fire({
                title: "error",
                text: "error",
                type: "error"
            });
    });
});
}

export default btnEliminar;
