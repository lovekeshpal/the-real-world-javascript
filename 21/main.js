document.addEventListener("DOMContentLoaded", function () {
  const networkStatus = document.getElementById("networkStatus");
  const statusText = document.getElementById("statusText");
  const statusIcon = networkStatus.querySelector("i");

  function updateNetworkStatus() {
    if (navigator.onLine) {
      networkStatus.classList.remove("offline");
      networkStatus.classList.add("online");
      statusText.textContent = "You are online";
      statusIcon.className = "fas fa-check-circle";
    } else {
      networkStatus.classList.remove("online");
      networkStatus.classList.add("offline");
      statusText.textContent = "You are offline";
      statusIcon.className = "fas fa-times-circle";
    }
    networkStatus.style.display = "block";
  }

  window.addEventListener("online", updateNetworkStatus);
  window.addEventListener("offline", updateNetworkStatus);

  // Initial check
  updateNetworkStatus();
});
