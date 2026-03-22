import { PRODUCTS_DATA } from "./dummy-data.js";
import { formatNumber } from "./parser.js";
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

  if (!filteredProducts.length) {
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
        <h4 class="medium color-gray200">NO PRODUCT FOUND</h4>
        <p class="p14 regular color-gray200">
          Unfortunately, we could not find what you are looking for. Continue exploring our available collections.
        </p>
      </div>
    `;

    targetElement.appendChild(noItemDiv);
    loadLucideIcons();

    return;
  }

  filteredProducts.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add(
      "product-card",
      "flex",
      "flex-column",
      "gap-16",
    );

    productElement.innerHTML = `
        <div class="product-thumbnail bg-gray50 rd-16" onclick="event_openProductModal(event)" data-pid="${product.id}">
            <img src="${product.photo_urls[0]}" alt="product thumbnail" />

            <span class="product-cat p12 regular color-white rd-4">
                ${product.category}
            </span>
        </div>

        <div class="desc-container flex flex-column gap-2">
            <p class="p16 medium color-secondary" onclick="event_openProductModal(event)" data-pid="${product.id}">${product.title}</p>
            <p class="product-desc p14 regular color-gray100">${product.desc}</p>
        </div>

        <div class="flex gap-16 align-center space-between">
            <p class="p14 medium color-gray200">₦ ${formatNumber(product.price)}</p>

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

    targetElement.appendChild(productElement);
    loadLucideIcons();
  });
}

function renderActiveProductThumbnail(uri = "") {
  const pdmPhotoActive = document.querySelector("#pdm_photo_active > img");

  if (!pdmPhotoActive) return;

  pdmPhotoActive.src = uri;
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

function event_closeProductModal() {
  const productModal = document.getElementById("product_details_modal");
  const pdmContainer = document.getElementById("pdm_container");

  pdmContainer.innerHTML = "";
  productModal.style.display = "none";
}

function event_openProductModal(elem) {
  const pid = elem.target.getAttribute("data-pid");

  const product = PRODUCTS_DATA.find((prd) => prd.id === pid);

  if (!product) return;

  const productModal = document.getElementById("product_details_modal");
  const pdmContainer = document.getElementById("pdm_container");

  pdmContainer.innerHTML = "";

  pdmContainer.innerHTML = `
    <div class="flex flex-column gap-8">
      <div
        id="pdm_photo_active"
        class="pdm-photo-active rd-8 bg-gray50"
      >
        <img src="${product.photo_urls[0]}" alt="product thumbnail" />
      </div>

      <div
        id="pdm_photo_list"
        class="pdm-photo-list flex align-center gap-8"
      >
        <!--PHOTO LIST-->
        ${product.photo_urls
          ?.map(
            (
              uri,
              index,
            ) => `<div class="pdm-tiny-photo rd-8 bg-gray50 ${index === 0 ? "active" : ""}" onclick="event_selectActivePhoto(event)">
            <img src="${uri}" alt="product thumbnail" />
          </div>`,
          )
          .join("")}
      </div>
    </div>

    <div class="flex flex-column gap-16">
      <h4 class="semibold color-black">${product.title}</h4>

      <div class="flex gap-16 align-center space-between">
        <p class="p16 medium color-gray200">₦ ${formatNumber(product.price)}</p>

        <div class="flex align-center gap-4">
          <i
            data-lucide="star"
            class="lucide-icon"
            color="var(--color-primary)"
            fill="var(--color-primary)"
          ></i>

          <p class="p16 medium color-gray200">
            ${product.rating}
            <span class="p14 regular color-gray100">(${product.review_count} Reviews)</span>
          </p>
        </div>
      </div>

      <p class="product-desc p14 regular color-gray200">${product.desc}</p>
    </div>
  `;

  productModal.style.display = "flex";
  loadLucideIcons();
}

function event_selectActivePhoto(elem) {
  const pdmTinyPhotos = document.querySelectorAll(".pdm-tiny-photo");

  pdmTinyPhotos.forEach((photo) => {
    photo.classList.remove("active");
  });

  elem.target.classList.add("active");

  const uri = elem.target.querySelector("img").src;
  renderActiveProductThumbnail(uri);
}

function main() {
  renderProductCategories();
  renderProductsList();
}

window.event_addToCartBtn = event_addToCartBtn;
window.event_searchProductInput = event_searchProductInput;
window.event_closeProductModal = event_closeProductModal;
window.event_openProductModal = event_openProductModal;
window.event_selectActivePhoto = event_selectActivePhoto;
window.addEventListener("load", main);
