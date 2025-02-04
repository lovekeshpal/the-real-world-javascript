document.addEventListener("DOMContentLoaded", function () {
  const userList = document.getElementById("userList");
  const error = document.getElementById("error");
  const apiList = document.querySelector(".api-list");
  const skeletonLoader = document.getElementById("skeletonLoader");

  async function fetchUsers() {
    try {
      // Add artificial delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const users = await response.json();

      apiList.classList.add("loaded");

      users.forEach((user) => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.innerHTML = `
          <div>
            <strong>${user.name}</strong>
            <div class="user-email">${user.email}</div>
          </div>
          <span class="badge badge-primary">${user.company.name}</span>
        `;
        userList.appendChild(li);
      });
    } catch (err) {
      apiList.classList.add("loaded");
      error.style.display = "block";
      error.textContent = "Error loading users: " + err.message;
    }
  }

  fetchUsers();
});
