import { fetchData } from "./fetchData.js";

class Banner {
    constructor() {
        this.bannerWrap = document.querySelector(".js-banner-wrap");
        this.currentIndex = 0;
        this.intervalId = null;

        this.init();
    }

    async init() {
        const data = await fetchData();

        this.createBannerItems(data.offers.slice(0, 4));
        this.animateItems(this.currentIndex);
        this.addHoverListeners();
    }

    createBannerItems(offers) {
        offers.forEach((offer) => {
            this.bannerWrap.innerHTML += this.createBannerItemHTML(offer);
        });

        this.bannerItems = document.querySelectorAll(".banner-item");
        this.bannerItems[0].classList.add("is-active");
    }

    createBannerItemHTML(offer) {
        return `
            <div class="banner-item">
                <div class="banner-item__img">
                    <img src="${offer.imgURL}" alt="${offer.name}">
                </div>
                <p class="banner-item__price">${offer.price} ${offer.currency}</p>
            </div>
        `;
    }

    addHoverListeners() {
        this.bannerItems.forEach((item, key) => {
            item.addEventListener("mouseenter", () =>
                this.handleHover(item, key)
            );
            item.addEventListener("mouseleave", () =>
                this.animateItems(this.currentIndex)
            );
        });
    }

    animateItems(id) {
        this.intervalId = setInterval(() => {
            this.bannerItems[id].classList.remove("is-active");

            id = (id + 1) % this.bannerItems.length;

            this.bannerItems[id].classList.add("is-active");
            this.currentIndex = id;
        }, 2000);
    }

    handleHover(item, key) {
        clearInterval(this.intervalId);

        this.bannerItems[this.currentIndex].classList.remove("is-active");
        item.classList.add("is-active");
        this.currentIndex = key;
    }
}

const banner = new Banner();
