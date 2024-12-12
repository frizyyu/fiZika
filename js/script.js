const MAX_DECIMAL_PLACES = 2;

// -------------------------------------------------------------------------------------------------------- //

const {sin, cos, tan, sqrt, max, PI} = Math;
const rad = deg => deg * PI / 180;

// -------------------------------------------------------------------------------------------------------- //

// import Swiper from 'swiper' // fix Swiper IDE warns

const pagesContainer = document.querySelector('.pages-container');

const fullPageSlider = new Swiper('.pages-container', {
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
    on: {
        slideChangeTransitionStart: function () {
            const percentYOffset = this.activeIndex / (this.slides.length - 1) * 100;
            pagesContainer.style.backgroundPosition = `center ${percentYOffset}%`;
        }
    }
});

// -------------------------------------------------------------------------------------------------------- //

let sliderChangeAllowed = false;

function allowSliderChange() {
    fullPageSlider.params.allowTouchMove = true;

    fullPageSlider.params.mousewheel.enabled = true;
    fullPageSlider.mousewheel.enable();

    fullPageSlider.params.keyboard.enabled = true;
    fullPageSlider.keyboard.enable();

    fullPageSlider.update();

    sliderChangeAllowed = true;
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

const zip = (keys, vals) => keys.map((k, i) => [k, vals[i]]);
const listToDict = (keys, vals) => Object.fromEntries(zip(keys, vals));

// -------------------------------------------------------------------------------------------------------- //

const getTIFValue = field => parseFloat(field.value);
const getCIFValue = field => field.checked;

const updateIFState = (field, invalid) => field.closest('.input__item').classList.toggle('failed', invalid);

const getLFValue = field => parseFloat(field.textContent);
const setLFValue = (field, val, round = MAX_DECIMAL_PLACES) => field.textContent = !isNaN(parseFloat(val)) ? parseFloat(val).toFixed(round) : val;

// -------------------------------------------------------------------------------------------------------- //

const TIKList = ['a', 'M', 'm', 'v0', 'g', 'h', 'r'];
const CIK = 'aw';

const IKList = [...TIKList, CIK];
const LKList = ['X', 'Y', 'T', 't', 'v', 'vx', 'vy', 'u', 'L', 'H', 'k'];
const AKList = ['p', 'L', 'H'];

const TIFList = document.querySelectorAll('.text-field');
const CIF = document.querySelector('.checkbox');

const IFList = [...TIFList, CIF];
const LFList = document.querySelectorAll('.log-field');
const AFList = document.querySelectorAll('.hint-field');

const inp = listToDict(IKList, IFList);
const log = listToDict(LKList, LFList);
const hnt = listToDict(AKList, AFList);

// -------------------------------------------------------------------------------------------------------- //

const createValidateFunction = (val, cond) => new Function(val, `return ${cond}`);

const TIFCList = Array.from(document.querySelectorAll('.constraint')).map(val => val.textContent);
const TIFVList = TIKList.map((val, i) => createValidateFunction(val, TIFCList[i]));

const TIFValidate = listToDict(TIKList, TIFVList);

// -------------------------------------------------------------------------------------------------------- //

function calcAXL() {
    singleLFCalc();

    const p = getTIFValue(inp.m) / (4 / 3 * PI * getTIFValue(inp.r) ** 3);
    const L = getLFValue(log.L);
    const H = getLFValue(log.H);

    setLFValue(hnt.p, !isNaN(p) ? ((p > 20000) ? "> 20000" : ((p < 5000) ? "< 5000"  : p)) : "?", 0);
    setLFValue(hnt.L, !isNaN(L) ? ((L > 2000) ? "> 2000" : L) : "?", (L && L < 1) ? MAX_DECIMAL_PLACES : 0);
    setLFValue(hnt.H, !isNaN(H) ? ((H > 2000) ? "> 2000" : H) : "?", (H && H < 1) ? MAX_DECIMAL_PLACES : 0);
}

// -------------------------------------------------------------------------------------------------------- //

let groupChangeList = [];
const removeFailureToGroup = () => groupChangeList.forEach(tf => updateIFState(tf, false));

function filterNumChars(event) {
    const tf = event.target;

    const value = tf.value;
    const last = tf.selectionStart - 1;

    if (!/^-?\d*[.]?\d{0,2}$/.test(value)) tf.value = value.slice(0, last) + value.slice(last + 1);
    else updateIFState(tf, false);
}

TIFList.forEach(tf => {
    tf.addEventListener('input', filterNumChars);
    tf.addEventListener('input', removeFailureToGroup);
    tf.addEventListener('input', calcAXL);
    tf.addEventListener('paste', event => event.preventDefault());
});

// -------------------------------------------------------------------------------------------------------- //

function validateTIF() {
    let res = true;

    for (const key of TIKList) {
        const IF = inp[key];
        const validate = TIFValidate[key];

        const isValid = validate(getTIFValue(IF));

        updateIFState(IF, !isValid);

        res &&= isValid;
    }

    return res;
}

// -------------------------------------------------------------------------------------------------------- //

function singleLFCalc() {
    const a = rad(getTIFValue(inp.a));
    const v0 = getTIFValue(inp.v0)
    const m = getTIFValue(inp.m);
    const M = getTIFValue(inp.M);
    const h = getTIFValue(inp.h);
    const g = getTIFValue(inp.g);

    const vx = v0 * cos(a);
    const vy = v0 * sin(a);

    const T = (vy + sqrt(vy ** 2 + 2 * g * h)) / g;

    setLFValue(log.vx, vx);
    setLFValue(log.u, getCIFValue(inp.aw) ? m * vx / M : 0);

    setLFValue(log.T, T);
    if (T) timeLFInit();

    setLFValue(log.L, vx * T);
    setLFValue(log.H, h + vy ** 2 / (2 * g));
}

function regularLFCalc(t = 0) {
    const a = rad(getTIFValue(inp.a));
    const v0 = getTIFValue(inp.v0);
    const h = getTIFValue(inp.h);
    const g = getTIFValue(inp.g);

    const vx = getLFValue(log.vx);
    const vy = v0 * sin(a) - g * t;

    const x = vx * t;

    setLFValue(log.t, t);

    setLFValue(log.vy, vy);
    setLFValue(log.v, sqrt(vx ** 2 + vy ** 2));

    setLFValue(log.X, x);
    setLFValue(log.Y, h + v0 * sin(a) * t - g * t ** 2 / 2);

    setLFValue(log.k, vx ? g * vx / (vx ** 2 + vy ** 2) ** 1.5 : "?", 6);
}

// -------------------------------------------------------------------------------------------------------- //

const timeLFInit = () => timeBar.noUiSlider.updateOptions({start: [0], range: {min: 0, max: getLFValue(log.T)}});

const timeBarUpdate = (vals, handle) => regularLFCalc(vals[handle]);

const allowTimeBarUpdate = () => timeBar.noUiSlider.on('update', timeBarUpdate);
const refuseTimeBarUpdate = () => timeBar.noUiSlider.off('update', timeBarUpdate);
const switchTimeBar = allow => allow ? timeBar.noUiSlider.enable() : timeBar.noUiSlider.disable();

// -------------------------------------------------------------------------------------------------------- //

function toggleError(force, message) {
    errorWindow.classList.toggle('hidden', force);
    errorBlackout.classList.toggle('hidden', force);
    if (message) errorMessage.textContent = message;
}

const errorBlackout = document.querySelector('.blackout');
const errorWindow = document.querySelector('.error__body');
const errorMessage = document.querySelector('.error__message');

const errorCloseButton = document.querySelector('.error__close');
errorCloseButton.addEventListener('click', () => toggleError(true));

// -------------------------------------------------------------------------------------------------------- //

const providedConstraints = [
    {
        f: () => getTIFValue(inp.m) * 10 <= getTIFValue(inp.M),
        mes: "Масса снаряда не может превышать 10% от массы пушки. Убедитесь, что значения массы пушки и снаряда указаны правильно.",
        change: [inp.m, inp.M],
    },
    {
        f: () => getTIFValue(inp.r) * 4 <= getTIFValue(inp.h),
        mes: "Высота пушки слишком мала по сравнению с радиусом снаряда. Увеличьте высоту пушки или уменьшите радиус снаряда.",
        change: [inp.h, inp.r],
    },
    {
        f: () => getTIFValue(inp.r) * 4 <= max(getLFValue(log.L) + getLFValue(log.u) * getLFValue(log.T), getLFValue(log.H)),
        mes: "Дальность или высота полёта снаряда слишком мала. Проверьте значения начальной скорости, ускорения свободного падения, массы и радиуса снаряда.",
        change: [inp.m, inp.v0, inp.g, inp.r],
    },
    {
        f: () => !isNaN(getLFValue(hnt.p)),
        mes: "Плотность снаряда выходит за пределы допустимого диапазона - 5000 ≤ ρ ≤ 20000 кг/м³. Проверьте значения массы снаряда и его радиуса.",
        change: [inp.m, inp.r],
    },
    {
        f: () => max(getLFValue(log.L), getLFValue(log.H)) <= 2000,
        mes: "Недостаточно вычислительных ресурсов. Измените значения входных данных и попробуйте снова.",
        change: [inp.a, inp.v0, inp.g],
    },
];

function providedValidateTIF() {
    let res = true;

    for (const {f, mes, change} of providedConstraints) {
        res &&= f();
        if (res) continue;
        toggleError(res, mes);
        change.forEach(fld => updateIFState(fld, !res));
        groupChangeList = change;
        break;
    }

    return res;
}

// -------------------------------------------------------------------------------------------------------- //

function generate() {
    if (!validateTIF()) return;

    refuseTimeBarUpdate();
    switchTimeBar(false);

    singleLFCalc();
    regularLFCalc();

    if (!providedValidateTIF()) return;

    if (!sliderChangeAllowed) allowSliderChange();
    allowTimeBarUpdate();

    simulateButton.disabled = false;

    fullPageSlider.slideNext();
}

const genButton = document.querySelector('.generate');
genButton.addEventListener('click', generate);

const simulateButton = document.querySelector('.simulate');