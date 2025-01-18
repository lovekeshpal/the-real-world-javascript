document.addEventListener("DOMContentLoaded", function () {
  const copyButton = document.getElementById("copyButton");
  const codeSnippet = document.getElementById("codeSnippet");

  copyButton.addEventListener("click", function () {
    codeSnippet.select();
    codeSnippet.setSelectionRange(0, 99999); // For mobile devices

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        alert("Code copied to clipboard!");
      } else {
        alert("Failed to copy code.");
      }
    } catch (err) {
      alert("Failed to copy code.");
    }
  });
});
