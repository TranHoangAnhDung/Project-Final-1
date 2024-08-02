// popover jquery
const popoverTriggerList = document.querySelectorAll(
  '[data-bs-toggle="popover"]'
);
const popoverList = [...popoverTriggerList].map(
  (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
);

//

function onChangeShippingMethod(element) {
  print();
}

function print() {
  const cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];

  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const formatter = new Intl.NumberFormat("vi-VN");

  let productList = "";
  let sum = 0;

  let shippingFee = Number(
    document.querySelector('input[name="flexRadioDefault"]:checked').value
  );

  cart.forEach((element) => {
    productList += `
        <tr class="elementCheckOut">
        <td class="element"><img src="${element.img}" class="imgCheckOut"/>
        <ul>
        <li>${element.name}</li></ul>
        </td>
        <td><div class="quantityCheckOut">${element.quantity}</div></td>
        <td class="totalPrice">${
          "₫" + formatter.format(element.price * element.quantity)
        }</td>
        </tr>`;

    sum += element.price * element.quantity;
  });

  const inputCheckOut = document.getElementById("inputCheckOut");
  const subtotalInput = document.getElementById("subtotal-input");
  const totalCheckoutInput = document.getElementById("totalCheckout-input");
  const shippingFeeInput = document.getElementById("shippingFee-input");

  inputCheckOut.innerHTML = productList;
  subtotalInput.innerHTML = "₫" + formatter.format(sum);
  shippingFeeInput.innerHTML = "₫" + formatter.format(shippingFee);
  totalCheckoutInput.innerHTML = "₫" + formatter.format(shippingFee + sum);
}
print();

const infor = {
  email: null,
  firstName: null,
  lastName: null,
  address: null,
  address2: null,
  city: null,
  postal: 0,
  phone: 0,
};

function payNow() {
  const userInput = [...document.querySelectorAll(".form-control")];
  userInput.pop();

  let userInformation = [];
  
  for (let index = 0; index < userInput.length; index++) {
    const element = userInput[index];
    infor[element.name] = element.value;
  }
  userInformation.push(infor);
  localStorage.setItem("userInformation", JSON.stringify(userInformation));
}


function showBoard() {
  const userInformation = localStorage.getItem("userInformation")
    ? JSON.parse(localStorage.getItem("userInformation"))
    : [];

  let listInfor = "";
  let email = "";
  userInformation.forEach((element) => {
    listInfor += `
       <div class="row confirmInfor">
       <div class="col-md-3"><h6>Full Name</h6></div>
       <div class="col-md-9 text-secondary">${element.lastName} ${element.firstName}</div></div>
       <hr>
       <div class="row confirmInfor">
       <div class="col-md-3"><h6>Phone</h6></div>
       <div class="col-md-9 text-secondary">${element.phone}</div></div>
       <hr>
       <div class="row confirmInfor">
       <div class="col-md-3"><h6>Address</h6></div>
       <div class="col-md-9 text-secondary">${element.address}</div></div>
       <hr>
        <div class="row confirmInfor">
       <div class="col-md-3"><h6>Address 2</h6></div>
       <div class="col-md-9 text-secondary">${element.address2}</div></div>
       <hr>
        <div class="row confirmInfor">
       <div class="col-md-3"><h6>City</h6></div>
       <div class="col-md-9 text-secondary">${element.city}</div></div>
       <hr>
        <div class="row confirmInfor">
       <div class="col-md-3"><h6>Postal Code</h6></div>
       <div class="col-md-9 text-secondary">${element.postal}</div></div>
         `;

    email += `${element.email}`;
  });

  const tableBody = document.getElementById("inputInformation");
  const inputEmail = document.getElementById("inputEmail");
  tableBody.innerHTML = listInfor;
  inputEmail.innerHTML = email;
}

var myModalEl = document.getElementById("exampleModal");
myModalEl.addEventListener("shown.bs.modal", function (event) {
  showBoard();
});


function reset() {
  const cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
}
