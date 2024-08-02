//? Get data by api and stored in local
fetch("../database/product.json")
  .then((res) => res.json())
  .then((data) => {
    //* lưu data vào localStorage
    localStorage.setItem("productList", JSON.stringify(data));
    //* render dữ liệu lên màn hình
    renderProduct(data);
    iconCartHTML();
  })
  .catch((err) => console.log(err));

//! function code !!!
//* render dữ liệu lên màn hình

//? show dữ liệu từ local host lên màn hình
// input: List sản phẩm
// output : 1 string html show tất cả sản phẩm và hiển thị lên màn hình
function renderProduct(productList) {
  let html = ``;
  // nhận string 1 object và cộng các string đó để tạo ra 1 string list object
  productList.forEach((product) => {
    html += objectToHtml(product);
  });
  // hiển thị lên cho user
  document.querySelector(".product").innerHTML = html;
}

//? chuyển đổi dữ liệu từ obj thành html
// input : 1 object product
// output : 1 string html show product
function objectToHtml(product) {
  // format object thành 1 string html hiển thị thông tin object
  let html = `<div class="product_item"  onclick="productDetail(${product.id})">
            <div
              class="product-img" name="img"
              style="background-image: url(${product.img})"
            >
              <button class="quick-buy" id="${
                product.id
              }" onclick="quickBuy(event,${product.id})">
                <i class="fa fa-plus"></i>Mua Nhanh
              </button>
            </div>
            <div class="product_content"  >
              <p name="name">${product.name}</p>
              <p class="text_price" name="price">${formatter.format(
                product.price
              )} VND</p>
            </div>
          </div>
        </div>`;
  return html;
}

//? format lại giá tiền vnd
const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});
const formatter = new Intl.NumberFormat("vi-VN");

//* Search sản phẩm dựa trên input user
let searchInput = document.querySelector(".searchText");
let searchProduct = [];
searchInput.onkeyup = function (e) {
  // tao mang luu search product
  let listProduct = JSON.parse(localStorage.getItem("productList"));
  // console.log(e.which)
  if (e.which == 13) {
    searchProduct = searchByInput(searchInput.value, listProduct);
    // nếu không có sp nào khớp thì set search product == dssp ở local
    if (searchProduct.length === 0) {
      window.alert("Không có sản phẩm nào trùng khớp!");
      searchProduct = listProduct;
      renderProduct(searchProduct);
    } else {
      renderProduct(searchProduct);
    }
  }
};
// ? hàm search sản phẩm
// input : input text , list product
// output : list search product
function searchByInput(inputUser, listProduct) {
  let listSearchProduct = listProduct.filter((product) => {
    // check input user nếu không có giá trị thì trả về full sp
    if (inputUser != "") {
      //xóa dấu và đưa về viết thường để so sánh
      if (
        !removeAccents(product.name.toLowerCase()).includes(
          removeAccents(inputUser.toLowerCase())
        )
      ) {
        return false;
      }
    }
    return true;
  });
  return listSearchProduct;
}

// ? remove dau khi người dùng nhập để so sánh
// input: 1 string có dấu
// output: 1 string đã xóa bỏ các dấu
function removeAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

//* Filter giá sp dựa trên dssp user đang tìm
document.querySelector(".btn-submit-filter").onclick = function () {
  let listProductRange = productRangePrice(searchProduct);
  let radioSort = document.getElementsByName("sortProductBy");
  let checkedValue = "";
  for (let i = 0; i < radioSort.length; i++) {
    if (radioSort[i].checked) {
      checkedValue = radioSort[i].value;
    }
  }
  if (listProductRange.length === 0) {
    window.alert("Không có sản phẩm nào trong tầm giá!");
    listProductRange = JSON.parse(localStorage.getItem("productList"));
  }
  if (checkedValue === "sortPriceUp") {
    // hàm sort giá tăng dần
    let sortList = sortPriceUp(listProductRange);
    renderProduct(sortList);
  }
  if (checkedValue === "sortPriceDown") {
    //hàm sort giá giảm dần
    let sortList = sortPriceDown(listProductRange);
    renderProduct(sortList);
  } else {
    renderProduct(listProductRange);
  }
};

//? Price range layout setup
let minVal = document.querySelector(".min_val");
let maxVal = document.querySelector(".max_val");
let minTooltip = document.querySelector(".min-tooltip");
let maxTooltip = document.querySelector(".max-tooltip");
let minGap = 0;
let range = document.querySelector(".slider-track");
let sliderMinValue = Number(minVal.min);
let sliderMaxValue = Number(maxVal.max);

function slideMin() {
  let gap = Number(maxVal.value) - Number(minVal.value);
  if (gap <= minGap) {
    minVal.value = Number(maxVal.value);
  }
  minTooltip.innerHTML = `VND ${formatter.format(minVal.value)}`;
  setArea();
  // console.log(`minVal: ${minVal.value}`);
}

function slideMax() {
  let gap = Number(maxVal.value) - Number(minVal.value);
  if (gap <= minGap) {
    maxVal.value = Number(minVal.value);
  }
  maxTooltip.innerHTML = `VND ${formatter.format(maxVal.value)}`;
  setArea();
  // console.log(`maxVal: ${maxVal.value}`);
}

function setArea() {
  range.style.left = (minVal.value / sliderMaxValue) * 100 + "%";
  range.style.right = 100 - (maxVal.value / sliderMaxValue) * 100 + "%";
}

window.onload = function () {
  slideMin();
  slideMax();
};

//? hàm lược sp theo giá min max
//input :listSearchProduct
//output: list sp trong tầm giá
function productRangePrice(listSearch) {
  if (listSearch.length === 0) {
    listSearch = JSON.parse(localStorage.getItem("productList"));
  }
  let listProductRange = listSearch.filter((product) => {
    if (
      product.price > Number(minVal.value) &&
      product.price < Number(maxVal.value)
    ) {
      return true;
    }
  });
  return listProductRange;
}

//? hàm sort giá tăng dần
// input : mảng dssp user search
// output : mảng đã sort theo giá từ nhỏ tới lớn
function sortPriceUp(productList) {
  // nếu dssp != 0 chỉ sort những sp user đang tìm kiếm
  productList.sort(function (product1, product2) {
    return product1.price - product2.price;
  });
  return productList;
}

//? hàm sort giá giảm dần
// input : mảng dssp user search
// output : mảng đã sort theo giá từ nhỏ tới lớn
function sortPriceDown(productList) {
  productList.sort(function (product1, product2) {
    return product2.price - product1.price;
  });
  return productList;
}

//* show product detail
function productDetail(idProduct) {
  window.location.assign(`/view/product-detail.html?id=${idProduct}`);
}

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
