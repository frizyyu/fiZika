// import Swiper from 'swiper' // fix IDE warns

const pages = new Swiper('.main__container', {
    direction: 'vertical',
    speed: 600,
    slidesPerView: 1,
    // effect: 'flip',
    spaceBetween: 0,
    mousewheel: false,
    simulateTouch: false, // must be false always
    allowTouchMove: false,
    keyboard: false,
    touchStartPreventDefault: false,
});

// -------------------------------------------------------------------------------------------------------- //

function enablePagesChange() {
    pages.params.allowTouchMove = true;

    pages.params.mousewheel.enabled = true;
    pages.mousewheel.enable();

    pages.params.keyboard.enabled = true;
    pages.keyboard.enable();

    pages.update();
    pages.slideNext();
}

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

const genBtn = document.querySelector('.generate');
genBtn.addEventListener('click', enablePagesChange, {once: true});

// -------------------------------------------------------------------------------------------------------- //

function validateTextField(event, nonNeg) {
    const tf = event.target;

    const value = tf.value;
    const last = tf.selectionStart - 1;

    const pattern = nonNeg ? /^\d*[.,]?\d*$/ : /^-?\d*[.,]?\d*$/;

    if (!pattern.test(value)) tf.value = value.slice(0, last) + value.slice(last + 1);
}

const textInputList = document.querySelectorAll('.text-field');
const checkboxInput = document.querySelector('.checkbox');

textInputList.forEach(ti => {
    ti.addEventListener('input', event => validateTextField(event, ti.classList.contains('non-neg')));
    ti.addEventListener('paste', event => event.preventDefault());
});

// Возможно следует указать в каких значениях у нас варьируются данные
// Также подумать над цветом залоченной кнопки

// -------------------------------------------------------------------------------------------------------- //
