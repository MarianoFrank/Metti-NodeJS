import Dropzone from "dropzone";

window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#form-upload");

  if (!form) {
    return;
  }

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
    addRemoveLinks: true,
    thumbnailWidth: 900,
    thumbnailHeight: 600,
    acceptedFiles: ".jpeg,.jpg,.png",
    url: "/new-group",
    addRemoveLinks: false,
    autoQueue: false,
    init: function () {
      const myDropzone = this;

      myDropzone.on("addedfile", (file) => {
        
      });
    },
  });

  const formSubmitButton = form.querySelector("[type=submit]");
  formSubmitButton.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("click");
  });
});
