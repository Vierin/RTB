function countToWeekEnd() {
    const counter = document.querySelector(".js-counter");
    const currentTime = new Date();

    let weekEnd = new Date(localStorage.getItem("weekEnd"));

    if (!weekEnd || isNaN(weekEnd)) {
        weekEnd = new Date(
            currentTime.getFullYear(),
            currentTime.getMonth(),
            currentTime.getDate() + (6 - currentTime.getDay()) + 1,
            23,
            59,
            59
        );
        localStorage.setItem("weekEnd", weekEnd);
    }

    const difference = weekEnd.getTime() - currentTime.getTime();

    if (difference <= 0) {
        counter.innerHTML = "Promotion ended.";
        return;
    }

    const { days, hours, minutes, seconds } = calculateTimeUnits(difference);

    const countdownString = `<span data-text="days">${
        days < 10 ? "0" : ""
    }${days}</span> - <span data-text="hours">${
        hours < 10 ? "0" : ""
    }${hours}</span> - <span data-text="minutes">${
        minutes < 10 ? "0" : ""
    }${minutes}</span> - <span data-text="seconds">${
        seconds < 10 ? "0" : ""
    }${seconds}</span>`;

    counter.innerHTML = countdownString;

    setTimeout(countToWeekEnd, 1000);
}

function calculateTimeUnits(difference) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
}

countToWeekEnd();
