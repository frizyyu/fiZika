let engine;
let world;
const canvas = document.querySelector('.display');
let render;
const Render = Matter.Render;
let canSimulate = false;
const Events = Matter.Events;
const Vector = Matter.Vector;
let kernel;
let cannon;
let topBoundary;
let leftBoundary;
let rightBoundary;
let sliderInterval;
let radius;
let showRadius;
const firstWidth = canvas.width;
const firstHeight = canvas.height;
const slider = document.querySelector('.time-slider');
let a;
let M;
let m;
let v0;
let g;
let h;
let r;
let wheelsUnlocked;
let isPathHasBeenAlreadyDrawn = false;
document.querySelector('.time-slider').noUiSlider.on('slide', function() {
    Matter.Body.setPosition(kernel, {
        x: parseFloat(document.getElementById('x-value').textContent) + canvas.width / 7, //+23
        y: canvas.height - parseFloat(document.getElementById('y-value').textContent) - 6 - showRadius
    });
    Matter.Body.setPosition(cannon, {
        x: -(parseFloat(document.getElementById('u-value').textContent) * parseFloat(document.getElementById('t-value').textContent) - canvas.width / 7), //сделать тут не через скорость, а через x и y координаты пушки.
        y: canvas.height - h / 2 - 5
    });
    Matter.Body.setPosition(topBoundary, {
        x: -(parseFloat(document.getElementById('u-value').textContent) * parseFloat(document.getElementById('t-value').textContent) - canvas.width / 7), //сделать тут не через скорость, а через x и y координаты пушки.
        y: canvas.height - h - 5
    });
    Matter.Body.setPosition(leftBoundary, {
        x: -(parseFloat(document.getElementById('u-value').textContent) * parseFloat(document.getElementById('t-value').textContent) - canvas.width / 7) - 45, //сделать тут не через скорость, а через x и y координаты пушки.
        y: canvas.height - h / 2 - 5
    });
    Matter.Body.setPosition(rightBoundary, {
        x: -(parseFloat(document.getElementById('u-value').textContent) * parseFloat(document.getElementById('t-value').textContent) - canvas.width / 7) + 45, //сделать тут не через скорость, а через x и y координаты пушки.
        y: canvas.height - h / 2 - 5
    });
});
document.querySelector('.time-slider').noUiSlider.on('set', function() {
    try {
        Matter.Body.setPosition(kernel, {
            x: parseFloat(document.getElementById('x-value').textContent) + canvas.width / 7, //+23
            y: canvas.height - parseFloat(document.getElementById('y-value').textContent) - 6 - showRadius
        });
        Matter.Body.setPosition(cannon, {
            x: -(parseFloat(document.getElementById('u-value').textContent) * parseFloat(document.getElementById('t-value').textContent) - canvas.width / 7), //сделать тут не через скорость, а через x и y координаты пушки.
            y: canvas.height - h / 2 - 5
        });
        Matter.Body.setPosition(topBoundary, {
            x: -(parseFloat(document.getElementById('u-value').textContent) * parseFloat(document.getElementById('t-value').textContent) - canvas.width / 7), //сделать тут не через скорость, а через x и y координаты пушки.
            y: canvas.height - h - 5
        });
        Matter.Body.setPosition(leftBoundary, {
            x: -(parseFloat(document.getElementById('u-value').textContent) * parseFloat(document.getElementById('t-value').textContent) - canvas.width / 7) - 45, //сделать тут не через скорость, а через x и y координаты пушки.
            y: canvas.height - h / 2 - 5
        });
        Matter.Body.setPosition(rightBoundary, {
            x: -(parseFloat(document.getElementById('u-value').textContent) * parseFloat(document.getElementById('t-value').textContent) - canvas.width / 7) + 45, //сделать тут не через скорость, а через x и y координаты пушки.
            y: canvas.height - h / 2 - 5
        });
    } catch (ExeptionError) {
    }
});

document.querySelector('.simulate').addEventListener('click', function(event) {
    event.preventDefault();
    if (canSimulate) {
        event.target.disabled = true;
        slider.noUiSlider.updateOptions({animate: false});
        slider.noUiSlider.set(slider.noUiSlider.options.range.min);
        slider.noUiSlider.updateOptions({animate: true});
        canSimulate = false;

        var trail = [];

        Events.on(render, 'afterRender', function() {
            pathDrawing(kernel, trail);
            drawVectors();
        });

        Matter.Runner.run(engine);
        slider.noUiSlider.disable()
        const maxValue = slider.noUiSlider.options.range.max;
        sliderInterval = setInterval(function() {
            const currentValue = parseFloat(slider.noUiSlider.get());
            const newValue = currentValue + 0.01; // Увеличивайте значение на 1
            if (newValue >= maxValue) {
                slider.noUiSlider.set(maxValue);
                clearInterval(sliderInterval); // Остановить интервал, когда достигнут максимум
                isPathHasBeenAlreadyDrawn = true;
                canSimulate = true;
                event.target.disabled = false;
                slider.noUiSlider.enable()
            } else {
                slider.noUiSlider.set(newValue);
            }
        }, 1);
    }
});

document.querySelector('.fst-page__generate').addEventListener('click', function(event) {
    event.preventDefault();
    isPathHasBeenAlreadyDrawn = false;
    a = parseFloat(document.getElementById("alpha").value);
    M = parseFloat(document.getElementById("m-gun").value);
    m = parseFloat(document.getElementById("m-kernel").value);
    v0 = parseFloat(document.getElementById("v0").value);
    g = parseFloat(document.getElementById("g").value);
    h = parseFloat(document.getElementById("h").value);
    r = parseFloat(document.getElementById("r").value);
    wheelsUnlocked = document.getElementById("wheels").state;
    clearInterval(sliderInterval);
    slider.noUiSlider.set(slider.noUiSlider.options.range.min);

    engine = Matter.Engine.create();
    world = engine.world;
    let width;
    let height;
    const minWidth = 600;
    const minHeight = 600;
    const L = parseFloat(document.getElementById("L-value").textContent);
    const H = parseFloat(document.getElementById("H-value").textContent);
    if (L >= H) {
        if (L > firstWidth && L <= 2000) {
            width = firstWidth + parseFloat(document.getElementById("L-value").textContent);
            console.log("A");
        } else if (L < 2000) {
            width = firstWidth - (firstWidth - parseFloat(document.getElementById("L-value").textContent)) + firstWidth / 7 + 30;
            console.log("B");
        } else {
            width = firstWidth;
            console.log("C");
        }
        if (width < minWidth)
            width = minWidth;
        height = width * 0.75;
    }
    else {

        if (H > firstHeight && H <= 2000) {
            height = firstHeight + parseFloat(document.getElementById("H-value").textContent);
            console.log("A");
        } else if (L < 2000) {
            height = firstHeight - (firstHeight - parseFloat(document.getElementById("H-value").textContent)) + firstHeight / 7;
            console.log("B");
        } else {
            height = firstHeight;
            console.log("C");
        }
        if (height < minHeight)
            height = minHeight;
        width = height / 0.75;
    }
    console.log(width)

    render = Matter.Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            width: width,
            height: height,
            wireframes: false,
            background: 'transparent'
        }
    });
    canSimulate = true;
    world.gravity.x = 0;
    world.gravity.y = 0;

    // барьеры
    const ground = Matter.Bodies.rectangle(canvas.width / 2, canvas.height + 40, canvas.width, 90, { isStatic: true, render: { fillStyle: 'white' } });
    const topWall = Matter.Bodies.rectangle(canvas.width / 2, 0, canvas.width, 10, { isStatic: true, render: { fillStyle: 'transparent' } });
    Matter.World.add(world, [ground, topWall]);
    topBoundary = Matter.Bodies.rectangle(canvas.width / 7, canvas.height - h - 5, 45 + 45, 1, { isStatic: true, render: { fillStyle: 'white' } });
    leftBoundary = Matter.Bodies.rectangle(canvas.width / 7 + 45, canvas.height - h / 2 - 5, 1, h, { isStatic: true, render: { fillStyle: 'white' } });
    rightBoundary = Matter.Bodies.rectangle(canvas.width / 7 - 45, canvas.height - h / 2 - 5, 1, h, { isStatic: true, render: { fillStyle: 'white' } });
    Matter.World.add(world, [topBoundary, leftBoundary, rightBoundary]);
    //----------------------------------------
    cannon = Matter.Bodies.rectangle(canvas.width / 7, canvas.height - h / 2 - 5, 45, h, { restitution: 0, isStatic: true, render: { fillStyle: 'white',sprite: {
                texture: './img/gun.png'
            } } });
    Matter.Body.setMass(cannon, parseFloat(document.getElementById("m-gun").value));
    var trailCannon = [];

    Events.on(render, 'afterRender', function() {
        pathDrawing(cannon, trailCannon);
        drawVectors();
    });
    Matter.World.add(world, cannon);

    const volume = parseFloat(document.getElementById("r").value);
    radius = calculateRadius(volume);             //+23
    showRadius = calculateRadius(volume*300);
    kernel = Matter.Bodies.circle(canvas.width / 7, canvas.height - h - showRadius - 5, showRadius, {
        restitution: 0,
        render: { fillStyle: 'white' },
        isStatic: true
    });


    const initialVelocity = parseFloat(document.getElementById("v0").value);

    const angleInRadians = a * (Math.PI / 180);
    const vx = initialVelocity * Math.cos(angleInRadians);
    const vy = -initialVelocity * Math.sin(angleInRadians);

    Matter.Body.setVelocity(kernel, { x: vx, y: vy });
    Matter.Body.setMass(kernel, m);
    Matter.World.add(world, kernel);

    Matter.Render.run(render);
});

function calculateRadius(volume) {
    const pi = Math.PI;
    const radius = Math.cbrt((3 * volume) / (4 * pi));
    return radius;
}

function pathDrawing(item, trail) {
    if (!isPathHasBeenAlreadyDrawn) {
        trail.unshift({
            position: Vector.clone(item.position),
            speed: item.speed
        });

        Render.startViewTransform(render);
        render.context.globalAlpha = 0.7;
    }

    render.context.beginPath();
    render.context.moveTo(trail[0].position.x, trail[0].position.y);

    for (var i = 1; i < trail.length; i += 1) {
        var point = trail[i].position;
        render.context.lineTo(point.x, point.y);
    }

    render.context.strokeStyle = 'white';
    render.context.lineWidth = 2; // Установите желаемую толщину линии
    render.context.stroke();

    render.context.globalAlpha = 1;
    Render.endViewTransform(render);

    if (trail.length > 3000) {
        trail.pop();
    }
}

function drawArrow(context, fromX, fromY, toX, toY) {
    const headlen = 10; // Длина стрелки
    const angle = Math.atan2(toY - fromY, toX - fromX);

    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(toX, toY);
    context.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
}

function drawVectors() {
    const context = render.context;
    const vectorLength = 50; // Фиксированная длина векторов

    // Вектор скорости v для ядра
    const vxx = parseFloat(document.getElementById('vx-value').textContent);
    const vyy = parseFloat(document.getElementById('vy-value').textContent);
    const vStart = kernel.position;
    const vEnd = Vector.create(vxx, -vyy);

    render.context.strokeStyle = 'red';
    drawArrow(context, vStart.x, vStart.y, vStart.x + vEnd.x, vStart.y + vEnd.y);

    // Подпись для вектора скорости v
    context.fillStyle = 'red';
    context.font = '12px Arial';
    context.fillText(`v`, vStart.x + vEnd.x + 5, vStart.y + vEnd.y);

    if (a !== 90) {
        // Вектор скорости vx для ядра
        const vx = parseFloat(document.getElementById('vx-value').textContent);
        const vxStart = kernel.position;
        const vxVector = Vector.create(vx, 0);
        const vxNormalized = Vector.normalise(vxVector); // Нормализация вектора
        const vxEnd = Vector.mult(vxNormalized, vectorLength); // Масштабирование до фиксированной длины

        render.context.strokeStyle = 'red';
        drawArrow(context, vxStart.x, vxStart.y, vxStart.x + vxEnd.x, vxStart.y + vxEnd.y);

        // Подпись для вектора скорости vx
        context.fillStyle = 'red';
        context.font = '12px Arial';
        context.fillText(`vx`, vxStart.x + vxEnd.x + 5, vxStart.y + vxEnd.y);
    }

    // Вектор скорости vy для ядра
    // Вектор скорости vy для ядра
    const vy = parseFloat(document.getElementById('vy-value').textContent);
    const vyStart = kernel.position;
    const vyEnd = Vector.create(0, -vy);

    render.context.strokeStyle = 'red';
    drawArrow(context, vyStart.x, vyStart.y, vyStart.x + vyEnd.x, vyStart.y + vyEnd.y);

    // Подпись для вектора скорости vy
    context.fillStyle = 'red';
    context.font = '12px Arial';
    context.fillText(`vy`, vyStart.x + vyEnd.x + 5, vyStart.y + vyEnd.y);

    // Вектор скорости u для пушки
    if (parseFloat(document.getElementById('u-value').textContent) !== 0) {
        const u = Vector.create(-1, 0);
        const uMagnitude = 35;
        const uEnd = Vector.mult(u, uMagnitude);
        const uStart = cannon.position;

        render.context.strokeStyle = 'red';
        drawArrow(context, uStart.x, uStart.y, uStart.x + uEnd.x, uStart.y + uEnd.y);

        // Подпись для вектора скорости u
        context.fillStyle = 'red';
        context.font = '12px Arial';
        context.fillText(`u`, uStart.x + uEnd.x + 5, uStart.y + uEnd.y - 10);
    }
}


