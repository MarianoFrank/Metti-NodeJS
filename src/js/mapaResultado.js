import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";

window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const centro = JSON.parse(urlParams.get("coordenadas"));
  const radio = JSON.parse(urlParams.get("radio")) * 1000;
  if (!centro) {
    return;
  }

  const map = L.map("mapaResultado", {
    center: centro,
    zoom: 13,
  });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.circle(centro, radio, {
    color: "#99CFFF",
    fillColor: "#47a2f3",
    opacity: 0.3,
    fillOpacity: 0.3,
  }).addTo(map);

  //marcadores
  const coordenadas = document.querySelectorAll("#coordenadas-meeti");

  coordenadas.forEach((coordenadaElement) => {
    const coordenada = JSON.parse(coordenadaElement.value).reverse();
    const enlaceMeeti = coordenadaElement.parentElement.querySelector("a");
    const enlace = document.createElement("A");
    enlace.href = enlaceMeeti.href;
    enlace.classList.add("enlace-mapa");
    enlace.textContent = enlaceMeeti.textContent;
    L.marker(coordenada, {
      draggable: false,
      autoPan: false,
    })
      .bindPopup(enlace)
      .addTo(map)
      .openPopup();
  });
});
