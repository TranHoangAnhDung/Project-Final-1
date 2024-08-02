// Lấy tham số từ URL
const urlParams = new URLSearchParams(window.location.search);
const id = Number(urlParams.get("id"));
console.log(id); // In ra: 123

fetch("../database/product.json")
  .then((res) => res.json())
  .then((data) => {
    //* lưu data vào localStorage
    localStorage.setItem("productList", JSON.stringify(data));
    //* render dữ liệu lên màn hình
    renderDetail(id);
    iconCartHTML()
  })
  .catch((err) => console.log(err));

//* show product detail
//? hiển thị sản phẩm detail
function renderDetail(id) {
  productList = JSON.parse(localStorage.getItem("productList"));
  console.log(id); // In ra: 123
  product = productList.find((item) => {
    return item.id == id;
  });
  let html = ` 
        <div class="col-lg-6 img"><img src="../img-product/${
          product.img
        }" alt=""></div>
        <div class="col-lg-6 content">
          <h1>${product.name}</h1>
          <h3>${formatter.format(product.price)} VND</h3>
          <p>
            ${formatDes(product.description)}
          </p>
          <div class="btn-setup">
            <button class="btn-detail btn-add" onclick="quickBuy(event,${product.id})">Thêm vào giỏ hàng</button>
            <button class="btn-detail btn-back" onclick="showListProduct()">Quay về trang sản phẩm</button>
          </div>
           
        </div>
      `;
  document.querySelector(".detail").innerHTML = html;
}

//? Format lại des của sp
function formatDes(str) {
  return str.replace(/\./g, ". <br/>");
}
//? format lại giá tiền vnd
const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});
const formatter = new Intl.NumberFormat("vi-VN");

//* Shopping cart
// ? Lấy sản phẩm trong local và show CartWeb
function quickBuy(event, productId) {
  fetch("../database/product.json")
    .then((res) => res.json())
    .then((data) => {
      let productObj;
      for (let index = 0; index < data.length; index++) {
        if (data[index].id == productId) {
          productObj = data[index];
          productObj.quantity = 1;
        }
      }

      let cart = [];
      if (localStorage.getItem("cart")) {
        cart = [...JSON.parse(localStorage.getItem("cart"))];
      }

      // neu cart da chua name, thi quantity +1
      // nguoc lai, add product moi quantity 1
      let isExistedProduct = false;
      for (let index = 0; index < cart.length; index++) {
        const element = cart[index];
        if (element.id == productId) {
          isExistedProduct = true;
          element.quantity++;
        }
      }
      if (!isExistedProduct) {
        cart.push(productObj);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      iconCartHTML();
    });
  console.log(productId);
  event.stopPropagation();
}

// ? Hiển thị số lượng trong giỏ hàng
function iconCartHTML() {
  let totalHTML = document.querySelector(".shopping-count");
  let totalQuantity = 0;

  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    cart.forEach((element) => {
      totalQuantity += element.quantity;
    });
  }
  totalHTML.innerText = totalQuantity;
}

//* Trở về trang sản phẩm
function showListProduct() {
  window.location.assign(`/view/product.html`);
}


