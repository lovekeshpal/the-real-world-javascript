/* filepath: /e:/Development/the-real-world-javascript/19/main.js */
document.addEventListener("DOMContentLoaded", function () {
  // Create tooltip element
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip-custom";
  document.body.appendChild(tooltip);

  // Get all elements with tooltips
  const elements = document.querySelectorAll("[data-tooltip]");

  elements.forEach((element) => {
    element.addEventListener("mouseenter", showTooltip);
    element.addEventListener("mouseleave", hideTooltip);
    element.addEventListener("mousemove", moveTooltip);
  });

  function showTooltip(e) {
    const text = this.getAttribute("data-tooltip");
    tooltip.textContent = text;
    tooltip.classList.add("active");
    moveTooltip.call(this, e);
  }

  function hideTooltip() {
    tooltip.classList.remove("active");
  }

  function moveTooltip(e) {
    const tooltipHeight = tooltip.offsetHeight;
    const tooltipWidth = tooltip.offsetWidth;

    tooltip.style.left = `${e.pageX - tooltipWidth / 2}px`;
    tooltip.style.top = `${e.pageY - tooltipHeight - 10}px`;
  }
});
