document.addEventListener("DOMContentLoaded", function () {
  const increaseButton = document.getElementById("increaseButton");
  const decreaseButton = document.getElementById("decreaseButton");
  const textParagraph = document.getElementById("textParagraph");

  increaseButton.addEventListener("click", function () {
    let currentFontSize = parseFloat(
      window.getComputedStyle(textParagraph, null).getPropertyValue("font-size")
    );
    textParagraph.style.fontSize = currentFontSize + 2 + "px";
  });

  decreaseButton.addEventListener("click", function () {
    let currentFontSize = parseFloat(
      window.getComputedStyle(textParagraph, null).getPropertyValue("font-size")
    );
    textParagraph.style.fontSize = currentFontSize - 2 + "px";
  });
});
