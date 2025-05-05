// Khởi tạo nếu chưa có danh sách người dùng
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify([]));
}

function register() {
  const newUsername = document.getElementById("new-username").value.trim();
  const newPassword = document.getElementById("new-password").value;
  if (!newUsername || !newPassword) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some(u => u.username === newUsername)) {
    alert("Tài khoản đã tồn tại!");
    return;
  }
  users.push({ username: newUsername, password: newPassword });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Đăng ký thành công! Hãy đăng nhập.");
  document.getElementById("new-username").value = "";
  document.getElementById("new-password").value = "";
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem("loggedInUser", username);
    document.getElementById("login-section").classList.add("d-none");
    document.getElementById("register-section").classList.add("d-none");
    document.getElementById("main-section").classList.remove("d-none");
    loadItems();
  } else {
    alert("Sai tài khoản hoặc mật khẩu");
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  location.reload();
}

document.getElementById("item-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("item-name").value;
  const importPrice = parseFloat(document.getElementById("import-price").value);
  const sellPrice = parseFloat(document.getElementById("sell-price").value);
  const quantity = parseInt(document.getElementById("quantity").value);
  const importDate = document.getElementById("import-date").value;

  const user = localStorage.getItem("loggedInUser");
  const key = `items_${user}`;
  const items = JSON.parse(localStorage.getItem(key) || "[]");

  items.push({ name, importPrice, sellPrice, quantity, importDate });
  localStorage.setItem(key, JSON.stringify(items));
  this.reset();
  loadItems();
});

function loadItems() {
  const tbody = document.getElementById("item-table-body");
  const user = localStorage.getItem("loggedInUser");
  const key = `items_${user}`;
  const allItems = JSON.parse(localStorage.getItem(key) || "[]");
  const filterDate = document.getElementById("filter-date").value;

  let items = allItems;
  if (filterDate) {
    items = allItems.filter(item => item.importDate === filterDate);
  }

  tbody.innerHTML = "";
  let totalImport = 0;
  let totalSell = 0;
  let totalProfit = 0;

  items.forEach((item, index) => {
    const importTotal = item.importPrice * item.quantity;
    const sellTotal = item.sellPrice * item.quantity;
    const profit = sellTotal - importTotal;
    totalImport += importTotal;
    totalSell += sellTotal;
    totalProfit += profit;

    const row = `
      <tr>
        <td>${item.name}</td>
        <td>${item.importPrice.toLocaleString()} VNĐ</td>
        <td>${item.sellPrice.toLocaleString()} VNĐ</td>
        <td>${item.quantity}</td>
        <td>${item.importDate}</td>
        <td>${profit.toLocaleString()} VNĐ</td>
        <td>
          <button onclick="editItem(${index})" class="btn btn-warning btn-sm">Sửa</button>
          <button onclick="deleteItem(${index})" class="btn btn-danger btn-sm">Xóa</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });

  document.getElementById("total-import").textContent = totalImport.toLocaleString();
  document.getElementById("total-sell").textContent = totalSell.toLocaleString();
  document.getElementById("total-profit").textContent = totalProfit.toLocaleString();
}

function clearFilter() {
  document.getElementById("filter-date").value = "";
  loadItems();
}

function deleteItem(index) {
  const user = localStorage.getItem("loggedInUser");
  const key = `items_${user}`;
  const items = JSON.parse(localStorage.getItem(key) || "[]");
  items.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(items));
  loadItems();
}

function editItem(index) {
  const user = localStorage.getItem("loggedInUser");
  const key = `items_${user}`;
  const items = JSON.parse(localStorage.getItem(key) || "[]");
  const item = items[index];

  document.getElementById("item-name").value = item.name;
  document.getElementById("import-price").value = item.importPrice;
  document.getElementById("sell-price").value = item.sellPrice;
  document.getElementById("quantity").value = item.quantity;
  document.getElementById("import-date").value = item.importDate;

  items.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(items));
  loadItems();
}
