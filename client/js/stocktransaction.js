const tableBody = document.querySelector("#transactionTable tbody");
const filterType = document.getElementById("filterType");
const filterProduct = document.getElementById("filterProduct");
const filterFrom = document.getElementById("filterFrom");
const filterTo = document.getElementById("filterTo");

let allTransactions = [];
let allProducts = [];

async function loadProducts() {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    allProducts = data.results;

    filterProduct.innerHTML += allProducts
      .map((p) => `<option value="${p.ProductID}">${p.ProductName}</option>`)
      .join("");
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

async function loadTransactions() {
  try {
    const res = await fetch("http://localhost:5000/api/stocktransactions");
    const data = await res.json();
    allTransactions = data.results;
    displayTransactions(allTransactions);
  } catch (err) {
    console.error("Error loading transactions:", err);
  }
}

function displayTransactions(transactions) {
  tableBody.innerHTML = "";
  transactions.forEach((tx) => {
    const product =
      allProducts.find((p) => p.ProductID == tx.ProductID)?.ProductName ||
      "Unknown";
    tableBody.innerHTML += `
      <tr>
        <td>${tx.TransactionID}</td>
        <td>${product}</td>
        <td>${tx.Quantity}</td>
        <td>${tx.TransactionType}</td>
        <td>${new Date(tx.TransactionDate).toLocaleString()}</td>
      </tr>
    `;
  });
}

function applyFilters() {
  let filtered = [...allTransactions];

  const type = filterType.value;
  const product = filterProduct.value;
  const from = filterFrom.value;
  const to = filterTo.value;

  if (type) {
    filtered = filtered.filter((tx) => tx.TransactionType === type);
  }

  if (product) {
    filtered = filtered.filter((tx) => tx.ProductID == product);
  }

  if (from) {
    const fromDate = new Date(from);
    filtered = filtered.filter(
      (tx) => new Date(tx.TransactionDate) >= fromDate
    );
  }

  if (to) {
    const toDate = new Date(to);
    filtered = filtered.filter((tx) => new Date(tx.TransactionDate) <= toDate);
  }

  displayTransactions(filtered);
}

function resetFilters() {
  filterType.value = "";
  filterProduct.value = "";
  filterFrom.value = "";
  filterTo.value = "";
  displayTransactions(allTransactions);
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadProducts();
  await loadTransactions();
});
