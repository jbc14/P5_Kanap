import { getProductContent, saveCart, getCart } from "./functions.js";

const cartItems = document.getElementById("cart__items");
const products = [];

function displayContent(productContent, productOptions) {
  cartItems.innerHTML += `<article class="cart__item" data-id="${productOptions.id}" data-color="${productOptions.color}">
  <div class="cart__item__img">
    <img src="${productContent.imageUrl}" alt="${productContent.altTxt}">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${productContent.name}</h2>
      <p>${productOptions.color}</p>
      <p>${productContent.price} €</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productOptions.quantity}">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>
</article>`;
}

function updateCartTotal() {
  const cart = getCart();
  document.getElementById("totalPrice").innerText = cart.reduce(
    (total, element) => {
      const product = products.find((p) => p._id === element.id);
      return total + element.quantity * product.price;
    },
    0
  );
}

function updateQuantityTotal() {
  const cart = getCart();
  document.getElementById("totalQuantity").innerText = cart.reduce(
    (total, element) => {
      const product = products.find((p) => p.quantity === element.quantity);
      return total + element.quantity;
    },
    0
  );
}
//-------------------------Main Function : Récupérer les produits, les intégrer au HTML, Supprimer ou changer quantité, Prix total

async function displayCart() {
  for (let product of getCart()) {
    const productContent = await getProductContent(product.id);
    products.push(productContent);
    displayContent(productContent, product);
  }
  updateQuantityTotal();
  updateCartTotal();

  //----------------------------------------Supprimer un article du panier et mettre à jour le total-------------------------------

  const deleteButtons = document.getElementsByClassName("deleteItem");
  for (let button of deleteButtons) {
    button.addEventListener("click", function (event) {
      let buttonClicked = event.target;
      let itemToDelete = buttonClicked.closest("section > article");
      itemToDelete.remove();

      const cart = getCart();

      let itemToDeleteId = itemToDelete.getAttribute("data-id");
      let itemToDeleteColor = itemToDelete.getAttribute("data-color");

      const productIndexToDelete = cart.findIndex(
        (product) =>
          product.id === itemToDeleteId && product.color === itemToDeleteColor
      );

      cart.splice(productIndexToDelete, 1);

      saveCart(cart);
      updateQuantityTotal();
      updateCartTotal();
    });
  }

  //----------------------------------------Modifier la quantité et mettre à jour le total-------------------------------

  const quantityInput = document.getElementsByClassName("itemQuantity");
  for (let input of quantityInput) {
    input.addEventListener("change", function (event) {
      const item = input.closest("section > article");

      const cart = getCart();

      const id = item.getAttribute("data-id");
      const color = item.getAttribute("data-color");

      const product = cart.find((p) => p.id === id && p.color === color);
      product.quantity = input.valueAsNumber;
      saveCart(cart);
      updateQuantityTotal();
      updateCartTotal();
    });
  }
}

displayCart();

//----------------------------------Validation des champs du formulaire----------------

let isFirstNameValid = false;
let isLastNameValid = false;
let isAddressValid = false;
let isCityValid = false;
let isEmailValid = false;

let firstNameInput = document.getElementById("firstName");
let lastNameInput = document.getElementById("lastName");
let addressInput = document.getElementById("address");
let cityInput = document.getElementById("city");
let emailInput = document.getElementById("email");

const masqueNumbers = /[0-9]/;

function isValid(formValue, errorMsg) {
  if (formValue && !masqueNumbers.test(formValue)) {
    errorMsg.textContent = " ";
    return true;
  } else {
    errorMsg.textContent =
      "Ce champ doit être rempli et ne pas contenir de chiffre";
    return false;
  }
}

firstNameInput.addEventListener("input", function (e) {
  let formValue = e.target.value;
  const errorMsg = document.getElementById("firstNameErrorMsg");
  isFirstNameValid = isValid(formValue, errorMsg);
});

lastNameInput.addEventListener("input", function (e) {
  let formValue = e.target.value;
  const errorMsg = document.getElementById("lastNameErrorMsg");
  isLastNameValid = isValid(formValue, errorMsg);
});

addressInput.addEventListener("input", function (e) {
  let addressFormValue = e.target.value;
  const addressErrorMsg = document.getElementById("addressErrorMsg");

  if (addressFormValue) {
    addressErrorMsg.textContent = "";
    isAddressValid = true;
  } else {
    addressErrorMsg.textContent = "Ce champ doit être rempli";
    isAddressValid = false;
  }
});

cityInput.addEventListener("input", function (e) {
  let formValue = e.target.value;
  const errorMsg = document.getElementById("cityErrorMsg");
  isCityValid = isValid(formValue, errorMsg);
});

emailInput.addEventListener("input", function (e) {
  const emailFormValue = e.target.value;
  const emailErrorMsg = document.getElementById("emailErrorMsg");
  const masqueEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  if (emailFormValue && masqueEmail.test(emailFormValue)) {
    emailErrorMsg.textContent = "";
    isEmailValid = true;
  } else {
    emailErrorMsg.textContent = "Veuillez renseigner une adresse email valide";
    isEmailValid = false;
  }
});

let inputEvent = new Event("input");
firstNameInput.dispatchEvent(inputEvent);
lastNameInput.dispatchEvent(inputEvent);
addressInput.dispatchEvent(inputEvent);
cityInput.dispatchEvent(inputEvent);
emailInput.dispatchEvent(inputEvent);

//------------------------------------Commander----------------------------

const orderButton = document.getElementById("order");

orderButton.addEventListener("click", async (e) => {
  e.preventDefault();
  let cart = getCart();
  if (cart.length == 0) {
    alert("Votre panier est vide !");
  } else {
    if (
      isFirstNameValid &&
      isLastNameValid &&
      isAddressValid &&
      isCityValid &&
      isEmailValid
    ) {
      let contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value,
      };
      const orderId = await fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact,
          products: getCart().map((cartItem) => cartItem.id),
        }),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (response) {
          return response.orderId;
        });
      // localStorage.cart = [];
      window.location.href = `../html/confirmation.html?orderid=${orderId}`;
    } else {
      alert("Merci de bien renseigner tous les champs du formulaire");
    }
  }
});
