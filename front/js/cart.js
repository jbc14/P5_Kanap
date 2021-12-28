//---------------------------------------Récupérer et afficher le panier---------------------------------------------------

const cartItems = document.getElementById("cart__items");

function getCart() {
  let cart = localStorage.getItem("cart");
  if (cart == null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
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
        <p>Qté : ${productOptions.quantity}</p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productOptions.quantity}">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>
</article>`;
}

async function displayCart() {
  for (let product of getCart()) {
    const productContent = await getProductContent(product.id);
    displayContent(productContent, product);
  }

  //-----------------------------------Fonction pour mettre à jour le panier après suppression d'un article-------------------------------

  function updateCartTotal() {
    let cartItemsContainer = document.getElementById("cart__items");
    let cartItems = cartItemsContainer.getElementsByClassName("cart__item");
    let totalCartPrice = 0;

    for (let i = 0; i < cartItems.length; i++) {
      let cartItem = cartItems[i];
      let cartItemDescription = cartItem.getElementsByClassName(
        "cart__item__content__description"
      )[0];
      let cartItemPriceElement = cartItemDescription.children[2];
      let cartItemPrice = parseFloat(
        cartItemPriceElement.innerText.replace(" €", "")
      );
      let cartItemQuantity =
        cartItem.getElementsByClassName("itemQuantity")[0].value;

      let cartItemTotalPrice = cartItemPrice * cartItemQuantity;

      totalCartPrice = totalCartPrice + cartItemTotalPrice;
    }
    document.getElementById("totalPrice").innerText = totalCartPrice;
  }

  //----------------------------------------Supprimer un article du panier et mettre à jour le total-------------------------------


  let deleteButtons = document.getElementsByClassName("deleteItem");
  for (let i = 0; i < deleteButtons.length; i++) {
    let button = deleteButtons[i];
    button.addEventListener("click", function (event) {
      let buttonClicked = event.target;
      let itemToDelete = buttonClicked.closest("section > article");
      itemToDelete.remove();

      updateCartTotal();
    });
  }

}

displayCart();

//https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules
