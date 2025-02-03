document.addEventListener("DOMContentLoaded", function () {
  const userList = document.getElementById("userList");
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");

  async function fetchUsers() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const users = await response.json();

      loading.style.display = "none";
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
      loading.style.display = "none";
      error.style.display = "block";
      error.textContent = "Error loading users: " + err.message;
    }
  }

  fetchUsers();
});
