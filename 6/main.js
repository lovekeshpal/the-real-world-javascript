document.addEventListener("DOMContentLoaded", function () {
  const stickyHeader = document.getElementById("sticky-header");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      // Adjust the scroll position as needed
      stickyHeader.classList.add("visible");
    } else {
      stickyHeader.classList.remove("visible");
    }
  });
});
