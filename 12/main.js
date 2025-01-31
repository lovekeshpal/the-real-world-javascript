document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("validationForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Reset validation states
    email.classList.remove("is-invalid");
    password.classList.remove("is-invalid");

    let isValid = true;

    // Email validation
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      email.classList.add("is-invalid");
      isValid = false;
    }

    // Password validation
    if (!password.value || password.value.length < 6) {
      password.classList.add("is-invalid");
      isValid = false;
    }

    if (isValid) {
      alert("Form submitted successfully!");
      form.reset();
    }
  });
});
