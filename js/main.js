//* way for DB

const productAPI = "http://localhost:8000/products";
const cartAPI = "http://localhost:8000/cart";

//* ADDING/CREATING
const addBtn = document.getElementById("add");
//* modal
const addingModal = document.getElementById("add");
//*inputs
const urlInp = document.getElementById("url-inp");
const titleInp = document.getElementById("title-inp");
const priceInp = document.getElementById("price-inp");
const likedInp = document.getElementById("liked-inp");
const quantityInp = document.getElementById("quantity-inp");

//*save
const saveBtn = document.getElementsByClassName("save-btn")[0];

//* Catalog
const categories = document.getElementById("categories");

//* search
const search = document.getElementsByClassName("search-txt")[0];
let searchValue = search.value;

//* pagination
const limit = 8;
let currentPage = 1;
const prevBtn = document.getElementsByClassName("prev-page")[0];
const nextBtn = document.getElementsByClassName("next-page")[0];

//*edit
let editedId = "";
const editModal = document.querySelector("#edit");
const editUrlInp = document.getElementById("url-edit");
const editTitleInp = document.getElementById("title-edit");
const editPriceInp = document.getElementById("price-edit");
const editLikeInp = document.getElementById("liked-edit");
const editQuantityInp = document.getElementById("quantity-edit");
const editSaveBtn = document.getElementById("save-edited-btn");
const generalModal = document.getElementsByClassName("edited-modal")[0];

//* Basket
const cart = document.getElementById("cart");
const basketModal = document.getElementsByClassName("basket-modal")[0];
const basketModalWindow = document.getElementById("cart");
const cartBtn = document.getElementById("cart-btn");
// const basketCloseBtn = document.getElementsByClassName(
//   "window__basket_close"
// )[0];
let basketCount = document.getElementById("basket-count");

render();

//!============== Create Product Start

addBtn.addEventListener("click", async function () {
  addingModal.style.display = "block";
});

async function creatingProduct(newProduct) {
  await fetch(productAPI, {
    method: "POST",
    body: JSON.stringify(newProduct),
    headers: {
      "Content-Type": "application/json",
    },
  });
  render();
}

saveBtn.addEventListener("click", function () {
  if (
    !urlInp.value.trim() ||
    !titleInp.value.trim() ||
    !priceInp.value.trim() ||
    !likedInp.value.trim() ||
    !quantityInp.value.trim()
  ) {
    alert("Заполните все поля");
    return;
  }
  const newProduct = {
    img: urlInp.value,
    title: titleInp.value,
    price: priceInp.value,
    liked: likedInp.value,
    quantity: quantityInp.value,
  };
  creatingProduct(newProduct);

  urlInp.value = "";
  titleInp.value = "";
  priceInp.value = "";
  likedInp.value = "";
  quantityInp.value = "";
});

//?============== Create Product End

//! Getting Start

async function getProductsFromDb() {
  const data = await fetch(
    `${productAPI}?q=${searchValue}&_limit=${limit}&_page=${currentPage}`
  );
  const res = await data.json();
  return res;
}

async function getProductsFromDbById(id) {
  const data = await fetch(`${productAPI}/${id}`);
  const res = data.json();
  return res;
}

//!render start

async function render() {
  const data = await getProductsFromDb();
  categories.innerHTML = "";
  data.forEach((element) => {
    categories.innerHTML += `
      <div class="row">
        <div class="col-md-3">
          <div class="card" style="width: 250px;">
            <img src="${element.img}" class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title">
                ${element.title} <span>${parseInt(element.liked)}</span>
                <i class="fa-sharp fa-solid fa-heart" style="color:${
                  element.liked > 0 ? "#f05542" : "#000"
                }" onclick="countLike(${element.id})"></i>
              </h5>
              <p class="card-price">
                ${element.price}
              </p>
              <a href="#" data-bs-toggle="modal"
              data-bs-target="#cart" class="btn btn-primary" onclick="addToCart(${
                element.id
              })">в корзину</a>
              <a href="#"         data-bs-toggle="modal"
              data-bs-target="#edit"  class="edit btn btn-primary" onclick="showEdit(${
                element.id
              })">Изменить</a>
              <a href="#"  class="delete btn btn-primary" onclick="deleteProduct(${
                element.id
              })">Удалить</a>
            </div>
          </div>
        </div>
    `;
  });
  chekPages();
}
//? render end

//! search start
search.addEventListener("input", function (e) {
  searchValue = e.target.value;
  render();
});
//? search end

//!pagination start

let counterForPages = 1;
async function chekPages() {
  const data = await fetch(`${productAPI}?q=${searchValue}`);
  const res = await data.json();
  counterForPages = Math.ceil(res.length / limit);
}

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  render();
});

nextBtn.addEventListener("click", () => {
  if (currentPage >= counterForPages) return;
  currentPage++;
  render();
});

//?pagination end

//! like start
async function countLike(id) {
  const product = await getProductsFromDbById(id);
  const changedProduct = {
    ...product,
    liked: parseInt(product.liked) + 1,
  };
  editProduct(id, changedProduct);
}

//! delete start

async function deleteProduct(id) {
  await fetch(`${productAPI}/${id}`, {
    method: "DELETE",
  });
  render();
}
//? delete end

//! edit start

async function editProduct(id, editedProduct) {
  await fetch(`${productAPI}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedProduct),
    headers: {
      "Content-Type": "application/json",
    },
  });
  render();
}
async function showEdit(id) {
  editModal.style.display = "block";
  const data = await getProductsFromDbById(id);
  editUrlInp.value = data.img;
  editTitleInp.value = data.title;
  editPriceInp.value = data.price;
  editLikeInp.value = data.liked;
  editQuantityInp.value = data.quantity;
  editedId = data.id;

  editSaveBtn.addEventListener("click", () => {
    if (
      !editUrlInp.value.trim() ||
      !editTitleInp.value.trim() ||
      !editPriceInp.value.trim() ||
      !editLikeInp.value.trim() ||
      !editQuantityInp.value.trim()
    ) {
      alert("Заполните все поля");
      return;
    }
    const editedProduct = {
      img: editUrlInp.value,
      title: editTitleInp.value,
      price: editPriceInp.value,
      liked: editLikeInp.value,
      quantityInp: editQuantityInp.value,
    };
    editProduct(editedId, editedProduct);
    editModal.style.display = "none";
  });
}

//!=============================BASKET START======================
async function getProductByIdFromCart(id) {
  const data = await fetch(`${cartAPI}/${id}`);
  const res = await data.json();
  return res;
}

async function getProductFromCart() {
  const data = await fetch(`${cartAPI}`);
  const res = await data.json();
}
async function addToCart(id) {
  const data = await getProductsFromDbById(id);
  const dataFromCart = await getProductByIdFromCart(id);
  if (id !== dataFromCart.id) {
    await fetch(`${cartAPI}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    await fetch(`${cartAPI}/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity: parseInt(dataFromCart.quantity) + 1 }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // showBasket();
  }
}
cartBtn.addEventListener("click", async () => {
  await showBasket();
});
cart.addEventListener("click", async () => {
  await showBasket();
  await showPrevTotal();
  basketModal.style.display = "block";
});

async function showBasket() {
  let totalquantity = 0;
  let totalSum = 0;
  const basketData = await fetch(cartAPI);
  const result = await basketData.json();
  //   basketModalWindow.innerHTML = "";
  //   basketModalWindow.style.display = "block";
  result.forEach((basketProduct) => {
    totalquantity += parseInt(basketProduct.quantity);
    totalSum += parseInt(basketProduct.price);
    basketModalWindow.innerHTML += `
    <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">
          Ваша корзина :${totalquantity}
        </h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <div class="shopping-cart">
          <div class="box">
            <i class="fas fa-trash"></i>
            <i class="fa-regular fa-heart"></i>
            <div class="img">
              <img
                src="${basketProduct.img}"
                alt="IMG"
                style="width: 150px; height: 150px"
              />
            </div>
            <div class="content">
              <h3>название</h3>
              <span class="price">цена: ${
                basketProduct.price * basketProduct.quantity
              }</span>

              <span class="quantity"
                >количество: 
                <button style="width: 15px" onclick="Incrementing(${
                  basketProduct.id
                })">+</button>
                ${basketProduct.quantity}
                <button style="width: 15px"onclick="Decrementing(${
                  basketProduct.id
                })">-</button></span
              >
            </div>
          </div>
          <div class="total">сумма: ${totalSum} </div>
          <!-- <a href="#" class="btn">проверка</a> -->
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Отмена
        </button>
        <button type="button" class="btn btn-primary">ЗАКАЗАТЬ</button>
      </div>
    </div>
  </div>
      `;
  });

  //   basketModalWindow.innerHTML += `<span>TOTAL: ${totalquantity}</span>`;
  //   basketModalWindow.innerHTML += `<span>TOTAL: ${totalSum}</span>`;
}
async function Incrementing(id) {
  const data = await fetch(`${cartAPI}/${id}`);
  const res = await data.json();
  await fetch(`${cartAPI}/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity: parseInt(res.quantity) + 1 }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  await showPrevTotal();
  await showBasket();
}

async function Decrementing(id) {
  const data = await fetch(`${cartAPI}/${id}`);
  const res = await data.json();
  if (res.quantity != 1) {
    await fetch(`${cartAPI}/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity: parseInt(res.quantity) - 1 }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  await showPrevTotal();
  await showBasket();
}

async function deletePtoductFromBasket(id) {
  await fetch(`${cartAPI}/${id}`, {
    method: "DELETE",
  });
  await showPrevTotal();
  await showBasket();
}

async function showPrevTotal() {
  let totalquantity = 0;
  const data = await fetch(cartAPI);
  const res = await data.json();
  res.forEach((el) => (totalquantity += parseInt(el.quantity)));

  showTotal(totalquantity);
}

async function showTotal(totalquantity) {
  basketCount.innerText = +totalquantity;
  //   console.log(totalquantity);
}

// basketCloseBtn.addEventListener("click", () => {
//   basketModal.style.display = "none";
// });
//?=============================BASKET END======================
