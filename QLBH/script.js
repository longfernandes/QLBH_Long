// Tải lần đầu
window.onload = () => {
    const user = localStorage.getItem("loggedIn");
    if (user) {
      showDashboard();
      renderTable();
    }
  };
  
  // Hiển thị form
  function showAuth() {
    document.getElementById("authSection").style.display = "block";
    document.getElementById("dashboardSection").style.display = "none";
  }
  
  function showDashboard() {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("dashboardSection").style.display = "block";
  }
  
  // Đăng ký
  function register() {
    const user = document.getElementById("regUser").value.trim();
    const pass = document.getElementById("regPass").value.trim();
    if (!user || !pass) return alert("Vui lòng nhập đầy đủ!");
    if (localStorage.getItem("user_" + user)) return alert("Tên đăng nhập đã tồn tại!");
  
    localStorage.setItem("user_" + user, pass);
    alert("Đăng ký thành công!");
  }
  
  // Đăng nhập
  function login() {
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value.trim();
    const storedPass = localStorage.getItem("user_" + user);
    if (storedPass === pass) {
      localStorage.setItem("loggedIn", user);
      showDashboard();
      renderTable();
    } else {
      alert("Sai thông tin đăng nhập!");
    }
  }
  
  // Đăng xuất
  function logout() {
    localStorage.removeItem("loggedIn");
    showAuth();
  }
  
  // Lấy mặt hàng theo tài khoản và ngày
  function getItemsByDate(date) {
    const user = localStorage.getItem("loggedIn");
    return JSON.parse(localStorage.getItem(`items_${user}_${date}`)) || [];
  }
  
  // Lưu mặt hàng theo ngày
  function saveItemsByDate(date, items) {
    const user = localStorage.getItem("loggedIn");
    localStorage.setItem(`items_${user}_${date}`, JSON.stringify(items));
  }
  
  // Thêm mặt hàng
  function addItem() {
    const name = document.getElementById("itemName").value.trim();
    const cost = parseFloat(document.getElementById("itemCost").value);
    const price = parseFloat(document.getElementById("itemPrice").value);
    const quantity = parseInt(document.getElementById("itemQuantity").value);
    const date = document.getElementById("itemDate").value;
  
    if (!name || isNaN(cost) || isNaN(price) || isNaN(quantity) || quantity < 1 || !date) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
  
    const items = getItemsByDate(date);
    items.push({ name, cost, price, quantity, date });
    saveItemsByDate(date, items);
    clearInputs();
    renderTable();
  }
  
  function clearInputs() {
    document.getElementById("itemName").value = "";
    document.getElementById("itemCost").value = "";
    document.getElementById("itemPrice").value = "";
    document.getElementById("itemQuantity").value = "";
    document.getElementById("itemDate").value = "";
  }
  
  // Xoá mặt hàng
  function deleteItem(date, index) {
    const items = getItemsByDate(date);
    items.splice(index, 1);
    saveItemsByDate(date, items);
    renderTable();
  }
  
  // Hiển thị bảng
  function renderTable() {
    const filterDate = document.getElementById("filterDate").value;
    const date = filterDate || new Date().toISOString().split('T')[0]; // Sử dụng ngày hiện tại nếu không có lọc
  
    const items = getItemsByDate(date);
    const table = document.getElementById("itemTable");
    table.innerHTML = "";
  
    let totalCost = 0;   // Tổng giá nhập
    let totalProfit = 0; // Tổng lợi nhuận
  
    items.forEach((item, i) => {
      const profit = (item.price - item.cost) * item.quantity;
      totalCost += item.cost * item.quantity;
      totalProfit += profit;
      
      table.innerHTML += `
        <tr>
          <td>${item.name}</td>
          <td>${item.cost.toFixed(2)}</td>
          <td>${item.price.toFixed(2)}</td>
          <td>${item.quantity}</td>
          <td>${profit.toFixed(2)}</td>
          <td>${item.date}</td>
          <td><button class="btn btn-danger btn-sm" onclick="deleteItem('${item.date}', ${i})">Xoá</button></td>
        </tr>
      `;
    });
  
    // Hiển thị tổng
    document.getElementById("totalCost").innerText = totalCost.toFixed(2);
    document.getElementById("totalProfit").innerText = totalProfit.toFixed(2);
  }
  