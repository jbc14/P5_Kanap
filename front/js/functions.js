export function getProductContent(productId) {
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

export function updateCartTotal() {
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

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function getCart() {
  let cart = localStorage.getItem("cart");
  if (!cart) {
    return [];
  }

  return JSON.parse(cart);
}
