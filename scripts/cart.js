const CART_ITEMS_KEY = "cdm_cartItems";

//localStorage.removeItem(CART_ITEMS_KEY);

export const getCartItems = () => {
  let storedCartItems = localStorage.getItem(CART_ITEMS_KEY);
  return storedCartItems ? JSON.parse(storedCartItems) : [];
};

export const setCartItems = (cartItems = []) => {
  localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));
};

export const countCartItems = () => {
  let cartItems = getCartItems();

  return Number(cartItems.length);
};

function renderCartItems() {
  let cartItemsDiv = document.getElementById("cart_items");
  if (!cartItemsDiv) return;

  const itemsCount = countCartItems();
}

export function renderCartItemsCount() {
  let cartItemsCountDiv = document.querySelectorAll("span#cart_items_count");

  if (!cartItemsCountDiv || cartItemsCountDiv.length === 0) return;

  const itemsCount = countCartItems();

  cartItemsCountDiv.forEach((span) => {
    if (itemsCount === 0) {
      span.innerText = "";
      span.classList.remove("show");
    } else {
      span.innerText = itemsCount;
      span.classList.add("show");
    }
  });
}

function main() {
  renderCartItems();
}

window.addEventListener("load", main);
