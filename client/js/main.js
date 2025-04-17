const APIUsers = "http://localhost:5000/api/users/total";
const APIProducts = "http://localhost:5000/api/products/total";
const APICategories = "http://localhost:5000/api/categories/total";
const APISuppliers = "http://localhost:5000/api/suppliers/total";
const APIOrders = "http://localhost:5000/api/orders/total";
const APISTKTR = "http://localhost:5000/api/stocktransactions/total";

document.addEventListener("DOMContentLoaded", () => {
  getAllCategoriesCount();
  getAllUserCount();
  getAllSupplierCount();
  getAllProductsCount();
  getAllOrderCount();
  getStockTransactionsCounts();
});

function getAllUserCount() {
  fetch(APIUsers)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("totalUsers").textContent = data.count;
    });
}

function getAllProductsCount() {
  fetch(APIProducts)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("totalProducts").textContent = data.count;
    });
}

function getAllCategoriesCount() {
  fetch(APICategories)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("totalCategories").textContent = data.count;
    });
}

function getAllSupplierCount() {
  fetch(APISuppliers)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("totalSuppliers").textContent = data.count;
    });
}

function getAllOrderCount() {
  fetch(APIOrders)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("totalOrders").textContent = data.count;
    });
}

function getStockTransactionsCounts() {
  fetch(APISTKTR)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("totalStockTransactions").textContent =
        data.count;
    });
}
