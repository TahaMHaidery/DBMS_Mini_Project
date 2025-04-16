const productTableBody = document.querySelector("#productTable tbody");
const createForm = document.getElementById("createProductForm");
const editForm = document.getElementById("editProductForm");

const loadDropdowns = async () => {
  const [categoriesRes, suppliersRes] = await Promise.all([
    fetch("http://localhost:5000/api/categories"),
    fetch("http://localhost:5000/api/suppliers"),
  ]);
  const categories = await categoriesRes.json().then((categories) => {
    return categories.results.map((category) => ({
      ...category,
      id: category.CategoryID,
      name: category.CategoryName,
    }));
  });
  const suppliers = await suppliersRes.json().then((suppliers) => {
    return suppliers.results.map((supplier) => ({
      ...supplier,
      id: supplier.SupplierID,
      name: supplier.SupplierName,
    }));
  });

  const populateSelect = (select, data, key = "name") => {
    const listOfItems = data.map(
      (item) => `<option value="${item.id}">${item[key]}</option>`
    );
    listOfItems.unshift(
      "<option disabled selected value>--- select a option ---</option>"
    );

    select.innerHTML = listOfItems;
  };

  populateSelect(createForm.categoryId, categories);
  populateSelect(createForm.supplierId, suppliers);

  populateSelect(editForm.categoryId, categories);
  populateSelect(editForm.supplierId, suppliers);
};

async function loadProducts() {
  const [res, categoriesRes, suppliersRes] = await Promise.all([
    fetch("http://localhost:5000/api/products"),
    fetch("http://localhost:5000/api/categories"),
    fetch("http://localhost:5000/api/suppliers"),
  ]);
  const categories = await categoriesRes.json().then((categories) => {
    return categories.results.map((category) => ({
      ...category,
      id: category.CategoryID,
      name: category.CategoryName,
    }));
  });
  const suppliers = await suppliersRes.json().then((suppliers) => {
    return suppliers.results.map((supplier) => ({
      ...supplier,
      id: supplier.SupplierID,
      name: supplier.SupplierName,
    }));
  });
  const products = await res.json().then((products) => products.results);

  productTableBody.innerHTML = "";

  products.forEach((p, i) => {
    const categoryName = categories.find(
      (category) => category.CategoryID === p.CategoryID
    ).name;

    const supplierName = suppliers.find(
      (supplier) => supplier.SupplierID === p.SupplierID
    ).name;

    productTableBody.innerHTML += `
      <tr>
        <td>${p.ProductName}</td>
        <td>${categoryName}</td>
        <td>${supplierName}</td>
        <td>${p.QuantityInStock}</td>
        <td>${p.PricePerUnit}</td>
        <td>${p.ReorderLevel}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick='showEditModal(${JSON.stringify(
            p
          )})'>Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteProduct('${
            p.ProductID
          }')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// CREATE
createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newProduct = {
    name: createForm.productName.value,
    category: createForm.categoryId.value,
    supplier: createForm.supplierId.value,
    quantity: createForm.quantityInStock.value,
    pricePerUnit: createForm.pricePerUnit.value,
    reorderLevel: createForm.reorderLevel.value,
  };

  await fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct),
  });

  bootstrap.Modal.getInstance(
    document.getElementById("createProductModal")
  ).hide();
  createForm.reset();
  loadProducts();
});

// EDIT
function showEditModal(product) {
  const modal = new bootstrap.Modal(
    document.getElementById("editProductModal")
  );
  editForm.productId.value = product.ProductID;
  editForm.productName.value = product.ProductName;
  editForm.categoryId.value = product.CategoryID;
  editForm.supplierId.value = product.SupplierID;
  editForm.quantityInStock.value = product.QuantityInStock;
  editForm.pricePerUnit.value = product.PricePerUnit;
  editForm.reorderLevel.value = product.ReorderLevel;
  modal.show();
}

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const updatedProduct = {
    name: editForm.productName.value,
    category: editForm.categoryId.value,
    supplier: editForm.supplierId.value,
    quantity: editForm.quantityInStock.value,
    pricePerUnit: editForm.pricePerUnit.value,
    reorderLevel: editForm.reorderLevel.value,
  };

  await fetch(
    `http://localhost:5000/api/products/${editForm.productId.value}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    }
  );

  bootstrap.Modal.getInstance(
    document.getElementById("editProductModal")
  ).hide();
  loadProducts();
});

// DELETE
async function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
    });
    loadProducts();
  }
}

// INIT
loadDropdowns();
loadProducts();
