//---------------------------------------Récupérer et afficher le panier---------------------------------------------------

const cartItems = document.getElementById("cart__items");
const products = [];

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCart() {
  let cart = localStorage.getItem("cart");
  if (!cart) {
    return [];
  }

  return JSON.parse(cart);
}

function getProductContent(productId) {
  return fetch("http://localhost:3000/api/products/" + productId)
    .then(function (res) {
      return res.json();
    })
    .then(function (product) {
      return product;
    })
    .catch(function (error) {
      alert(error);
    });
}

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

//-----------------------------------Fonction pour mettre à jour le prix total après suppression d'un article-------------------------------

function updateCartTotal() {
  // let cartItemsContainer = document.getElementById("cart__items");
  // let cartItems = cartItemsContainer.getElementsByClassName("cart__item");
  // let totalCartPrice = 0;

  // for (let cartItem of cartItems) {
  //   let cartItemDescription = cartItem.getElementsByClassName(
  //     "cart__item__content__description"
  //   )[0];
  //   let cartItemPriceElement = cartItemDescription.children[2];
  //   let cartItemPrice = parseFloat(
  //     cartItemPriceElement.innerText.replace(" €", "")
  //   );
  //   let cartItemQuantity =
  //     cartItem.getElementsByClassName("itemQuantity")[0].value;

  //   let cartItemTotalPrice = cartItemPrice * cartItemQuantity;

  //   totalCartPrice = totalCartPrice + cartItemTotalPrice;
  // }
  // document.getElementById("totalPrice").innerText = totalCartPrice;
  const cart = getCart();
  document.getElementById("totalPrice").innerText = cart.reduce(
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

//https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules

//Modules
//Suite de tests
//Envoi du formaulaire et validation des champs
//Page de validation