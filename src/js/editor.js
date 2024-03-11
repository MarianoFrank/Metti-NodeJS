import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";

import edjsHTML from "editorjs-html";

window.addEventListener("DOMContentLoaded", () => {
  const editorElement = document.querySelector("#editorjs");
  if (editorElement) {
    const editor = new EditorJS({
      holder: editorElement,
      placeholder: "Descripcion aqui...",
      tools: {
        header: Header,
        list: List,
      },
    });

    const form = document.querySelector(".editorjs-form");

    if (form) {
      const submit = form.querySelector("[type='submit']");
      const hiddenDescripcion = form.querySelector("#descripcion"); //input hidden

      submit.addEventListener("click", async (e) => {
        e.preventDefault();
        const contenido = await editor.save();

        const edjsParser = edjsHTML();
        //convierte la estructura de editor js en un arreglo de elementos html
        const arrayHtml = edjsParser.parse(contenido);
        //convierto el arreglo en un solo html
        const html = arrayHtml.join("");

        hiddenDescripcion.value = html;
        console.log(html);
        form.submit();
      });
    }
  }
});
