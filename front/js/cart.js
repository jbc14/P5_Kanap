let getLocalStorage = JSON.parse(localStorage.getItem("product"));

const cartItems = document.getElementById("cart__items");

for (let product of getLocalStorage) {
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

  function displayContent(productContent) {
    cartItems.innerHTML += `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
    <div class="cart__item__img">
      <img src="${productContent.imageUrl}" alt="${productContent.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${productContent.name}</h2>
        <p>${product.color}</p>
        <p>${productContent.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : ${product.quantity}</p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`;
  }

  async function main() {
    const productId = product.id;
    const productContent = await getProductContent(productId);
    displayContent(productContent);
  }

  main();
}
