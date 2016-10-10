//GUI//
var gui = new dat.GUI();

var params = {
    audioControl: 100,
    noiseSpeed: 5.0,
    radius: 100,
    color: [0, 128, 255],
    alpha: 25,
    saveFrame: function() {
        saveCanvas(canvas_context, "myFlowDrawing", 'jpg')
    }
};
//Folders and Params
    //Brush
    var f1 = gui.addFolder('Brush Control');
    f1.add(params, 'audioControl', 100, 1000);
    f1.add(params, 'noiseSpeed', 1.0, 10.0);
    f1.add(params, 'radius', 30, 200);
    //Color
    var f2 = gui.addFolder('Colors');
    f2.addColor(params, 'color');
    f2.add(params, 'alpha', 10, 100);
    //Share
    var f3 = gui.addFolder('Share');
    f3.add(params, 'saveFrame');
    //Init folder state
    f1.open();
    f2.open();

//GLOBAL p5 VARIABLES
var canvas_context;

var formDimen = 15;
var moveSize = 2;

var centerX, centerY;

var x = new Array(formDimen);
var y = new Array(formDimen);

var color_change;

var noise_val;
var noise_mult;

//p5 Sound
var mic;

function setup() {

    canvas_context = createCanvas(window.innerWidth, window.innerHeight);
    smooth();

    mic = new p5.AudioIn();
    mic.start();

    // initial forms
    centerX = width / 2;
    centerY = height / 2;
    var angle = radians(360 / (formDimen));
    for (var i = 0; i < formDimen; i++) {
        x[i] = cos(angle * i) * params.radius;
        y[i] = sin(angle * i) * params.radius;
    }

    color_change = stroke(params.color[0], params.color[1], params.color[2], params.alpha);
    background(255);
}


function draw() {
    color_change = stroke(params.color[0], params.color[1], params.color[2], params.alpha);
    noise_mult = (mic.getLevel() * params.audioControl);
    noise_val = noise(params.noiseSpeed);
}


function mousePressed() {
    push();
    // restart a new form on mouse position
    centerX = mouseX;
    centerY = mouseY;
    var angle, radius;

    centerX = mouseX;
    centerY = mouseY;
    angle = radians(360 / (formDimen));
    radius = params.radius * random(0.5, 1.0);
    for (var i = 0; i < formDimen; i++) {
        x[i] = cos(angle * i) * radius;
        y[i] = sin(angle * i) * radius;
    }
}

function mouseDragged() {
    // floating towards mouse pos
    if (mouseX !== 0 || mouseY !== 0) {
        centerX += (mouseX - centerX) * 0.01;
        centerY += (mouseY - centerY) * 0.01;
    }

    // calculate new
    for (var i = 0; i < formDimen; i++) {
        x[i] += (random(-noise_val, noise_val) * noise_mult);
        y[i] += (random(-noise_val, noise_val) * noise_mult);
    }

    strokeWeight(0.75);
    noFill();

    beginShape();
    curveVertex(x[formDimen - 1] + centerX, y[formDimen - 1] + centerY);
    for (var i = 0; i < formDimen; i++) {
        curveVertex(x[i] + centerX, y[i] + centerY);
    }
    curveVertex(x[0] + centerX, y[0] + centerY);
    curveVertex(x[1] + centerX, y[1] + centerY);
    endShape();
}

function keyPressed() {
    if (key == 'c' || key == 'C') background(255);
    if (key == '1') //maybe choose from a color palette
        stroke(random(0, 20), random(100, 200), random(100, 200), 25);
}

window.onresize = function() {
    var w = window.innerWidth
    var h = window.innerHeight
    resizeCanvas(w, h)
}
