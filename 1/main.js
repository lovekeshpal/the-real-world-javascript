document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from submitting
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username && password) {
      alert("Login successful");
    } else {
      alert("Please fill in both fields");
    }
  });
