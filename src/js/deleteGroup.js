import axios from "axios";
import Swal from "sweetalert2";

window.addEventListener("DOMContentLoaded", () => {
  const btnsDeleteGroup = document.querySelectorAll("#deleteGroup");

  function eliminarElemento(element) {
    element.remove();
  }

  btnsDeleteGroup.forEach((btnDeleteGroup) => {
    btnDeleteGroup.addEventListener("click", (e) => {
      const id = e.target.dataset.groupId;

      axios
        .post("/delete-group", {
          id,
        })
        .then(function (response) {
          Swal.fire({
            title: "Estas seguro?",
            text: "No podra recurar este grupo!",
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
