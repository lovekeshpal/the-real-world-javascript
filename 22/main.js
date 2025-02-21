document.addEventListener("DOMContentLoaded", function () {
  const colorInput = document.getElementById("colorInput");
  const colorDisplay = document.getElementById("colorDisplay");

  colorInput.addEventListener("input", function () {
    const selectedColor = colorInput.value;
    colorDisplay.style.backgroundColor = selectedColor;
  });
});
