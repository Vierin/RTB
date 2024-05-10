import gsap from "gsap";

import { fetchData } from "./fetchData";

class Banner {
    constructor() {
        this.bannerSlider = document.querySelector(".js-banner-slider");
        this.intervalId = null;
        this.swipeTime = 1.2;
        this.time = 1.3;
        this.id = 0;

        this.init();
    }

    async init() {
        const data = await fetchData();

        this.createSliderItems(data.offers.slice(0, 3));
        this.sliderAnimation();
        this.addHoverListeners();
    }

    addHoverListeners() {
        const buttons = this.bannerSlider.querySelectorAll(".js-slide-btn");
        buttons.forEach((button) => {
            button.addEventListener("mouseenter", () => {
                this.tl.pause();
            });
            button.addEventListener("mouseleave", () => {
                this.tl.play();
            });
        });
    }

    createSliderItemHTML(offer) {
        return `
            <div class="banner-slide js-slide">
                <div class="banner-slide__img">
                    <img src="${offer.imgURL}" alt="${offer.name}">
                </div>
                <p class="banner-slide__title">${offer.name}</p>
                <p class="banner-slide__price">${offer.price} ${offer.currency}</p>
                <a class="banner-slide__button js-slide-btn" href="/" target="_blank"><span>Check</span></a>
            </div>
        `;
    }

    createSliderItems(offers) {
        offers.forEach((offer) => {
            this.bannerSlider.innerHTML += this.createSliderItemHTML(offer);
        });

        this.addCloneForInfiniteScroll();
        this.bannerItems = document.querySelectorAll(".js-slide");
    }

    addCloneForInfiniteScroll() {
        const firstSlide = this.bannerSlider.firstElementChild.cloneNode(true);
        this.bannerSlider.appendChild(firstSlide);
    }

    sliderAnimation() {
        let scrollWidth = this.bannerItems[0].getBoundingClientRect().width;

        this.tl = gsap
            .timeline({ repeatRefresh: true, repeat: -1 })
            .to(this.bannerSlider, {
                x: `-=${scrollWidth}`,
                ease: "power4.inOut",
                duration: this.swipeTime,
                delay: this.time,
                onComplete: () => this.handleComplete(),
            });
    }

    handleComplete() {
        this.id++;
        this.scrollWidth += this.width;
        if (this.id >= this.bannerItems.length - 1) {
            this.id = 0;
            setTimeout(() => {
                this.scrollWidth = this.width;
                this.tl.restart();
                gsap.set(this.bannerSlider, { x: 0 });
            }, 900);
        }
    }
}

const banner = new Banner();
