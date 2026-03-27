import { TESTIMONIALS_DATA } from "./dummy-data.js";
import { loadLucideIcons } from "./nf-loader.js";

let index = 0;
let interval;
let isMobile = window.innerWidth < 768;

const visibleCards = isMobile ? 1 : 3;

function renderTestimonialList() {
  const targetElement = document.getElementById("testimonial_list");
  targetElement.innerHTML = "";

  //--
  TESTIMONIALS_DATA.forEach((testimony, index) => {
    const testimonialElement = document.createElement("div");
    testimonialElement.classList.add(
      "testimonial-card",
      "flex",
      "flex-column",
      "gap-32",
      "bg-white",
      "rd-16",
    );
    if (index === 0) testimonialElement.classList.add("active");

    testimonialElement.innerHTML = `
        <div class="flex align-center space-between gap-24">
            <div class="tc-user flex align-center gap-8">
                <div class="tc-avatar bg-gray50">
                    <img src="" alt="User avatar" />
                </div>

                <div class="flex flex-column gap-2">
                    <p class="p16 medium color-black">${testimony.fullname}</p>

                    <p class="p14 regular color-gray200">${testimony.username}</p>
                </div>
            </div>

            <div class="tc-quote flex flex-center">
                <i
                    data-lucide="quote"
                    class="lucide-icon"
                    color="var(--color-gray100)"
                    fill="var(--color-gray100)"
                ></i>
            </div>
        </div>

        <div class="flex flex-column gap-8">
            <p class="p16 medium color-black">${testimony.testimony}</p>

            <div class="flex align-center gap-4">
            <i
                data-lucide="star"
                class="lucide-icon"
                color="var(--color-primary)"
            ></i>
            </div>
        </div>
    `;

    targetElement.appendChild(testimonialElement);
    loadLucideIcons();
  });

  //--clone first few cards for loop effect
  TESTIMONIALS_DATA.slice(0, visibleCards).forEach((testimony) => {
    const testimonialElement = document.createElement("div");
    testimonialElement.classList.add(
      "testimonial-card",
      "flex",
      "flex-column",
      "gap-32",
      "bg-white",
      "rd-16",
    );

    testimonialElement.innerHTML = `
        <div class="flex align-center space-between gap-24">
            <div class="tc-user flex align-center gap-8">
            <div class="tc-avatar bg-gray50">
                <img src="" alt="User avatar" />
            </div>

            <div class="flex flex-column gap-2">
                <p class="p16 medium color-black">${testimony.fullname}</p>

                <p class="p14 regular color-gray200">${testimony.username}</p>
            </div>
            </div>

            <div class="tc-quote flex flex-center">
            <i
                data-lucide="quote"
                class="lucide-icon"
                color="var(--color-gray100)"
                fill="var(--color-gray100)"
            ></i>
            </div>
        </div>

        <div class="flex flex-column gap-8">
            <h4 class="medium color-secondary">${testimony.testimony}</h4>

            <div class="flex align-center gap-4">
            <i
                data-lucide="star"
                class="lucide-icon"
                color="var(--color-primary)"
            ></i>
            </div>
        </div>
    `;

    targetElement.appendChild(testimonialElement);
    loadLucideIcons();
  });

  targetElement.addEventListener("mouseenter", stopAutoSlider);
  targetElement.addEventListener("mouseleave", startAutoSlider);
}

function renderIndicators() {
  const indicatorElement = document.getElementById("testimonial_indicator");
  indicatorElement.innerHTML = "";

  TESTIMONIALS_DATA.forEach((_, index) => {
    const span = document.createElement("span");

    if (index === 0) span.classList.add("active");
    indicatorElement.appendChild(span);
  });
}

function updateIndicators() {
  const indicators = document.querySelectorAll("#testimonial_indicator > span");
  indicators.forEach((indicator) => indicator.classList.remove("active"));

  indicators[index % TESTIMONIALS_DATA.length].classList.add("active");
}

function updateActiveTestimonial() {
  const testimonials = document.querySelectorAll(".testimonial-card");
  testimonials.forEach((indicator) => indicator.classList.remove("active"));

  testimonials[index % TESTIMONIALS_DATA.length].classList.add("active");
}

function centerCard(index) {
  const container = document.querySelector(".testimonials-container");
  const cards = document.querySelectorAll(".testimonial-card");
  const testimonialListSlider = document.getElementById("testimonial_list");

  function getCenterOffset(card) {
    const containerWidth = container.offsetWidth;
    const cardWidth = card.offsetWidth;

    return containerWidth / 2 - cardWidth / 2;
  }

  const card = cards[index];

  const cardLeft = card.offsetLeft; // position inside slider
  const centerOffset = getCenterOffset(card);

  const translateX = cardLeft - centerOffset;

  testimonialListSlider.style.transform = `translateX(-${translateX}px)`;
}

function triggerTestimonialSlider() {
  index++;

  const testimonialList = document.getElementById("testimonial_list");

  testimonialList.style.transition = "transform 0.5s ease";
  centerCard(index);

  updateIndicators();
  updateActiveTestimonial();

  //--reset when reaching cloned items
  if (index === TESTIMONIALS_DATA.length) {
    setTimeout(() => {
      testimonialList.style.transition = "none";
      testimonialList.style.transform = `translateX(0px)`;
      index = 0;
    }, 500);
  }
}

function startAutoSlider() {
  interval = setInterval(triggerTestimonialSlider, 3000);
}

function stopAutoSlider() {
  clearInterval(interval);
}

//--

function main() {
  renderIndicators();
  renderTestimonialList();
  startAutoSlider();
}

window.addEventListener("load", main);
