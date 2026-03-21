import { PRODUCTS_DATA } from "./dummy-data.js";
import { loadLucideIcons } from "./nf-loader.js";
import { getCartItems, setCartItems, renderCartItemsCount } from "./cart.js";

const CATEGORIES = ["all", "unisex", "men", "women", "accessories"];

function isInCart(pid) {
  const cartItems = getCartItems();

  const inCart = cartItems.filter((item) => item.id === pid);

  return Boolean(inCart.length);
}

function filterProducts(query = "") {
  const rawProducts = PRODUCTS_DATA;

  const activeCategory = document
    .querySelector(".product-category.active")
    .getAttribute("data-category");

  let filteredProducts = rawProducts.filter((prd) =>
    prd.title.toLowerCase().includes(query.toLowerCase()),
  );

  if (activeCategory !== "all") {
    filteredProducts = filteredProducts?.filter(
      (prd) => prd.category === activeCategory,
    );
  }

  filteredProducts?.map((prod) => {
    if (isInCart(prod.id)) {
      prod.inCart = true;
    } else {
      prod.inCart = false;
    }

    return prod;
  });

  return filteredProducts;
}

function renderProductCategories() {
  const targetElement = document.getElementById("product_categories");

  CATEGORIES.forEach((category, index) => {
    const catElement = document.createElement("button");
    catElement.innerText = category;

    catElement.classList.add("product-category");
    if (index === 0) catElement.classList.add("active");

    catElement.setAttribute("data-category", category);

    catElement.addEventListener("click", event_categoryBtn);

    targetElement.appendChild(catElement);
  });
}

function renderProductsList() {
  const targetElement = document.getElementById("products_list");
  targetElement.innerHTML = "";

  const searchQuery = document.getElementById("search_input").value;

  const filteredProducts = filterProducts(searchQuery);

  filteredProducts.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add(
      "product-card",
      "flex",
      "flex-column",
      "gap-16",
    );

    productElement.innerHTML = `
        <div class="product-thumbnail bg-gray50 rd-16">
            <img src="" alt="product thumbnail" />

            <span class="product-cat p12 regular color-secondary bg-secondary-faded rd-4">
                ${product.category}
            </span>
        </div>

        <div class="desc-container flex flex-column gap-2">
            <p class="p16 medium color-secondary">${product.title}</p>
            <p class="product-desc p14 regular color-gray100">${product.desc}</p>
        </div>

        <div class="flex gap-16 align-center space-between">
            <p class="p14 medium color-gray200">₦ ${product.price}</p>

            <div class="flex align-center gap-4">
            <i
                data-lucide="star"
                class="lucide-icon"
                width="24"
                height="24"
                stroke-width="1.3px"
                color="var(--color-primary)"
                fill="var(--color-primary)"
            ></i>

            <p class="p14 medium color-gray200">
                ${product.rating}
                <span class="p12 regular color-gray100">(${product.review_count} Reviews)</span>
            </p>
            </div>
        </div>

        <button data-pid="${product.id}" class="add-to-cart-btn flex flex-center gap-8 rd-8" onclick="event_addToCartBtn(event)" ${
          product.inCart ? "disabled" : ""
        }>
            <i
            data-lucide="shopping-cart"
            class="lucide-icon"
            width="24"
            height="24"
            stroke-width="1.3px"
            color="var(--color-secondary)"
            ></i>

            ${product.inCart ? "Product in cart" : "Add to cart"}
        </button>
    `;

    //TODO: this event listener shouldnt be here
    //productElement.addEventListener("click", event_addToCartBtn);

    targetElement.appendChild(productElement);
    loadLucideIcons();
  });
}

//-- EVENT LISTENERS

function event_categoryBtn(elem) {
  const categoryBtns = document.querySelectorAll(".product-category");

  categoryBtns.forEach((btn) => {
    btn.classList.remove("active");
  });

  elem.target.classList.add("active");

  const activeCategory = elem.target.getAttribute("data-category");
  renderProductsList(activeCategory);
}

function event_addToCartBtn(elem) {
  const pid = elem.target.getAttribute("data-pid");

  const cartItems = getCartItems();

  if (isInCart()) return;

  cartItems.push({ id: pid, qty: 1 });
  setCartItems(cartItems);

  elem.target.setAttribute("disabled", true);
  elem.target.innerText = "Product in cart";

  //--update cart count
  renderCartItemsCount();
}

function event_searchProductInput(elem) {
  const searchQuery = document.getElementById("search_input").value;
  if (elem.target.tagName === "INPUT" && searchQuery.length) return;

  const searchResultP = document.getElementById("search_result_p");
  const searchResultSpan = document.getElementById("search_result_span");

  if (searchQuery.length) {
    searchResultP.style.display = "block";
    searchResultSpan.innerText = searchQuery;
  } else {
    searchResultP.style.display = "none";
    searchResultSpan.innerText = "";
  }

  renderProductsList();
}

function main() {
  renderProductCategories();
  renderProductsList();
}

window.event_addToCartBtn = event_addToCartBtn;
window.event_searchProductInput = event_searchProductInput;
window.addEventListener("load", main);
