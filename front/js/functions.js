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
