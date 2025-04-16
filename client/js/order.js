const createForm = document.getElementById("createOrderForm");
const orderTableBody = document.querySelector("#orderTable tbody");
let productList = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  document
    .getElementById("addProductBtn")
    .addEventListener("click", addProductRow);
});

// Fetch products from backend
function fetchProducts() {
  fetch("http://localhost:5000/api/products")
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched products:", data);
      productList = Array.isArray(data) ? data : data.results || [];
    })
    .catch((err) => console.error("Error fetching products:", err));
}

// Fetch orders from backend
function loadOrders() {
  fetch("http://localhost:5000/api/orders")
    .then((response) => response.json())
    .then((data) => {
      return data.results || [];
    })
    .then((orders) => {
      orderTableBody.innerHTML = "";
      orders.forEach((order, i) => {
        const orderId = order.OrderID;
        const date = order.OrderDate;
        const type = order.Type;
        const status = order.Status;

        const actionButtons =
          status === "Pending"
            ? `
              <button class="btn btn-sm" onclick='updateOrderStatus("Completed", "${orderId}")'>&#9989;</button>
              <button class="btn btn-sm" onclick='updateOrderStatus("Cancelled", "${orderId}")'>&#10060;</button>
            `
            : "";

        orderTableBody.innerHTML += `
          <tr>
            <td>${orderId}</td>
            <td>${date}</td>
            <td>${type}</td>
            <td>${status}</td>
            <td>
              ${actionButtons}
            </td>
          </tr>
        `;
      });
    })
    .catch((err) => console.error("Error fetching orders:", err));
}

// Add new row to order table
function addProductRow() {
  const container = document.getElementById("orderItemsContainer");

  const row = document.createElement("tr");

  let productOptions = `<option value="" disabled selected>Select product</option>`;
  productList.forEach((product) => {
    productOptions += `<option value="${product.ProductID}" data-price="${product.PricePerUnit}">
            ${product.ProductName}
        </option>`;
  });

  row.innerHTML = `
        <td>
            <select name="productId" id="product-select" class="form-select product-select">
                ${productOptions}
            </select>
        </td>
        <td>
            <input type="number" name="orderQuantity" id="orderQuantity" class="form-control qty-input" min="1" value="1">
        </td>
        <td>
            <button type="button" class="btn btn-danger btn-sm" onclick="removeProductRow(this)">X</button>
        </td>
    `;

  container.appendChild(row);
}

// Remove a row from table
function removeProductRow(button) {
  const row = button.closest("tr");
  row.remove();
}

// CREATE
createForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();

    const orderDetails = [];

    // Get all product rows
    const productRows = document.querySelectorAll("#orderItemsContainer tr");

    productRows.forEach((row) => {
      const productSelect = row.querySelector("#product-select");
      const qtyInput = row.querySelector("#orderQuantity");

      if (productSelect && qtyInput) {
        const productId = productSelect.value;
        const quantity = parseInt(qtyInput.value);

        if (productId && quantity > 0) {
          orderDetails.push({
            productId,
            quantity,
          });
        }
      }
    });

    const newOrder = {
      orderDetails,
      orderType: createForm.orderType.value,
    };

    await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    });

    bootstrap.Modal.getInstance(
      document.getElementById("createOrderModal")
    ).hide();
    createForm.reset();
  } catch (error) {
    console.error("error in creating order", error);
  } finally {
    loadOrders();
  }
});

// Update Order Status
async function updateOrderStatus(status, id) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/orders/${id}/updateStatus`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      const errorObject = {
        message: error.error,
        status: response.status,
      };
      throw errorObject;
    }
    loadOrders();
  } catch (error) {
    const message = error.message;
    alert(message);
  }
}

// INIT
loadOrders();
