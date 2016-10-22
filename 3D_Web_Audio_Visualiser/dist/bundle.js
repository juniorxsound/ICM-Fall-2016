(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/*
var glslify = require('glslify');

var shader_location = './assets/shaders';

var frag_gl = glslify(shader_location + '/frag.glsl');
var vert_gl = glslify(shader_location + '/vert.glsl');

console.log(frag_gl);
console.log(vert_gl);
*/
//DAT GUI//
var gui = new dat.GUI();

var params = {
    noise_mult: 3,
    noise_speed: 0.00025,
    camrotx: 0.0,
    camroty: 0.0,
    camrotz: 0.0,
    world_rot:17000
};

var f2 = gui.addFolder('Shader');
f2.add(params, 'noise_mult', 0.5, 10);
f2.add(params, 'noise_speed', 0.00025, 0.0025);
var f3 = gui.addFolder('Camera');
f3.add(params, 'camrotx', 0.0, 1.0);
f3.add(params, 'camroty', 0.0, 1.0);
f3.add(params, 'camrotz', 0.0, 1.0);
f3.add(params, 'world_rot', 10000, 100000);

//Web Audio Stuff//

 /* For loading a song
var audio = new Audio();
audio.src = 'marco.mp3';
audio.controls = true;
document.body.appendChild(audio);
*/

var context = new AudioContext();
var analyser = context.createAnalyser();
freqByteData = new Uint8Array(analyser.frequencyBinCount);

// success callback when requesting audio input stream
function successCallback(stream) {
    //var audioContext = new webkitAudioContext();

    // Create an AudioNode from the stream.
    var mediaStreamSource = context.createMediaStreamSource( stream );

    mediaStreamSource.connect(analyser);

}

function errorCallback() {
    console.log("The following error occurred: ");
}

navigator.webkitGetUserMedia( {audio:true}, successCallback, errorCallback );
navigator.getUserMedia( {audio:true}, successCallback, errorCallback );



/*
window.addEventListener('load', function(e) {
  // Our <audio> element will be the audio source.
  //var source = context.createMediaElementSource(mic);
  mic.connect(analyser);
  analyser.connect(context.destination);
  //audio.play();
}, false);
*/

//Threejs Scene//
var container, renderer, scene, camera, mesh, fov = 80;
var composer, effect;
var start = Date.now();
var effect_slide1;
var sphere, glow, bloomPass;
window.addEventListener( 'load', init );


function init() {

	container = document.getElementById( 'container' );
  renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.autoClear = false;
  container.appendChild( renderer.domElement );

	scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 100;
	camera.target = new THREE.Vector3( 0, 0, 0 );
	scene.add( camera );

  sphere = new THREE.Mesh( new THREE.SphereGeometry( 500, 60, 60 ), new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'plate_1.png' ) } ) );
	sphere.scale.x = -1;
	sphere.doubleSided = true;
	scene.add( sphere );

  //Reflection Shader
	material = new THREE.ShaderMaterial( {

		uniforms: {
			tShine: { type: "t", value: THREE.ImageUtils.loadTexture( 'plate_1_projection.png' ) },
			time: { type: "f", value: 5 },
			weight: { type: "f", value: 10 }
		},

    vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent

	});

	mesh = new THREE.Mesh( new THREE.IcosahedronGeometry( 20, 5 ), material );
	scene.add( mesh );

  composer = new THREE.EffectComposer( renderer );
  composer.addPass( new THREE.RenderPass( scene, camera ) );
  var bloompass = new THREE.BloomPass(3, 10, 5.0, 256);
  bloompass.renderToScreen = true;

  composer.addPass(bloompass);
  var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  effectCopy.renderToScreen = true;
  composer.addPass(effectCopy);


	container.addEventListener( 'mousedown', onMouseDown, false );
	container.addEventListener( 'mousemove', onMouseMove, false );
	container.addEventListener( 'mouseup', onMouseUp, false );
	container.addEventListener( 'mousewheel', onMouseWheel, false );
	container.addEventListener( 'DOMMouseScroll', onMouseWheel, false);
	window.addEventListener( 'resize', onWindowResize, false );

	projector = new THREE.Projector();

	render();

}

function onWindowResize() {
	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.projectionMatrix.makePerspective( fov, window.innerWidth / window.innerHeight, 1, 1100 );
}

function onMouseWheel( event ) {

	// WebKit

	if ( event.wheelDeltaY ) {

		fov -= event.wheelDeltaY * 0.01;

	// Opera / Explorer 9

	} else if ( event.wheelDelta ) {

		fov -= event.wheelDelta * 0.05;

	// Firefox

	} else if ( event.detail ) {

		fov += event.detail * 1.0;

	}

	camera.projectionMatrix.makePerspective( fov, window.innerWidth / window.innerHeight, 1, 1100 );

}

var onMouseDownMouseX = 0, onMouseDownMouseY = 0,
lon = 0, onMouseDownLon = 0,
lat = 0, onMouseDownLat = 0,
phi = 0, theta = 0;
lat = 15, isUserInteracting = false;


function onMouseDown( event ) {

	event.preventDefault();

	isUserInteracting = true;

	onPointerDownPointerX = event.clientX;
	onPointerDownPointerY = event.clientY;

	onPointerDownLon = lon;
	onPointerDownLat = lat;

	return;

	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	projector.unprojectVector( vector, camera );

	var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );

	var intersects = ray.intersectObjects( scene.children );

	if ( intersects.length > 0 ) {

			console.log( intersects[ 0 ] );

	}

}

var mouse = { x: 0, y: 0 }
var projector;

function onMouseMove( event ) {

	if ( isUserInteracting ) {

		lon = ( event.clientX - onPointerDownPointerX ) * 0.1 + onPointerDownLon;
		lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

	}

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onMouseUp( event ) {

	isUserInteracting = false;

}

var start = Date.now();

function update() {
    requestAnimationFrame(update);
    analyser.getByteFrequencyData(freqByteData);
    var length = freqByteData.length;

    	var sum = 0;
    	for(var j = 0; j < length; ++j) {
    		sum += freqByteData[j];
    	}
      aveLevel = sum / length;
};

update();

function render() {
  material.uniforms[ 'weight' ].value = aveLevel/params.noise_mult;
	material.uniforms[ 'time' ].value = params.noise_speed * ( Date.now() - start );

	lat = Math.max( - 85, Math.min( 85, lat ) );
	phi = ( 90 - lat ) * Math.PI / 180;
	theta = lon * Math.PI / 180;

	camera.position.x = 100 * Math.sin( phi ) * Math.cos( theta ) - params.camrotx*aveLevel;
	camera.position.y = 100 * Math.cos( phi ) - params.camroty*aveLevel;
	camera.position.z = 100 * Math.sin( phi ) * Math.sin( theta ) - params.camrotz*aveLevel;

	camera.lookAt( camera.target );

  sphere.rotation.y += aveLevel*params.world_rot/1000000000;
  sphere.rotation.x += aveLevel*0.00001;
	//mesh.rotation.y += .01;
	camera.lookAt( scene.position );

  //renderer.render( scene, camera );
  composer.render();
	requestAnimationFrame( render );
}

},{}]},{},[1]);
