import { getProductContent, saveCart, getCart } from "./functions.js";

function getProductId() {
  return new URL(location.href).searchParams.get("id");
}

function displayContent(productContent) {
  document.getElementById("title").innerText = productContent.name;
  document.querySelector(
    ".item__img"
  ).innerHTML = `<img src="${productContent.imageUrl}" alt="${productContent.altTxt}">`;
  document.getElementById("description").innerText = productContent.description;
  document.getElementById("price").innerText = productContent.price;
  for (let color of productContent.colors) {
    document.getElementById(
      "colors"
    ).innerHTML += `<option value="${color}">${color}</option>`;
  }
}

async function main() {
  const productId = getProductId();
  const productContent = await getProductContent(productId);
  displayContent(productContent);
}

main();

document.getElementById("addToCart").addEventListener("click", () => {
  const productId = getProductId();

  const colorChoice = document.getElementById("colors").value;

  const quantityChoice = document.getElementById("quantity").valueAsNumber;
  console.log(quantityChoice);

  const productOptions = {
    id: productId,
    color: colorChoice,
    quantity: quantityChoice,
  };

  const cart = getCart();

  //Ajouter le produit au panier ou modifier la quantité si le produit existe
  const productInCart = cart.find((product) => {
    return (
      product.id === productOptions.id && product.color === productOptions.color
    );
  });

  if (productInCart) {
    productInCart.quantity += productOptions.quantity;
    alert(
      "Ce produit était déjà dans votre panier, la quantité a été mise à jour avec succès"
    );
  } else {
    cart.push(productOptions);
    alert(
      "Ce produit a été ajouté avec succès. Accédez à votre panier pour finaliser votre commande"
    );
  }

  saveCart(cart);
});
