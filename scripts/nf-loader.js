import { parseStringToHTML } from "./parser.js";

//--LOADERS

async function loadNav() {
  await fetch("components/nav.html")
    .then((response) => response.text())
    .then((data) => {
      const navElement = parseStringToHTML(data, "nav");

      if (!navElement) return;
      document.getElementsByTagName("main")[0].before(navElement);
    })
    .catch((error) => console.error("Error loading nav:", error));
}

async function loadFooter() {
  await fetch("components/footer.html")
    .then((response) => response.text())
    .then((data) => {
      const footerElement = parseStringToHTML(data, "footer");

      if (!footerElement) return;
      document.getElementsByTagName("main")[0].after(footerElement);
    })
    .catch((error) => console.error("Error loading footer:", error));
}

function showActiveNavLink() {
  const path = window.location.pathname;
  const file = String(path).split("/").pop();
  const activePage = String(file.replace(".html", "")).toLowerCase();

  const allowedPages = ["", "index", "products", "news", "about"];

  if (!allowedPages.includes(activePage)) return;

  const navLinks = document.querySelectorAll("ul.nav-links li");

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.id === activePage) link.classList.add("active");
    if (link.id === "" && activePage === "index") link.classList.add("active");
  });
}

function loadLucideIcons() {
  lucide.createIcons();
}

function addEventListeners() {
  event_mobileNavMenuBtn();
}

async function loadAllContents() {
  await Promise.all([loadNav(), loadFooter()])
    .then(() => {
      console.log("All contents loaded successfully.");
      showActiveNavLink();
      loadLucideIcons();

      //--
      addEventListeners();
    })
    .catch((error) => {
      console.error("Error loading contents:", error);
    });
}

loadAllContents();

//--END OF LOADERS

//--EVENT LISTENERS

const event_mobileNavMenuBtn = () => {
  document
    .getElementById("mobile-nav-menu-btn")
    .addEventListener("click", function () {
      let isToggled = this.classList.contains("toggled");

      let menuIcon = document.createElement("i");
      menuIcon.classList.add("lucide-icon");
      menuIcon.setAttribute("width", "24px");
      menuIcon.setAttribute("height", "24px");
      menuIcon.setAttribute("stroke-width", "1.3px");
      menuIcon.setAttribute("color", "var(--color-secondary)");

      menuIcon.setAttribute("data-lucide", isToggled ? "menu" : "x");

      this.innerHTML = "";
      this.appendChild(menuIcon);

      let mobileNavMenu = document.getElementById("mobile-nav-menu");

      if (isToggled) {
        this.classList.remove("toggled");
        mobileNavMenu.classList.remove("show");
      } else {
        this.classList.add("toggled");
        mobileNavMenu.classList.add("show");
      }

      loadLucideIcons();
    });
};
