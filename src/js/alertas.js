window.addEventListener("DOMContentLoaded", () => {
  const alertasContainer = document.querySelector(".alertas");
  if (!alertasContainer) { 
    return;
  }
  setTimeout(() => {
    alertasContainer.remove();
  }, 2000);
});
