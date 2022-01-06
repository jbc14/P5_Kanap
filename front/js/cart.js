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
  document.getElementById("totalPrice").innerText = [].reduce(
    (total, element) => {
      const product = products.find((p) => p._id === element.id);
      return total + element.quantity * product.price;
    },
    0
  );
}

async function displayCart() {
  for (let product of getCart()) {
    const productContent = await getProductContent(product.id);
    products.push(productContent);
    displayContent(productContent, product);
  }

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

document.getElementById("firstName").addEventListener("input", function (e) {
  let firstNameFormValue = e.target.value;
  const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
  const masqueFirstName = /[0-9]/;

  if (firstNameFormValue && masqueFirstName.test(firstNameFormValue)) {
    firstNameErrorMsg.textContent =
      "Le champ Prénom ne doit pas contenir de chiffre";
  } else {
    firstNameErrorMsg.textContent = " ";
    return (isFirstNameValid = true);
  }
});

document.getElementById("lastName").addEventListener("input", function (e) {
  let lastNameFormValue = e.target.value;
  const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
  const masqueLastName = /[0-9]/;

  if (lastNameFormValue && masqueLastName.test(lastNameFormValue)) {
    lastNameErrorMsg.textContent =
      "Le champ Nom ne doit pas contenir de chiffre";
  } else {
    lastNameErrorMsg.textContent = " ";
    return (isLastNameValid = true);
  }
});

document.getElementById("city").addEventListener("input", function (e) {
  let cityFormValue = e.target.value;
  const cityErrorMsg = document.getElementById("cityErrorMsg");
  const masqueCity = /[0-9]/;

  if (cityFormValue && masqueCity.test(cityFormValue)) {
    cityErrorMsg.textContent = "Le champ Ville ne doit pas contenir de chiffre";
  } else {
    cityErrorMsg.textContent = " ";
    return (isCityValid = true);
  }
});

document.getElementById("address").addEventListener("input", function (e) {
  let addressFormValue = e.target.value;
  const addressErrorMsg = document.getElementById("addressErrorMsg");

  if (!addressFormValue) {
    addressErrorMsg.textContent = "Le champ Adresse doit être rempli";
  } else {
    addressErrorMsg.textContent = " ";
    return (isAddressValid = true);
  }
});

document.getElementById("email").addEventListener("input", function (e) {
  const emailFormValue = e.target.value;
  const emailErrorMsg = document.getElementById("emailErrorMsg");
  const masqueEmail1 = /@/;
  const masqueEmail2 = /\.com|\.fr/;

  if (
    !emailFormValue ||
    (masqueEmail1.test(emailFormValue) && masqueEmail2.test(emailFormValue))
  ) {
    emailErrorMsg.textContent = " ";
    return (isEmailValid = true);
  } else {
    emailErrorMsg.textContent = "Veuillez renseigner une adresse email valide";
  }
});

//dispatchEvent

//------------------------------------Commander----------------------------

const orderButton = document.getElementById("order");
class userContact {
  constructor(firstName, lastName, address, city, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.city = city;
    this.email = email;
  }
}

orderButton.addEventListener("click", async (e) => {
  e.preventDefault();
  if (
    (isFirstNameValid,
    isLastNameValid,
    isAddressValid,
    isCityValid,
    isEmailValid)
  ) {
    let contact =
      (document.getElementById("firstName").value,
      document.getElementById("lastName").value,
      document.getElementById("address").value,
      document.getElementById("city").value,
      document.getElementById("email").value);
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
    localStorage.clear();
    window.location.href = `../html/confirmation.html?orderid=${orderId}`;
  } else {
    alert("Merci de bien renseigner tous les champs du formulaire");
  }
});
