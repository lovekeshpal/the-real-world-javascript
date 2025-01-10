document.getElementById("searchInput").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  const items = document.querySelectorAll("#itemList .list-group-item");

  items.forEach((item) => {
    const text = item.textContent.toLowerCase();
    const index = text.indexOf(searchTerm);

    if (index !== -1 && searchTerm !== "") {
      const highlightedText = item.textContent.substring(
        index,
        index + searchTerm.length
      );
      item.innerHTML = item.textContent.replace(
        highlightedText,
        `<span class="highlight">${highlightedText}</span>`
      );
    } else {
      item.innerHTML = item.textContent;
    }
  });
});
