//Este codigo funciona solo para cargar 1 imagen
window.addEventListener("DOMContentLoaded", () => {
  const inputFile = document.querySelector('#imagen');
  const dropzoneArea = document.getElementById("drop");
  const uploadTrigger = document.querySelector("#uploadTrigger");
  const preview = document.getElementById("preview");
  const previewContainer = document.querySelector(".preview-container");
  const deleteImg = document.getElementById("deleteImg");
  const hasImageInput = document.querySelector("[name=hasImage]");

  if (!inputFile) {
    return;
  }

  if (preview.src) {
    //Si hay miniatura carga desde el servidor la mostramos
    previewContainer.style.display = "block";
  }

  //Es una bandera que indica que el usuario ha decidido no usar imagen
  function hasImageToggle() {
    if (hasImageInput) {
      if ((hasImageInput.value = "true")) {
        hasImageInput.value = "false";
        return;
      }
      hasImageInput.value = "true";
    }
  }

  function thereIsImage() {
    if (inputFile.files.length > 0) {
      return true;
    }
    return false;
  }

  function showPreview() {
    const file = inputFile.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function () {
        preview.src = reader.result;
        previewContainer.style.display = "block";
        hasImageToggle();
      };

      reader.readAsDataURL(file);
    }
  }

  //Drop area
  dropzoneArea.addEventListener("dragover", function (e) {
    e.preventDefault();
    dropzoneArea.classList.add("dragover");
  });

  dropzoneArea.addEventListener("dragleave", function (e) {
    e.preventDefault();
    dropzoneArea.classList.remove("dragover");
  });

  dropzoneArea.addEventListener("drop", function (e) {
    e.preventDefault();
    if (thereIsImage()) {
      return;
    }

    dropzoneArea.classList.remove("dragover");

    var archivos = e.dataTransfer.files;

    inputFile.files = archivos;

    showPreview();
  });

  //Button por si no funciona el drop
  uploadTrigger.addEventListener("click", function () {
    if (thereIsImage()) {
      return;
    }
    inputFile.click();
  });

  inputFile.addEventListener("change", function () {
    showPreview();
  });

  //Borrar imagen
  deleteImg.addEventListener("click", function () {
    previewContainer.style.display = "none";
    inputFile.value = null;
    hasImageToggle();
  });
});
