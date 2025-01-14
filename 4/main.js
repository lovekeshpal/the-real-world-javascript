document.addEventListener("DOMContentLoaded", function () {
  const collapsibleButton = document.querySelector(".collapsible-button");
  const collapsibleContent = document.querySelector(".collapsible-content");

  collapsibleButton.addEventListener("click", function () {
    this.classList.toggle("active");
    if (collapsibleContent.style.display === "block") {
      collapsibleContent.style.display = "none";
    } else {
      collapsibleContent.style.display = "block";
    }
  });
});