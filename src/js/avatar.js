import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";

window.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("avatar");
  const lienzo = document.querySelector(".lienzo");
  const editorModal = document.querySelector(".editor-avatar");
  const buttonSave = document.querySelector(".editor-avatar .save");
  const imagenPreview = document.getElementById("avatarPreview");

  if (!input) {
    return;
  }

  function getRoundedCanvas(sourceCanvas) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = "destination-in";
    context.beginPath();
    context.arc(
      width / 2,
      height / 2,
      Math.min(width, height) / 2,
      0,
      2 * Math.PI,
      true
    );
    context.fill();
    return canvas;
  }

  function crearRecortador(imagenElement) {
    const cropper = new Cropper(imagenElement, {
      aspectRatio: 1 / 1,
      viewMode: 1,
      background: false,
      zoomable: false,
      scalable: false,
      minCropBoxHeight: 200,
      minCropBoxWidth: 200,
    });

    //cuando se crea el recortador tambien se crea el evento del boton para guardar el recorte
    buttonSave.onclick = function (e) {
      const canvas = cropper.getCroppedCanvas();
      const roundedCanvas = getRoundedCanvas(canvas);
      if (roundedCanvas) {
        roundedCanvas.toBlob((blob) => {
          const croppedFile = new File([blob], "avatar.jpg", {
            type: "image/png",
          });

          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(croppedFile);
          input.files = dataTransfer.files;

          const imageURL = URL.createObjectURL(blob);
          imagenPreview.src = imageURL;
          editorModal.style.display = "none";
        }, "image/png");
      }
    };
  }

  input.onchange = function () {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = document.createElement("img");
        img.src = event.target.result;
        lienzo.appendChild(img);
        editorModal.style.display = "flex";
        crearRecortador(img);
      };
      reader.readAsDataURL(input.files[0]);
    }
  };
});
