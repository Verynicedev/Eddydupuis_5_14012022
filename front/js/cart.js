"use strict";

import { urlApi } from "/front/js/urlApi.js";                       // Rappel de l'url de l'API
import { setProductLocalStorage } from "/front/js/fonction.js";     // Envoi les informations dans le local storage
import { getProductsInLocalStorage } from "/front/js/fonction.js";  // Récupere les informations dans le local storage

displayProducts();
displaysTotalPriceOfTheItems();
displaysTotalArticle();

// Intégration du bloc HTML et des valeurs du produit récupéré dans le local storage
function displayProduct(integrateProduct) {
  const selectedId = document.getElementById("cart__items");
  const createArticle = document.createElement("article");
  selectedId.appendChild(createArticle);
  createArticle.classList.add("cart__item");
  createArticle.dataset.id = integrateProduct.idProduit;
  createArticle.dataset.color = integrateProduct.color;
  createArticle.innerHTML = `<div class="cart__item__img"> 
    <img src="${integrateProduct.image}"alt="${integrateProduct.altTxt}"> 
    </div>   
      <div class="cart__item__content"> 
        <div class="cart__item__content__titlePrice"> 
          <h2>${integrateProduct.name}</h2>
          <span><strong>${integrateProduct.color}</strong></span> 
          <p>${integrateProduct.price} € </p> 
        </div>
        <div class="cart__item__content__settings"> 
          <div class="cart__item__content__settings__quantity"> 
          <p>Qté : </p> 
          <input type="number" class="itemQuantity" name="itemQuantity" min=1 max=100 value="${integrateProduct.quantity}" data-id="${integrateProduct.idProduit}"> 
        </div> 
        <div class="cart__item__content__settings__delete"> 
          <p class="deleteItem">Supprimer</p> 
        </div> 
      </div> 
    </article>`;

  // "Listeners" permet la suppression du|des articles (Seulement apres que l'HTML soit construit) (bouton "delete" fonctionnel)
  const deleteLinks = document.querySelectorAll(".deleteItem");
  deleteLinks.forEach((deleteLink) => {
    deleteLink.addEventListener("click", deleteItem);
  });

  // "Listeners" permet de modifier la quantité du|des articles (Seulement apres que l'HTML soit construit) (champ "quantité" fonctionnel)
  const quantityLinks = document.querySelectorAll(".itemQuantity");
  quantityLinks.forEach((quantityLink) => {
    quantityLink.addEventListener("change", changeTheQuantityOfTheProduct);
  });
}

// Calcul le prix total de tous les articles du panier
function displaysTotalPriceOfTheItems() {
  let productsStoreInLocalStorage = getProductsInLocalStorage();
  let totalPriceProducts = productsStoreInLocalStorage.reduce(
    (totalPrice, products) => {
      return totalPrice + products.quantity * products.price;
    },
    0
  );
  // Affiche le prix total de tous les articles du panier
  document.querySelector("#totalPrice").innerHTML = totalPriceProducts;
}

// Calcul le nombre total de tous les articles du panier
function displaysTotalArticle() {
  let productsStoreInLocalStorage = getProductsInLocalStorage();
  let totalItemProducts = productsStoreInLocalStorage.reduce(
    (totalItems, items) => {
      return totalItems + items.quantity;
    },
    0
  );
  // Affiche le nombre total des articles du panier
  document.querySelector("#totalQuantity").innerHTML = totalItemProducts;
}

// Affiche les produits enregistrés sur le local storage dans le panier
function displayProducts() {
  let productsInCart = getProductsInLocalStorage();
  if (productsInCart != null) {
    // Trie les produits par leur id
    productsInCart = productsInCart.sort(function (a, b) {
      return a.idProduit.localeCompare(b.idProduit);
    });
    productsInCart.forEach((integreElement) => {
      displayProduct(integreElement);
    });
  }
}

// Permet de supprimer un produit individuellement dans la page panier et le supprime aussi du local storage
function deleteItem(event) {
  event.preventDefault();
  // Suppression de l'élément dans le DOM
  const productToDelete = event.target.closest(".cart__item");
  const idProductToDelete = productToDelete.dataset.id;
  const colorProductTodelete = productToDelete.dataset.color;
  productToDelete.remove();
  // Suppression de l'élément dans le local storage
  let productsInCart = getProductsInLocalStorage();
  productsInCart = productsInCart.filter(
    (productLocalStorage) =>
      productLocalStorage.idProduit !== idProductToDelete ||
      productLocalStorage.color !== colorProductTodelete
  );
  // Sauvegarde dans le local storage
  setProductLocalStorage(productsInCart);
  // Mise à jour du prix et du nombre d'article
  displaysTotalPriceOfTheItems();
  displaysTotalArticle();
}

// Permet de modifier la quantité du produit et enregistre la modification dans le local storage
function changeTheQuantityOfTheProduct(event) {
  event.preventDefault();
  // Récupère l'id et la couleur du produit à modifier
  const productToModifQuantity = event.target.closest(".cart__item");
  const productToModifId = productToModifQuantity.dataset.id;
  const productToModifColor = productToModifQuantity.dataset.color;
  // Modifie la quantité dans le local storage
  const productsInCart = getProductsInLocalStorage();
  const productTuUpdate = productsInCart.find(
    (product) =>
      product.idProduit === productToModifId &&
      product.color === productToModifColor
  );

// Condition qui va tester si la quantité d'article est égale ou supérieur à 1 sinon retourne une erreur
  const quantityMin = event.target.closest(".itemQuantity");
  if (quantityMin.value < 1) {
    alert("Veuillez indiquer une valeur positive");
    return (quantityMin.value = 1);
  } else {                                                      // Sinon met a jour le localStorage
    productTuUpdate.quantity = event.target.valueAsNumber;
    setProductLocalStorage(productsInCart);
  }
  // Mise à jour du prix et du nombre d'article
  displaysTotalArticle();
  displaysTotalPriceOfTheItems();
}

// FORMULAIRE
// Efface le message d'erreur si des valeurs on été saisie
function deleteSendError() {
  let deleteSendErrorLinks = document.querySelectorAll(
    ".cart__order__form__question p"
  );
  deleteSendErrorLinks.forEach((deleteSendErrorLink) => {
    // Condition qui va tester si le champs a été remplie
    if (order !== "") {
      deleteSendErrorLink.innerHTML = null;
    }
  });
}

// Condition de saisie du formulaire
function checkFormValidity() {
  deleteSendError();
  // Erreur de saisie dans le formulaire
  const myRegex_letter = /^[a-zA-Z-\s]{3,20}$/;
  const myRegex_address = /^[a-zA-Z0-9\s]+$/;
  const myRegex_city = /^[0-9]+$/;
  const myRegex_email =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Erreur dans le formulaire
  const hasErrorForFirstname = checkInputValidityAndDisplayErrorIfNeeded(
    myRegex_letter,
    firstName,
    "firstNameErrorMsg",
    "Le prénom doit comporter uniquement des lettres de 3 à 20 caractères maximum"
  );

  const hasErrorForLastname = checkInputValidityAndDisplayErrorIfNeeded(
    myRegex_letter,
    lastName,
    "lastNameErrorMsg",
    "Le nom doit comporter uniquement des lettres de 3 à 20 caractères maximum"
  );

  const hasErrorForAddress = checkInputValidityAndDisplayErrorIfNeeded(
    myRegex_address,
    address,
    "addressErrorMsg",
    "Veuillez indiquer une adresse correcte"
  );

  const hasErrorForCity = checkInputValidityAndDisplayErrorIfNeeded(
    myRegex_city,
    city,
    "cityErrorMsg",
    "Veuillez indiquer le code postal de votre ville"
  );

  const hasErrorForEmail = checkInputValidityAndDisplayErrorIfNeeded(
    myRegex_email,
    email,
    "emailErrorMsg",
    "Veuillez indiquer un email valide 'exemple@hotmail.com'"
  );

  if (
    !hasErrorForFirstname &&
    !hasErrorForLastname &&
    !hasErrorForAddress &&
    !hasErrorForCity &&
    !hasErrorForEmail
  ) {
    const productIdUsers = getProductsInLocalStorage();
    if (productIdUsers.length != 0) {
      makeAndOrder();
    } else {
      alert("Vous n'avez pas de produit dans votre panier");
    }
  }
}

// Analyse le formulaire
function checkInputValidityAndDisplayErrorIfNeeded(
  myRegex,
  inputToCheck,
  selectorForErrorMessage,
  errorMessage
) {
  const sendError = " Merci de remplir tous les champs du formulaire";
  if (inputToCheck.value.trim() == "") {
    document.getElementById(selectorForErrorMessage).innerHTML = sendError;
    return true;
  } else if (myRegex.test(inputToCheck.value.trim()) == false) {
    document.getElementById(selectorForErrorMessage).innerHTML = errorMessage;
    return true;
  }
  return false;
}

// Récupère tous les id des produits stockés dans le local storage
function productIdUsers() {
  let produitStockerLocalStorage = getProductsInLocalStorage();
  // Stock les id récupérés dans le local storage
  const productOrderId = [];
  // Récupère tous les id dans le local storage
  produitStockerLocalStorage.forEach((productOrder) => {
    productOrderId.push(productOrder.idProduit);
  });
  return productOrderId;
}

// Récupère les informations de l'utilisateur ainsi que son panier et va les stocker dans le local storage
function infoUser() {
  const productOrderId = productIdUsers();
  var order = {
    contact: {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    },
    products: productOrderId,
  };
  localStorage.setItem("userInfoCart", JSON.stringify(order));
  return order;
}

// "Listener" Permet d'envoyer le formulaire
function listenerCart() {
  const selectBtnOrder = document.getElementById("order");
  selectBtnOrder.addEventListener("click", (e) => {
    e.preventDefault();
    checkFormValidity();
  });
}
listenerCart();

// Envoi les informations à l'API et récupère l'id de la commande
async function makeAndOrder() {
  // Récupère les informations saisies par l'utilisateur "formulaire et panier"
  const order = infoUser();
  // Envoi les données de type "post" récupérer par l'utilisateur à l'API
  const post = {
    method: "POST",
    body: JSON.stringify(order),
    headers: { "Content-Type": "application/json" },
  };
  // Appel de l'API
  const response = await fetch(`${urlApi}products/order`, post);
  // Récupère la réponse avec le numéro de la commande
  var commandeOrderId = await response.json();
  confirmationOfOrder(commandeOrderId);
}

// Envoi la confirmation de la commande
function confirmationOfOrder(commandeOrderId) {
  window.location.href = `confirmation.html?id=${commandeOrderId.orderId}`;
}