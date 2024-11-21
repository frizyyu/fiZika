MAX_DECIMAL_PLACES = 2;

// -------------------------------------------------------------------------------------------------------- //

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
    step: 10 ** -MAX_DECIMAL_PLACES,
    range: {'min': 0, 'max': 0}
});

// -------------------------------------------------------------------------------------------------------- //

const genBtn = document.querySelector('.generate');
genBtn.addEventListener('click', enablePagesChange, {once: true});
genBtn.addEventListener('click', initInfoFields);

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

// -------------------------------------------------------------------------------------------------------- //

zip = (keys, vals) => keys.map((k, i) => [k, vals[i]]);
listToDict = (keys, vals) => Object.fromEntries(zip(keys, vals));

getInputFieldValue = field => parseFloat(field.value);

setInfoFieldValue = (field, val) => field.textContent = parseFloat(val).toFixed(MAX_DECIMAL_PLACES);
getInfoFieldValue = field => parseFloat(field.textContent);

const inputFieldList = [...textInputList, checkboxInput];
const infoFieldList = document.querySelectorAll('.info__value');

const inp = listToDict(['a', 'M', 'm', 'v0', 'g', 'h', 'V', 'aw'], inputFieldList);
const inf = listToDict(['X', 'Y', 'T', 't', 'v', 'vx', 'vy', 'L', 'H'], infoFieldList);

// -------------------------------------------------------------------------------------------------------- //

const {sin, cos, sqrt, PI} = Math;

rad = deg => deg * PI / 180;

// -------------------------------------------------------------------------------------------------------- //

timeInfoFieldInit = () => timeBar.noUiSlider.updateOptions({range: {min: 0, max: getInfoFieldValue(inf.T)}});

timeBar.noUiSlider.on('update', vals => regularInfoFieldsCalc(vals[0]));

// -------------------------------------------------------------------------------------------------------- //

function singleInfoFieldsCalc() {
    const a = rad(getInputFieldValue(inp.a));
    const v0 = getInputFieldValue(inp.v0);
    const g = getInputFieldValue(inp.g);

    setInfoFieldValue(inf.vx, v0 * cos(a));

    setInfoFieldValue(inf.T, 2 * v0 * sin(a) / g);

    setInfoFieldValue(inf.L, v0 ** 2 * sin(2 * a) / g);
    setInfoFieldValue(inf.H, (v0 * sin(a)) ** 2 / (2 * g));
}

function regularInfoFieldsCalc(t) {
    const a = rad(getInputFieldValue(inp.a));
    const v0 = getInputFieldValue(inp.v0);
    const h = getInputFieldValue(inp.h);
    const g = getInputFieldValue(inp.g);

    const vx = getInfoFieldValue(inf.vx);
    const vy = v0 * sin(a) - g * t;

    setInfoFieldValue(inf.t, t);

    setInfoFieldValue(inf.vy, vy);
    setInfoFieldValue(inf.v, sqrt(vx ** 2 + vy ** 2));

    setInfoFieldValue(inf.X, vx * t);
    setInfoFieldValue(inf.Y, h + v0 * sin(a) * t - g * t ** 2 / 2);
}

function initInfoFields() {
    singleInfoFieldsCalc();
    timeInfoFieldInit();
    regularInfoFieldsCalc(0);
}

// -------------------------------------------------------------------------------------------------------- //