(async function () {
  const productId = getProductId();
  const productContent = await getProductContent(productId);
  displayContent(productContent);
})();

function getProductId() {
  return new URL(location.href).searchParams.get("id");
}

function getProductContent(productId) {
  return fetch("http://localhost:3000/api/products/" + productId)
    .then(function (httpBodyResponse) {
      return httpBodyResponse.json();
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
  document.querySelector(".item__img").innerHTML = `<img src="${productContent.imageURL}" alt="${productContent.altTXT}"></img>`;
  document.getElementById("description").innerText = productContent.description;
  document.getElementById("price").innerText = productContent.price;
}
