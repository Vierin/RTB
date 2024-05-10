import gsap from "gsap";

import { fetchData } from "./fetchData.js";

class Banner {
    constructor() {
        this.banner = document.querySelector(".js-banner");
        this.sliderWrapper = this.banner.querySelector(".js-slider-wrap");
        this.curtain = this.banner.querySelector(".js-curtain");
        this.logo = this.banner.querySelector(".js-logo");
        this.navigationWrapper = this.banner.querySelector(".js-navigation");
        this.btn = this.banner.querySelector(".js-btn");

        this.currentId = 0;

        this.bind();
    }

    async bind() {
        const data = await fetchData();

        data.offers.forEach((item) => {
            const bannerItem = `
                <div class="slider-item js-slide">
                    <div class="slider-item__background js-slide-bg">
                        <img class="js-slide-img" src="${item.imgURL}" alt="${
                item.city
            }">
                    </div>
                    <div class="slider-item__description">
                        <p class="slider-item__country js-slide-text"><span>${
                            item.country
                        }</span></p>
                        <h5 class="slider-item__city ${
                            item.city.length > 12 && " slider-item__city--long"
                        } js-slide-text"><span>${item.city}</span></h5>
                        <div class="slider-item__price">
                            <div class="js-slide-price">
                                <span>${item.priceText}</span>
                                <p>${item.price} ${item.currency}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            this.sliderWrapper.insertAdjacentHTML("beforeend", bannerItem);
        });

        this.slides = this.banner.querySelectorAll(".js-slide");
        this.setNavigation(data.offers.length);
        this.animateCurtain();
    }

    setNavigation(count) {
        for (let i = 0; i < count; i++) {
            this.navigationWrapper.insertAdjacentHTML(
                "beforeend",
                `<li class='js-nav-item ${i === 0 ? "is-active" : ""}'></li>`
            );
        }
    }

    animateCurtain() {
        const duration = 0.45;
        gsap.timeline({ ease: "power1.inOut" })
            .to(this.curtain, { duration, yPercent: -50, delay: 0.6 })
            .fromTo(
                this.logo,
                { x: -200, y: 332 },
                { duration: 0.3, x: 0, y: 332 },
                "-=30%"
            )
            .to(this.logo, {
                duration: 0.4,
                y: 0,
                onComplete: () => {
                    this.animateSlidesIn(this.currentId);
                },
            })
            .to(this.curtain, { duration, yPercent: -100 })
            .from(this.navigationWrapper, { y: 100, duration: 0.3 }, "-=60%");
    }

    animateSlidesIn(id) {
        const timeIn = 12;
        const slide = this.slides[id];
        const textBg = slide.querySelectorAll(".js-slide-text");
        const text = slide.querySelectorAll(".js-slide-text span");
        const price = slide.querySelector(".js-slide-price");
        const img = slide.querySelector(".js-slide-img");
        const bg = slide.querySelector(".js-slide-bg");

        const navDots = this.banner.querySelectorAll(".js-nav-item");
        navDots.forEach((dot) => {
            dot.classList.toggle("is-active", dot === navDots[id]);
        });

        slide.classList.add("is-active");
        this.currentId++;

        const tlIn = gsap
            .timeline({ ease: "linear", delay: 0.3, duration: 0.35 })
            .to(textBg, { clipPath: "inset(0 0% 0 0)", stagger: 0.25 })
            .to(text, { y: 0, stagger: 0.25 }, "-=60%")
            .to(price, { yPercent: -100 }, "-=115%");

        if (id === 0) {
            gsap.to(img, { scale: 1.2, duration: timeIn });

            tlIn.to(
                this.btn.querySelector(".js-btn-wrap"),
                { x: 0, duration: 0.3 },
                0.4
            ).to(
                this.btn.querySelector(".js-btn-line"),
                { scaleX: 1, duration: 0.2 },
                0.6
            );
        } else {
            gsap.timeline()
                .from(bg, { xPercent: 100, duration: 0.4, ease: "linear" })
                .to(img, { scale: 1.2, duration: timeIn - 2 });
        }

        this.animationSlideHide(slide, text, textBg, price, timeIn);
    }

    animationSlideHide(slide, text, textBg, price, timeIn) {
        gsap.timeline({ delay: timeIn - 3.5 })
            .to(text, {
                yPercent: -100,
                duration: 0.25,
                stagger: 0.25,
                onComplete: () => {
                    this.currentId >= this.slides.length &&
                        this.animateSliderOut();
                },
            })
            .to(textBg, {
                clipPath: "inset(0 100% 0 0)",
                duration: 0.35,
                stagger: 0.25,
            })
            .to(
                price,
                {
                    yPercent: -200,
                    duration: 0.25,
                    onComplete: () => {
                        slide.classList.remove("is-active");

                        if (this.currentId < this.slides.length) {
                            this.animateSlidesIn(this.currentId);
                        }
                    },
                },
                "-=115%"
            );
    }

    animateSliderOut() {
        gsap.to(this.banner, { opacity: 0, duration: 0.7 });
    }
}

const banner = new Banner();
