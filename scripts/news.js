import { loadLucideIcons } from "./nf-loader.js";
import { EVENTS_DATA, NEWS_DATA } from "./dummy-data.js";

function renderEventsList() {
  const targetElement = document.getElementById("past_event_list");
  targetElement.innerHTML = "";

  EVENTS_DATA.forEach((event) => {
    const eventCard = document.createElement("div");
    eventCard.classList.add("event-card", "flex", "flex-column", "gap-16");

    eventCard.innerHTML = `
        <!--thumbnails-->
        <div class="ec-thumbnail flex gap-8">
            <div class="ec-thumbnail-main bg-gray50 rd-8">
                <img src="${event.photo_urls[0]}" alt="Event Thumbnail" />
            </div>

            <div class="ec-thumbnail-split flex flex-column gap-8">
                <div class="bg-gray50 rd-8">
                <img src="${event.photo_urls[1]}" alt="Event Thumbnail" />
                </div>
                <div class="bg-gray50 rd-8">
                <img src="${event.photo_urls[2]}" alt="Event Thumbnail" />
                </div>
            </div>
        </div>

        <!--details-->
        <div class="flex flex-column gap-8">
            <h4 class="medium color-primary">${event.title}</h4>

            <div class="ec-details flex align-center space-between gap-16">
                <div class="flex flex-column gap-4">
                <p class="p14 medium color-black">Date</p>
                <p class="p12 regular color-gray200">${event.date}</p>
                </div>

                <div class="flex flex-column gap-4">
                <p class="p14 medium color-black">Location</p>
                <p class="p12 regular color-gray200">${event.location}</p>
                </div>
            </div>
        </div>
    `;

    targetElement.appendChild(eventCard);
  });

  loadLucideIcons();
}

function renderNewsList() {
  const targetElement = document.getElementById("news_list");
  targetElement.innerHTML = "";

  let newsData = NEWS_DATA;

  if(targetElement.classList.contains("few-list")) {
     newsData = NEWS_DATA.slice(0, 2)
  }


  newsData.forEach((news) => {
    const newsCard = document.createElement("div");
    newsCard.classList.add("news-card", "rd-16");

    newsCard.innerHTML = `
        <div class="news-thumbnail bg-gray50">
            <img src="${news.photo_url}" alt="News thumbnail" />
        </div>

        <div class="overlay flex flex-column gap-8">
            <p class="p12 regular color-white">${String(news.category).toUpperCase()} NEWS</p>
            <h4 class="medium color-white">
                ${news.title}
            </h4>
        </div>
    `;

    targetElement.appendChild(newsCard);
  });

  loadLucideIcons();
}

function main() {
  renderEventsList();
  renderNewsList();
}
window.addEventListener("load", main);
