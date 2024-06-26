import axios from "axios";
import Swal from "sweetalert2";

window.addEventListener("DOMContentLoaded", () => {
  const btnsEliminarComentario = document.querySelectorAll(
    "#eliminarComentario"
  );

  function eliminarElemento(element) {
    element.remove();
  }

  btnsEliminarComentario.forEach((btnEliminarComentario) => {
    btnEliminarComentario.addEventListener("click", (e) => {
      const id = e.target.dataset.comentarioId;
      console.log(id);
      axios
        .post(`/comentario/eliminar/${id}`)
        .then(function (response) {
          Swal.fire({
            title: "Estas seguro?",
            text: "No podra recuperar este meeti!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, borrar!",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Deleted!",
                text: response.data.message,
                icon: "success",
              });
              eliminarElemento(e.target.parentNode.parentNode);
            }
          });
        })
        .catch(function (error) {
          let msgErr = "Ha ocurrido un error, intente mas tarde";
          if (error.response.data) {
            msgErr = error.response.data.message;
          }
          Swal.fire({
            title: "Error!",
            text: msgErr,
            icon: "error",
            confirmButtonText: "Ok",
          });
        });
    });
  });
});
