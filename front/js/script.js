// Récupérer les produits

const productsList = () => {
  return fetch("http://localhost:3000/api/products")
    .then(function (res) {
      if (res.ok) {
        return res.json().then(function (productsObject) {
          console.log(productsObject);
          return productsObject.map(function (productObject) {
            return productObject;
          });
        });
      }
    })
    .catch((err) => {
      alert(err.message);
    });
};

productsList().then(function (products) {
  createProducts(products);
});

// Afficher les produits

const items = document.getElementById("items");

function newItem(product) {
  items.innerHTML += `
  <a href="./product.html?id=${product._id}">
            <article>
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
          </a>`
}

function createProducts(products) {
  for (let product of products) {
    newItem(product);
  }
}
