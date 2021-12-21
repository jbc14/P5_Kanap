function getProductId() {
  return new URL(location.href).searchParams.get("id");
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

// const productId = getProductId();
// getProductContent(productId).then((productContent) => {
//   displayContent(productContent);
// });
// getProductContent(productId).then(displayContent);

//------------------------------------Local Storage

// function dataStorage(productContent) {
//   const productObject = {
//     name: `${productContent.name}`,
//     color: document.getElementById('colors').value,
//     quantity: document.getElementById('quantity').value,
//   };

//   document.getElementById("addToCart").onclick = () => {
//     localStorage.setItem("product", JSON.stringify(productObject));

//     // localStorage.setItem("name", `${productContent.name}`);
//     // localStorage.setItem("color", colors.value);
//     // localStorage.setItem("quantity", quantity.value);
//     document.location.reload();
//   };
// }

// async function addToCart() {
//   const productId = getProductId();
//   const productContent = await getProductContent(productId);
//   dataStorage(productContent);
// }

// addToCart();

//------------------------------------------------------------ DEUXIEME ESSAI
// function saveCart() {
//   localStorage.setItem("cart", JSON.stringify(cart));
// }

// function getCart() {
//   let cart = localStorage.getItem("cart");
//   if (cart == null) {
//     return [];
//   } else {
//     return JSON.parse(cart);
//   }
// }

// async function addToCart() {
//   const productId = getProductId();
//   const productContent = await getProductContent(productId);

//   let productObject = {
//     id: productContent.id,
//     color: colors.value,
//     quantity: quantity.value,
//   };

//   let cart = getCart();
//   cart.push(productObject);
//   saveCart(cart);
// }

// document.getElementById("addToCart").onclick = () => {
//   addToCart();
//   document.location.reload();
// };

//-------------------------------Troisième essai---------------------

const btn_addToCart = document.getElementById("addToCart");

btn_addToCart.addEventListener("click", (event) => {
  const productId = getProductId();

  const colorChoice = document.getElementById("colors").value;

  const quantityChoice = document.getElementById("quantity").value;

  let productOptions = {
    id: productId,
    color: colorChoice,
    quantity: quantityChoice,
  };

  let getLocalStorage = JSON.parse(localStorage.getItem("product"));

  if (getLocalStorage !== null) {
    getLocalStorage.push(productOptions);
    localStorage.setItem("product", JSON.stringify(getLocalStorage));
  } else {
    getLocalStorage = [];
    getLocalStorage.push(productOptions);
    localStorage.setItem("product", JSON.stringify(getLocalStorage));
  }

  console.log(getLocalStorage);
});
