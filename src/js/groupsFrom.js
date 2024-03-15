import Dropzone from "dropzone";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";

import edjsHTML from "editorjs-html";

window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#form-upload");

  if (!form) {
    return;
  }

  //Editor js

  const descripcionHidden = document.querySelector("#descripcion");

  const editor = new EditorJS({
    holder: "editorjs",
    placeholder: "Descripcion aqui...",
    tools: {
      header: Header,
      list: List,
    },
  });

  const convertBlockToHTML = async function () {
    const contenido = await editor.save();
    if (contenido.blocks.length === 0) {
      return "";
    }
    const edjsParser = edjsHTML();
    //convierte la estructura de editor js en un arreglo de elementos html
    const arrayHtml = edjsParser.parse(contenido);
    //convierto el arreglo en un solo html
    const html = arrayHtml.join("");

    return html;
  };

  //Dropzone
  const removePreview = (file) => {
    file.previewElement.remove();
  };

  Dropzone.autoDiscover = false;

  new Dropzone(form, {
    previewTemplate: document.querySelector("#previewTemplate").innerHTML,
    autoProcessQueue: false,
    parallelUploads: 1,
    maxFiles: 1,
    maxFilesize: 2,
    paramName: "imagen",
    uploadMultiple: false,
    previewsContainer: "#dzPreviewContainer",
    clickable: ".dropzone-drag-area",
    addRemoveLinks: false,
    thumbnailWidth: 900,
    thumbnailHeight: 600,
    acceptedFiles: ".jpeg,.jpg,.png",
    url: "/new-group",
    method: "POST",
    addRemoveLinks: false,
    dictFileTooBig:
      "Archivo muy pesado ({{filesize}}MB). Max: {{maxFilesize}}MB.",
    dictInvalidFileType: "Solo archivos JPG/JPEG y PNG.",
    dictMaxFilesExceeded: "Puedes subir solo una imagen.",
    resizeQuality: 0.8,
    init: function () {
      const myDropzone = this;

      myDropzone.on("error", function (file, message) {
        const errorElement = document.createElement("SPAN");
        errorElement.textContent = message;
        const errorContainer = document.querySelector(".dropzone-error");
        errorContainer.appendChild(errorElement);
        setTimeout(() => {
          errorElement.remove();
        }, 5000);
        //No mostramos la preview ya que tiene error
        removePreview(file);
      });

      myDropzone.on("success", function () {
        window.location.href =
          "/dashboard?msg=Grupo%20creado%20correctamente&type=success";
      });

      myDropzone.element
        .querySelector("button[type=submit]")
        .addEventListener("click", async function (e) {
          e.preventDefault();
          e.stopPropagation();
          descripcionHidden.value = await convertBlockToHTML();
          const inQueue = myDropzone.getQueuedFiles();
          if (inQueue.length > 0) {
            //realiza el post pero no redirecciona
            myDropzone.processQueue();
            return;
          }
          form.submit();
        });
    },
  });
});
