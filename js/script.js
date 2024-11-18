const pages = new Swiper('.main__container', {
    direction: 'vertical',
    slidesPerView: 1,
    spaceBetween: 0,
    mousewheel: true,
    simulateTouch: false,
    allowTouchMove: true,
    keyboard: { enabled: true },
    touchStartPreventDefault: false,
});

// -------------------------------------------------------------------------------------------------------- //

const timeBar = document.querySelector('.time-slider');

noUiSlider.create(timeBar, {
    start: 0,
    connect: [true, false],
    range: {
        'min': 0,
        'max': 10
    }
});

// -------------------------------------------------------------------------------------------------------- //

