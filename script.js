const cartContainer = document.getElementById("cart-container");
const productsContainer = document.getElementById("products-container");
const dessertCards = document.getElementById("dessert-card-container");
const cartBtn = document.getElementById("cart-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");
const totalNumberOfItems = document.getElementById("total-items");
const cartSubTotal = document.getElementById("subtotal");
const cartTaxes = document.getElementById("taxes");
const cartTotal = document.getElementById("total");
const showHideCartSpan = document.getElementById("show-hide-cart");
let isCartShowing = false;

const products = [
  {
    id: 1,
    name: "Vanilla Cupcakes (6 Pack)",
    price: 12.99,
    category: "Cupcake",
  },
  {
    id: 2,
    name: "French Macaroon",
    price: 3.99,
    category: "Macaroon",
  },
  {
    id: 3,
    name: "Pumpkin Cupcake",
    price: 3.99,
    category: "Cupcake",
  },
  {
    id: 4,
    name: "Chocolate Cupcake",
    price: 5.99,
    category: "Cupcake",
  },
  {
    id: 5,
    name: "Chocolate Pretzels (4 Pack)",
    price: 10.99,
    category: "Pretzel",
  },
  {
    id: 6,
    name: "Strawberry Ice Cream",
    price: 2.99,
    category: "Ice Cream",
  },
  {
    id: 7,
    name: "Chocolate Macaroons (4 Pack)",
    price: 9.99,
    category: "Macaroon",
  },
  {
    id: 8,
    name: "Strawberry Pretzel",
    price: 4.99,
    category: "Pretzel",
  },
  {
    id: 9,
    name: "Butter Pecan Ice Cream",
    price: 2.99,
    category: "Ice Cream",
  },
  {
    id: 10,
    name: "Rocky Road Ice Cream",
    price: 2.99,
    category: "Ice Cream",
  },
  {
    id: 11,
    name: "Vanilla Macaroons (5 Pack)",
    price: 11.99,
    category: "Macaroon",
  },
  {
    id: 12,
    name: "Lemon Cupcakes (4 Pack)",
    price: 12.99,
    category: "Cupcake",
  },
];


//Destrutturizza ogni prodotto dell'array.
//Aggiunge al div 'dessertCards' uno string template cone le varie value di ogni prodotto,
//  e il button per aggiungere al carrello.
products.forEach(
  ({ name, id, price, category }) => {
    dessertCards.innerHTML += `
      <div class="dessert-card">
        <h2>${name}</h2>
        <p class="dessert-price">$${price}</p>
        <p class="product-category">Category: ${category}</p>
        <button 
          id="${id}" 
          class="btn add-to-cart-btn">Add to cart
        </button>
      </div>
    `;
  }
);


//Viene definita una classe con 3 proprietà.
//addItem primo metodo che ha come argomenti id e l'array products.
//  memorizza nella variabile product l'esatto prodotto che cerchiamo confrontando l'id.
//Destrutturizza le due proprietà di product così da poterle utilizzare singolarmente dopo.
//  Aggiunge a this.items il prodotto
//  Iniziallizziamo un oggetto vuoto per tener conto di quanti prodotti uguali vengono inseriti nella cart.
//  Per ogni dessert presente aggiungiamo all'id 1 altrimenti 0 se non è presente.

class ShoppingCart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.taxRate = 8.25;
  }

  addItem(id, products) {
    const product = products.find((item) => item.id === id);
    const { name, price } = product;
    this.items.push(product);

    const totalCountPerProduct = {};
    this.items.forEach((dessert) => {
      totalCountPerProduct[dessert.id] = (totalCountPerProduct[dessert.id] || 0) + 1;
    })

    //Memorizzi il numero di quanti prodotti con quel'id sono presenti in totalCountPerProduct.
    //Ottiene l'elemento del DOM che ha un'idpari aproduct-count-for-id seguito dall'id del prodotto (id`). 
    //  Questo elemento è dove visualizzerai il conteggio del prodotto nel carrello.
    const currentProductCount = totalCountPerProduct[product.id];
    const currentProductCountSpan = document.getElementById(`product-count-for-id${id}`);

    //Controlla se il prodotto non è stato aggiunto più di una volta.
    //Se lo è cambia il testo del conteggio del prodotto seguito da una "x".
    //Altrimenti aggiunge il prodotto al carrello.
    currentProductCount > 1 
      ? currentProductCountSpan.textContent = `${currentProductCount}x`
      : productsContainer.innerHTML += `
      <div id=dessert${id} class="product">
        <p>
          <span class="product-count" id=product-count-for-id${id}></span>${name}
        </p>
        <p>${price}</p>
      </div>
      `;
  }

  //Metodo per ottere quanti prodotti ci sono nel carrello.
  getCounts() {
    return this.items.length;
  }

  //Libera il carrello, se il numero di prodotti nel carrello è 0. Alert!
  //Finestra con messaggio che chiede conferma per svuotare il carrello.
  //Se l'utente conferma, resettiamo tutti i valori.
  clearCart() {
    if (!this.items.length) {
      alert("Your shopping cart is already empty");
      return;
    }

    const isCartCleared = confirm(
      "Are you sure you want to clear all items from your shopping cart?"
    );

    if (isCartCleared) {
      this.items = [];
      this.total = 0;
      productsContainer.innerHTML = "";
      totalNumberOfItems.textContent = 0;
      cartSubTotal.textContent = 0;
      cartTaxes.textContent = 0;
      cartTotal.textContent = 0;
    }
  }

  //Metodo per calcolare le tasse. .toFixed(2) serve a ottenere solo 2 decimali.
  calculateTaxes(amount) {
    return parseFloat(((this.taxRate / 100) * amount).toFixed(2));
  }

  //Calcola il totale e cambia il testo ai rispettivi elementi.
  calculateTotal() {
    const subTotal = this.items.reduce((total, item) => total + item.price, 0);
    const tax = this.calculateTaxes(subTotal);
    this.total = subTotal + tax;
    cartSubTotal.textContent = `$${subTotal.toFixed(2)}`;
    cartTaxes.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${this.total.toFixed(2)}`;
    return this.total;
  }
};


//Finita la classe, istanziamo la classe.
//Selezioniamo il bottone per aggiungere al carrello.
//Spread operator per trasformare la node list in array, così da poter utilizzare .forEach
// Aggiunta di un event listener a ciascun pulsante "add-to-cart-btn".
// Quando il pulsante viene cliccato, chiamiamo il metodo addItem sull'oggetto cart.
// Aggiornamento del numero totale di elementi nel carrello
// Calcolo e aggiornamento del totale del carrello
const cart = new ShoppingCart();
const addToCartBtns = document.getElementsByClassName("add-to-cart-btn");

[...addToCartBtns].forEach(
  (btn) => {
    btn.addEventListener("click", (event) => {
      cart.addItem(Number(event.target.id), products);
      totalNumberOfItems.textContent = cart.getCounts();
      cart.calculateTotal();
    })
  }
);


//Aggiungiamo un event listener al pulsante del carrello.
//Lo fa apparire e scomparire e cambia il testo del pulsante in base alla condizione.
cartBtn.addEventListener("click", () => {
  isCartShowing = !isCartShowing;
  showHideCartSpan.textContent = isCartShowing ? "Hide" : "Show";
  cartContainer.style.display = isCartShowing ? "block" : "none";
});

//Il metodo .bind(cart) è utilizzato per fissare il contesto della funzione clearCart all'oggetto cart. 
//In altre parole, quando la funzione clearCart viene eseguita in risposta all'evento click, 
//  this all'interno della funzione sarà l'oggetto cart.
//Questo è importante perché spesso all'interno di un gestore di eventi, 
//  il contesto di this è l'elemento DOM che ha scatenato l'evento. 
//Utilizzando .bind(cart), stai assicurando che all'interno della funzione clearCart, 
//  this si riferisca all'istanza dell'oggetto cart anziché all'elemento del pulsante
//      clearCartBtn.addEventListener("click", cart.clearCart.bind(cart))