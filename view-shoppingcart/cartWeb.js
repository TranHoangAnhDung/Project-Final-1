const inputSum = document.getElementById("inputSum");
const inputTotal = document.getElementById("inputTotal");

function print() {
  const cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];

  if (cart.length === 0) {
    window.location.assign(
      "/view-shoppingcart/emptyCart.html"
    );
    return;
  }

  const tableBody = document.getElementById("tbodyOrder");
  let html = "";

  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const formatter = new Intl.NumberFormat("vi-VN");

  let sum = 0;
  cart.forEach((element, index) => {
    html += `
        <br><tr>
        <td class="element"><img src="${element.img}" class="imgProduct"/>
        <ul>
        <li>${element.name}</li>
        <li>${formatter.format(element.price)} VND</li></ul>
        </td>
        <td class="quantity"><span class="minus" onclick="handleMinus(${index})"><</span>
        <div class="quantityNum">${element.quantity}</div>
        <span class="plus" onclick="handlePlus(${index})">></span></td>
        <td class="totalPrice">${VND.format(
          element.price * element.quantity
        )}</td>
        <td>
        <button type="button" class="btn-delete " data-bs-toggle="modal" data-bs-target="#exampleModal1">
                                <i class="fa fa-trash-alt"></i>
                              </button>
                              
                              <div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                  <div class="modal-content" id="popModal">
                                    <div class="modal-header">
                                      <h1 class="modal-title fs-5" id="exampleModalLabel">Xác nhận xóa giỏ hàng</h1>
                                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                      Xóa giỏ hàng này?
                                    </div>
                                    <div class="modal-footer">
                                      <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="handleDelete(${index})">Xóa</button>
                                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">Hủy</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
        </td>
        </tr>`;

    sum += element.price * element.quantity;
  });
  tableBody.innerHTML = html;
  inputTotal.innerHTML = formatter.format(sum) + " VND";
  inputSum.innerHTML = VND.format(sum);
}
// print();

function handlePlus(index) {
  const cart = JSON.parse(localStorage.getItem("cart"));
  cart[index].quantity++;
  localStorage.setItem("cart", JSON.stringify(cart));
  print();
  iconCartHTML()
}

function handleMinus(index) {
  const cart = JSON.parse(localStorage.getItem("cart"));
  if (cart[index].quantity === 1) {
    return;
  }
  cart[index].quantity--;
  localStorage.setItem("cart", JSON.stringify(cart));
  print();
  iconCartHTML()
}

function handleDelete(index) {
  const cart = JSON.parse(localStorage.getItem("cart"));
  if (cart.length === 1) {
    $("#exampleModal").modal("show");
    // return;
  }
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  print();
  iconCartHTML()
}

function removeAll() {
  const cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  print();
}

document.getElementById("estimateBtn").addEventListener("click", () => {
  const estimateContent = document.getElementById("estimateContent");
  let string = `
    <ul>There are several shipping rates for your address:
    <li>Vận chuyển tiêu chuẩn (Gửi hàng sau 24h): VND 35000</li>
    <li>Vận chuyển hoả tốc 2 giờ (Hà Nội - TP.HCM): VND 55000</li></ul>`;

  estimateContent.innerHTML = string;
});

function start() {
  print();
  iconCartHTML()
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