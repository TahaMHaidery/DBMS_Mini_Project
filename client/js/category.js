const categoryTableBody = document.querySelector("#categoryTable tbody");

// Load Categories
async function loadCategories() {
  const res = await fetch("http://localhost:5000/api/categories");
  const categories = await res.json().then((categories) => categories.results);
  categoryTableBody.innerHTML = "";

  categories.forEach((category) => {
    categoryTableBody.innerHTML += `
      <tr>
        <td>${category.CategoryName}</td>
        <td>${category.Description}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick='showEditModal(${JSON.stringify(
            category
          )})'>Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteCategory('${
            category.CategoryID
          }')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// Create Category
document
  .getElementById("createCategoryForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const newCategory = {
      name: form.name.value,
      description: form.description.value,
    };

    await fetch("http://localhost:5000/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCategory),
    });

    form.reset();
    bootstrap.Modal.getInstance(
      document.getElementById("createCategoryModal")
    ).hide();
    loadCategories();
  });

// Edit Category Modal Setup
function showEditModal(category) {
  const modal = new bootstrap.Modal(
    document.getElementById("editCategoryModal")
  );
  const form = document.getElementById("editCategoryForm");
  form.categoryId.value = category.CategoryID;
  form.name.value = category.CategoryName;
  form.description.value = category.Description;
  modal.show();
}

// Update Category
document
  .getElementById("editCategoryForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedCategory = {
      name: form.name.value,
      description: form.description.value,
    };

    await fetch(
      `http://localhost:5000/api/categories/${form.categoryId.value}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCategory),
      }
    );

    bootstrap.Modal.getInstance(
      document.getElementById("editCategoryModal")
    ).hide();
    loadCategories();
  });

// Delete Category
async function deleteCategory(id) {
  if (confirm("Are you sure you want to delete this category?")) {
    await fetch(`http://localhost:5000/api/categories/${id}`, {
      method: "DELETE",
    });
    loadCategories();
  }
}

// Initial Load
loadCategories();
