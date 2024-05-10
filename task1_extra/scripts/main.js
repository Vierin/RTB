import { fetchData } from "./fetchData.js";

class Banner {
    constructor() {
        this.time = 2;

        this.bannerWrap = document.querySelector(".js-banner-wrap");
        this.elementIndex = 0;
        this.intervalId = null;
        this.cols = 2;
        this.count = 1;
        this.order = [];

        this.init();
    }

    async init() {
        const data = await fetchData();

        this.createBannerItems(data.offers);
        this.createOrder();
        this.animateItems();
        this.addHoverListeners();
    }

    createOrder() {
        const half = this.bannerItems.length / 2;
        for (let i = 0; i < half; i++) {
            this.order.push(i, i + half);
        }
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
            item.addEventListener("mouseleave", () => this.animateItems());
        });
    }

    animateItems() {
        this.intervalId = setInterval(() => {
            if (this.count >= this.bannerItems.length) {
                this.count = 1;
                this.slideBannerX(false);
            } else {
                this.count++;
            }

            this.count > 2 && this.slideBannerX(true);

            this.bannerItems[this.elementIndex].classList.remove("is-active");

            const nextIndex = this.order.indexOf(this.elementIndex) + 1;
            this.elementIndex =
                this.order[
                    nextIndex >= this.bannerItems.length ? 0 : nextIndex
                ];

            this.bannerItems[this.elementIndex].classList.add("is-active");
        }, this.time * 1000);
    }

    slideBannerX(moveRight) {
        const x = this.bannerItems[0].getBoundingClientRect().width + 2;
        this.bannerWrap.style.transform = `translateX(${moveRight ? -x : 0}px)`;
    }

    handleHover(item, key) {
        clearInterval(this.intervalId);

        this.bannerItems[this.elementIndex].classList.remove("is-active");
        item.classList.add("is-active");
        this.elementIndex = key;

        this.count = this.order.indexOf(key) + 1;
    }
}

const banner = new Banner();
