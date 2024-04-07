import axios from "axios";
import Swal from "sweetalert2";

window.addEventListener("DOMContentLoaded", () => {
  const asistenciaBtn = document.getElementById("confirmarAsistencia");

  if (!asistenciaBtn) {
    return;
  }
  const meetiSlug = asistenciaBtn.dataset.meeti;

  function actualizarMensaje(data) {
    if (data.asiste) {
      asistenciaBtn.textContent = "Cancelar";
      asistenciaBtn.classList.remove("btn-azul");
      asistenciaBtn.classList.add("btn-rojo");
    } else {
      asistenciaBtn.textContent = "Si";
      asistenciaBtn.classList.remove("btn-rojo");
      asistenciaBtn.classList.add("btn-azul");
    }
    const { msg } = data;
    if (msg) {
      asistenciaBtn.removeEventListener("click", clickHandler);
      const msgElement = document.createElement("legend");
      msgElement.textContent = msg;
      asistenciaBtn.parentElement.appendChild(msgElement);
      setTimeout(() => {
        msgElement.remove();
        asistenciaBtn.addEventListener("click", clickHandler);
      }, 1000);
    }
  }

  async function clickHandler(e) {
    e.preventDefault();
    await axios
      .post(`/confirmar-asitencia/${meetiSlug}`)
      .then((response) => {
        if (response.data) {
          actualizarMensaje(response.data);
        }
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
  }

  asistenciaBtn.addEventListener("click", clickHandler);

  async function verificarEstado() {
    await axios
      .post(`/asiste/${meetiSlug}`)
      .then((response) => {
        if (response.data) {
          actualizarMensaje(response.data);
        }
      })
      .catch(function (error) {});
  }

  verificarEstado();
});
