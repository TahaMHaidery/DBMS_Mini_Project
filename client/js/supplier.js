const supplierTableBody = document.querySelector("#supplierTable tbody");

// Load Suppliers
async function loadSuppliers() {
  const res = await fetch("http://localhost:5000/api/suppliers");
  const suppliers = await res.json().then((suppliers) => suppliers.results);
  supplierTableBody.innerHTML = "";

  suppliers.forEach((supplier) => {
    supplierTableBody.innerHTML += `
      <tr>
        <td>${supplier.SupplierName}</td>
        <td>${supplier.ContactPerson}</td>
        <td>${supplier.Phone}</td>
        <td>${supplier.Email}</td>
        <td>${supplier.Address}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick='showEditModal(${JSON.stringify(
            supplier
          )})'>Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteSupplier('${
            supplier.SupplierID
          }')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// Create Supplier
document
  .getElementById("createSupplierForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const newSupplier = {
      name: form.supplierName.value,
      contactPerson: form.contactPerson.value,
      phone: form.phone.value,
      email: form.email.value,
      address: form.address.value,
    };

    await fetch("http://localhost:5000/api/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSupplier),
    });

    form.reset();
    bootstrap.Modal.getInstance(
      document.getElementById("createSupplierModal")
    ).hide();
    loadSuppliers();
  });

// Show Edit Modal
function showEditModal(supplier) {
  const modal = new bootstrap.Modal(
    document.getElementById("editSupplierModal")
  );
  const form = document.getElementById("editSupplierForm");
  form.supplierID.value = supplier.SupplierID;
  form.supplierName.value = supplier.SupplierName;
  form.contactPerson.value = supplier.ContactPerson;
  form.phone.value = supplier.Phone;
  form.email.value = supplier.Email;
  form.address.value = supplier.Address;
  modal.show();
}

// Update Supplier
document
  .getElementById("editSupplierForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedSupplier = {
      name: form.supplierName.value,
      contactPerson: form.contactPerson.value,
      phone: form.phone.value,
      email: form.email.value,
      address: form.address.value,
    };

    await fetch(
      `http://localhost:5000/api/suppliers/${form.supplierID.value}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSupplier),
      }
    );

    bootstrap.Modal.getInstance(
      document.getElementById("editSupplierModal")
    ).hide();
    loadSuppliers();
  });

// Delete Supplier
async function deleteSupplier(id) {
  if (confirm("Are you sure you want to delete this supplier?")) {
    await fetch(`http://localhost:5000/api/suppliers/${id}`, {
      method: "DELETE",
    });
    loadSuppliers();
  }
}

// Initial Load
loadSuppliers();
