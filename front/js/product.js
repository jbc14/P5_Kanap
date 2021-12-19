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

//Local Storage

// let productName = document.getElementById("title").textContent;

// document.getElementById("addToCart").onclick = () => {
//   localStorage.setItem("name", `${productName}`);
// };

function dataStorage(productContent) {
  const productObject = {
    name: `${productContent.name}`,
    color: colors.value,
    quantity: quantity.value,
  };

  document.getElementById("addToCart").onclick = () => {
    localStorage.setItem("name", `${productContent.name}`);
    localStorage.setItem("color", colors.value);
    localStorage.setItem("quantity", quantity.value);
    document.location.reload();
  };
}

async function addToCart() {
  const productId = getProductId();
  const productContent = await getProductContent(productId);
  dataStorage(productContent);
}

addToCart();
