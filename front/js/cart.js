import { saveCart, getCart, updateCartTotal, getProductContent } from "./functions";

const cartItems = document.getElementById("cart__items");
const products = [];

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
