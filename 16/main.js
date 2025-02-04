document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("barChart").getContext("2d");

  // Data
  const data = [30, 60, 25, 75, 45];
  const labels = ["A", "B", "C", "D", "E"];
  const barWidth = 50;
  const spacing = 20;

  // Colors
  ctx.fillStyle = "#007bff";

  // Draw Bars
  data.forEach((value, index) => {
    const x = (spacing + barWidth) * index + spacing;
    const y = 400 - value * 4; // Scale factor

    // Bar
    ctx.fillRect(x, y, barWidth, value * 4);

    // Label
    ctx.fillStyle = "#fff"; // Set label color to white
    ctx.fillText(labels[index], x + 20, 380);
    ctx.fillText(value, x + 20, y - 10);
    ctx.fillStyle = "#007bff";
  });
});
