const textInput = document.getElementById("textInput");
const charCount = document.getElementById("charCount");

textInput.addEventListener("input", () => {
  const remaining = 50 - textInput.value.length;
  charCount.textContent = remaining;
});
