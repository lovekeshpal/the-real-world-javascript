document.addEventListener("DOMContentLoaded", function () {
  const progressBar = document.getElementById("progressBar");
  const updateButton = document.getElementById("updateButton");
  let progress = 0;

  updateButton.addEventListener("click", function () {
    if (progress < 100) {
      progress += 10; // Increment progress by 10%
      progressBar.style.width = progress + "%";
      progressBar.setAttribute("aria-valuenow", progress);
    }
  });
});
