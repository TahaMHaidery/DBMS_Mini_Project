const userTableBody = document.querySelector("#userTable tbody");
const createUserForm = document.getElementById("createUserForm");
const editUserForm = document.getElementById("editUserForm");

// Fetch and display users
async function loadUsers() {
  const res = await fetch("http://localhost:5000/api/users/getAllUsers");
  const users = await res.json().then((users) => users.results);

  userTableBody.innerHTML = "";
  users.forEach((user) => {
    userTableBody.innerHTML += `
      <tr>
        <td>${user.Name}</td>
        <td>${user.Email}</td>
        <td>${user.RoleName}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick='editUser(${JSON.stringify(
            user
          )})'>Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteUser(${
            user.UserID
          })">Delete</button>
        </td>
      </tr>
    `;
  });
}

// Add User
createUserForm.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(createUserForm);
  const data = Object.fromEntries(formData.entries());

  const res = await fetch("http://localhost:5000/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    createUserForm.reset();
    bootstrap.Modal.getInstance(
      document.getElementById("createUserModal")
    ).hide();
    loadUsers();
  }
};

// Edit User
function editUser(user) {
  const modal = new bootstrap.Modal(document.getElementById("editUserModal"));
  editUserForm.userId.value = user.UserID;
  editUserForm.name.value = user.Name;
  editUserForm.email.value = user.Email;
  editUserForm.roleId.value = user.RoleID;
  modal.show();
}

editUserForm.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(editUserForm);
  const data = Object.fromEntries(formData.entries());
  const userId = data.userId;

  const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    editUserForm.reset();
    bootstrap.Modal.getInstance(
      document.getElementById("editUserModal")
    ).hide();
    loadUsers();
  }
};

// Delete User
async function deleteUser(userId) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
    method: "DELETE",
  });

  if (res.ok) loadUsers();
}

// Initial Load
loadUsers();
