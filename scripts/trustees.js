import { TRUSTEES_DATA } from "./dummy-data.js";
import { loadLucideIcons } from "./nf-loader.js";

function renderTrusteesList() {
  const targetElement = document.getElementById("trustees_list");
  targetElement.innerHTML = "";

  //--
  TRUSTEES_DATA.forEach((trustee) => {
    const trusteeElement = document.createElement("div");
    trusteeElement.classList.add(
      "trustee-card",
      "flex",
      "flex-column",
      "gap-24",
      "rd-16",
    );

    trusteeElement.innerHTML = `
        <div class="flex flex-column gap-4">
            <div class="flex flex-column gap-2">
                <h3 class="semibold color-secondary">
                    ${trustee.fullname?.split(" ")[0]} 
                </h3>
                <p class="p16 regular color-secondary">${trustee.fullname?.split(" ").pop()}</p>
            </div>
            <p class="p12 medium color-primary">${trustee.uid}</p>
            </div>

            <div class="trc-frame flex flex-column">
            <div class="trc-photo flex">
                <img src="${trustee.photo_url}" alt="Trustee photo" />
            </div>

            <div class="trc-socials flex align-center bg-secondary rd-8">
                <div class="flex flex-center">
                <li
                    data-lucide="twitter"
                    class="lucide-icon"
                    color="var(--color-white)"
                    fill="var(--color-white)"
                ></li>
                </div>

                <div class="flex flex-center">
                <li
                    data-lucide="facebook"
                    class="lucide-icon"
                    color="var(--color-secondary)"
                    fill="var(--color-secondary)"
                ></li>
                </div>

                <div class="flex flex-center">
                <li
                    data-lucide="linkedin"
                    class="lucide-icon"
                    color="var(--color-white)"
                    fill="var(--color-white)"
                ></li>
                </div>
            </div>
        </div>
    `;

    targetElement.appendChild(trusteeElement);
  });

  loadLucideIcons();
}

//--

function main() {
  renderTrusteesList();
}

window.addEventListener("load", main);
