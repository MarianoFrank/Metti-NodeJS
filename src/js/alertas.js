window.addEventListener("DOMContentLoaded", () => {
  const alertasContainer = document.querySelector(".alertas");

  setTimeout(() => {
    alertasContainer.remove();
  }, 2000);
});
