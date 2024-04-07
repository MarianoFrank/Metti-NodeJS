import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";

window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const centro = JSON.parse(urlParams.get("coordenadas"));

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

  const provider = new OpenStreetMapProvider();
});
