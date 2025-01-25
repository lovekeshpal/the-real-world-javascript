document.addEventListener("DOMContentLoaded", function () {
  const colorButton = document.getElementById("colorButton");
  const colorBox = document.getElementById("colorBox");

  colorButton.addEventListener("click", function () {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    colorBox.style.backgroundColor = randomColor;
  });
});
