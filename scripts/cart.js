const CART_ITEMS_KEY = "cdm_cartItems";

const getCartItems = () => {
  let storedCartItems = localStorage.getItem(CART_ITEMS_KEY);
  return storedCartItems ? JSON.parse(storedCartItems) : [];
};

const setCartItems = (cartItems = []) => {
  localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));
};

export const countCartItems = () => {
  let cartItems = getCartItems();

  return Number(cartItems.length);
};

function renderCartItems() {
  let cartItemsDiv = document.getElementById("cart_items");

  const itemsCount = countCartItems();
}

function renderCartItemsCount() {
  let cartItemsCountDiv = document.getElementById("cart_items_count");

  const itemsCount = countCartItems();
  cartItemsCountDiv.innerText = itemsCount;
}

function main() {
  renderCartItemsCount();
  renderCartItems();
}

window.addEventListener("load", main);
