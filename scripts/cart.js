import { PRODUCTS_DATA } from "./dummy-data.js";
import { formatNumber } from "./parser.js";
import { loadLucideIcons } from "./nf-loader.js";

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

const getProductById = (pid) => {
  return PRODUCTS_DATA.find((prd) => prd.id === pid);
};

function generateOrderSummary() {
  let cartItems = getCartItems();
  let cartItemsCount = countCartItems();

  let subtotal = 0;

  cartItems.forEach((item) => {
    const { id, qty } = item;
    const product = getProductById(id);

    if (!product) return;

    subtotal += product.price * qty;
  });

  let delivery_fee = Number(cartItemsCount * 950);
  let tax = Number((subtotal * 0.00125).toFixed(2));

  let total = Number(subtotal + delivery_fee + tax).toFixed(2);

  return {
    subtotal,
    delivery_fee,
    tax,
    total,
  };
}

//------------------

function renderCartItems() {
  let cartItemsDiv = document.getElementById("cart_items");

  if (!cartItemsDiv) return;

  cartItemsDiv.innerHTML = "";

  const itemsCount = countCartItems();

  if (itemsCount < 1) {
    let noItemDiv = document.createElement("div");
    noItemDiv.classList.add(
      "no-item-found",
      "flex",
      "flex-column",
      "flex-center",
      "gap-24",
    );

    noItemDiv.innerHTML = `
      <i
        data-lucide="circle-slash-2"
        class="lucide-icon"
        width="64px"
        height="64px"
        stroke-width="1.3px"
        color="var(--color-gray100)"
      ></i>

      <div class="flex flex-column flex-center gap-8">
        <h4 class="medium color-gray200">NO ITEM IN CART</h4>
        <p class="p14 regular color-gray200">
          You have not added any wear or accessories to your cart yet.
          Click the button below to add some.
        </p>
        <a href="./products.html">
          <button class="bg-primary-faded color-primary p14 medium">
            Explore Collections
          </button>
        </a>
      </div>
    `;

    cartItemsDiv.append(noItemDiv);
    loadLucideIcons();

    return;
  }

  let cartItems = getCartItems();

  cartItems.forEach((item) => {
    const { id, qty } = item;

    const product = getProductById(id);

    if (!product) return;

    let cItemDiv = document.createElement("div");
    cItemDiv.classList.add("cart-item", "flex", "align-center", "gap-16");

    cItemDiv.innerHTML = `
      <div class="cart-thumbnail bg-gray50 rd-8">
        <img src="${product.photo_urls[0]}" alt="product thumbnail" />
      </div>

      <div class="cart-details flex flex-column gap-16 space-between">
        <div class="flex space-between gap-16">
          <div class="cart-info flex flex-column gap-2">
            <p class="p16 medium color-secondary">${product.title}</p>
            <p class="p14 regular color-gray100">${product.category}</p>
          </div>

          <button data-pid="${id}" class="cart-delete-btn flex flex-center" onclick="event_cartDeleteBtn(event)">
            <i
              data-lucide="trash-2"
              class="lucide-icon"
              color="var(--color-primary)"
            ></i>
          </button>
        </div>

        <div class="flex align-center space-between">
          <div class="flex align-center gap-8">
            <button
              data-pid="${id}"
              data-type="minus"
              class="cart-pm-btn flex flex-center rd-8"
              onclick="event_cartPmBtn(event)"
              ${qty === 1 ? "disabled" : ""}
            >
              <i
                data-lucide="minus"
                class="lucide-icon"
                color="var(--color-gray200)"
              ></i>
            </button>

            <p id="${id}" class="cart-item-qty p16 regular color-gray200">
              ${formatNumber(qty)}
            </p>

            <button
              data-pid="${id}"
              data-type="plus"
              class="cart-pm-btn flex flex-center rd-8"
              onclick="event_cartPmBtn(event)"
              ${qty === 20 ? "disabled" : ""}
            >
              <i
                data-lucide="plus"
                class="lucide-icon"
                color="var(--color-gray200)"
              ></i>
            </button>
          </div>

          <p class="p16 medium black">₦ ${formatNumber(product.price)}</p>
        </div>
      </div>
    `;

    cartItemsDiv.append(cItemDiv);
  });

  loadLucideIcons();
}

export function renderCartItemsCount() {
  let cartItemsCountDiv = document.querySelectorAll("span#cart_items_count");

  if (!cartItemsCountDiv || cartItemsCountDiv.length === 0) return;

  const itemsCount = countCartItems();

  cartItemsCountDiv.forEach((span) => {
    span.innerText = formatNumber(itemsCount);

    if (itemsCount === 0) {
      span.classList.remove("show");
    } else {
      span.classList.add("show");
    }
  });
}

function renderOrderSummary() {
  let orderSubTotal = document.getElementById("order_subtotal");
  let orderDeliveryFee = document.getElementById("order_delivery_fee");
  let orderTax = document.getElementById("order_tax");
  let orderTotal = document.getElementById("order_total");

  if (!orderSubTotal || !orderDeliveryFee || !orderTax || !orderTotal) return;

  const { subtotal, delivery_fee, tax, total } = generateOrderSummary();

  orderSubTotal.innerText = formatNumber(subtotal, 2);
  orderDeliveryFee.innerText = formatNumber(delivery_fee, 2);
  orderTax.innerText = formatNumber(tax, 2);
  orderTotal.innerText = formatNumber(total, 2);
}

//--EVENT LISTENERS

const event_cartPmBtn = (elem) => {
  const pid = elem.target.getAttribute("data-pid");
  const type = elem.target.getAttribute("data-type");

  const cartItems = getCartItems();

  cartItems.map((item) => {
    if (item.id !== pid) return;

    if (type === "plus") {
      item.qty += 1;
    } else if (type === "minus") {
      if (item.qty === 1) return;

      item.qty -= 1;
    }

    return item;
  });

  // const newCartItems = cartItems.filter((item) => item.id !== pid);
  // newCartItems.push(item);

  setCartItems(cartItems);

  renderCartItems();
  renderOrderSummary();
};

const event_cartDeleteBtn = (elem) => {
  const pid = elem.target.getAttribute("data-pid");

  const cartItems = getCartItems();

  const newCartItems = cartItems.filter((item) => item.id !== pid);

  setCartItems(newCartItems);

  renderCartItems();
  renderOrderSummary();
  renderCartItemsCount();
};

function main() {
  renderCartItems();
  renderOrderSummary();
}

window.event_cartPmBtn = event_cartPmBtn;
window.event_cartDeleteBtn = event_cartDeleteBtn;
window.addEventListener("load", main);
