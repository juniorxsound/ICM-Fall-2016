//GLOBAL VARIABLES
var colorChanger, setupSound, loopSound, mic, vol, noiser, canvas_context;

var gui = new dat.GUI();
//Params
var params = {
  audioControl: 100,
  noiseAdd: 0.0,
  radius: 1,
  color: [0,0,0],
  alpha: 255,
  saveFrame: function(){
    saveCanvas(canvas_context, "myModoDrawing", 'jpg');
    console.log('image saved');
  },
  clearCanvas: function(){
    clear();
  }
}
//Folders
    //Brush
    gui.add(params, 'clearCanvas');
    var f1 = gui.addFolder('Brush Control');
    f1.add(params, 'audioControl', 50, 1000);
    f1.add(params, 'noiseAdd', 0.0, 100.0);
    f1.add(params, 'radius', 0, 10);
    //Color
    var f2 = gui.addFolder('Colors');
    f2.addColor(params, 'color');
    f2.add(params, 'alpha', 0, 255);
    //Share
    var f3 = gui.addFolder('Share');
    f3.add(params, 'saveFrame');
    //Init folder state
    f1.open();
    f2.open();

//P5 Setup
function setup () {
  canvas_context = createCanvas(window.innerWidth, window.innerHeight);

  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  vol = mic.getLevel();
  //console.log(vol);
  noiser = noise(params.noiseAdd);
}

function mouseDragged() {
	stroke(params.color[0], params.color[1], params.color[2], params.alpha);
  strokeWeight((vol*params.audioControl)+(params.radius*noiser));
	line(mouseX, mouseY, pmouseX, pmouseY);
}

//Resize Canvas to Fit the Screen
window.onresize = function() {
  var w = window.innerWidth
  var h = window.innerHeight
  resizeCanvas(w,h)
}
