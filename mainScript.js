import { QuadTree } from "./QuadTree.js";

let qt, w, h, ctx;

let showGrid = document.getElementById("grid").checked;

let num_points = document.getElementById("num_points");
num_points.addEventListener("input", (event) => {
    start(1200, 800, num_points.value);
})


function start(w, h, n) {
    w = w;
    h = h;
    let canvas = createCanvas(w, h);
    ctx = canvas.getContext('2d');
    qt = new QuadTree(0, 0, w, h, ctx, showGrid);
    qt.createPoints(n);
    init();
}

function createCanvas(w, h) {
    let canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.width = w;
    canvas.height = h;
    canvas.style.position = "absolute";
    canvas.style.background = "lightgrey";

    document.getElementById("canvas-div").appendChild(canvas);
    return canvas;
}

function init() {
    window.requestAnimationFrame(draw);
}

function draw() {
    // animation
    qt.update();
    window.requestAnimationFrame(draw);
}
