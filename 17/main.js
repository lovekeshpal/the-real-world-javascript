document.addEventListener("DOMContentLoaded", function () {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;

      // Update buttons
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Update panels
      tabPanels.forEach((panel) => {
        panel.classList.remove("active");
        if (panel.dataset.tab === tabId) {
          panel.classList.add("active");
        }
      });
    });
  });
});
