//LEAPER - Choose music with your hands
//Written by Or Fleisher
'use strict'
//Global
var domvideos = [];
var app, trainer, video;
var audioPlayer, trackCounter;
var trackNames = [];
var trackStreams = [];
var trackArts = [];
var metalhand, classichand, srufhand, hiphophand;
var classicvideo, surfvideo, hopvideo, metalvideo;
var Mobile = false;
var started = false;
var musicState = {
    metalon: false,
    surfon: false,
    rockon: false,
    hipon: false
};
var souncloudData = [
    //0 Client ID For API Call
    '?client_id=bb1c9bd7618755d673591481b4ee3248',
    //1 Metal playlist
    'playlists/80655239',
    //2 Rock playlist
    'playlists/38568520',
    //3 Surf playlist
    'playlists/96517038',
    //4 HipHop playlist
    'playlists/155459877'
];

//App Functionallity
function App() {

    this.initLeap = function() {
            var leapController = new Leap.Controller();
            trainer = new LeapTrainer.Controller({
                controller: leapController
            });
            leapController.connect();

            trainer.fromJSON('{"name":"METAL","pose":true,"data":[[{"x":0.07434818320366154,"y":0.062227011404459506,"z":0.1570578613467445,"stroke":1},{"x":-0.06829918963863807,"y":0.030905656340018836,"z":0.1809146050429974,"stroke":1},{"x":-0.21094656248093763,"y":-0.000415698724421841,"z":0.2047713487392505,"stroke":1},{"x":-0.35359393532323724,"y":-0.03173705378886217,"z":0.22862809243550364,"stroke":1},{"x":0.5584915042391512,"y":-0.06097991523119434,"z":-0.7713719075644964,"stroke":1}]]}');
            trainer.fromJSON('{"name":"ROCK","pose":true,"data":[[{"x":0.018617660049787006,"y":0.03128491918818012,"z":0.28742923555081945,"stroke":1},{"x":-0.0018128278746787005,"y":0.024765634914710746,"z":0.23752358814972674,"stroke":1},{"x":-0.022243315799144434,"y":0.018246350641241374,"z":0.18761794074863414,"stroke":1},{"x":0.005438483624036136,"y":-0.07429690474413225,"z":-0.7125707644491805,"stroke":1}]]}');
            trainer.fromJSON('{"name":"SURF","pose":true,"data":[[{"x":-0.1227952491917168,"y":-0.001878578792101085,"z":0.14098983950481692,"stroke":1},{"x":-0.22455904983834335,"y":0.009554983553539287,"z":0.12399654786304298,"stroke":1},{"x":-0.3263228504849699,"y":0.020988545899179922,"z":0.10700325622126905,"stroke":1},{"x":0.6736771495150301,"y":-0.028664950660618117,"z":-0.3719896435891291,"stroke":1}]]}');
            trainer.fromJSON('{"name":"HOP","pose":true,"data":[[{"x":-0.0840570614836274,"y":-0.018134391850977292,"z":0.2960640074725077,"stroke":1},{"x":-0.1484698051038344,"y":-0.0026187127437290666,"z":0.1923001926208504,"stroke":1},{"x":-0.21288254872404136,"y":0.012896966363519155,"z":0.0885363777691931,"stroke":1},{"x":-0.2772952923442483,"y":0.02841264547076705,"z":-0.015227437082464101,"stroke":1},{"x":0.7227047076557517,"y":-0.02055650723957985,"z":-0.5616731407800869,"stroke":1}]]}');

            audioPlayer = new Audio();

            println('Leap Controller & Gestures Loaded');
    };

    this.isMobile = function() {
            //Mobile Checker
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
                /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) Mobile = true;
            if (Mobile == false) {
                app.initLeap();
            };
    };

    this.welcomeScreen = function(isDesktop) {
        if (isDesktop == 'Desktop') {
            background(255);
            //Landing Page
            textAlign(CENTER);
            textSize(90);
            textFont("Pacifico");
            text("leapo", width / 2, height / 2.5);
            textSize(30);
            textFont("Montserrat");
            text("Welcome to leapo ", width / 2, height / 1.8);
            textSize(20);
            text("leapo, uses the Leap Motion sensor to", width / 2, height / 1.6);
            text("help you choose music with your hands", width / 2, height / 1.5);
            push();
            rectMode(CENTER);
            noFill();
            rect(width / 2, height / 1.215, 100, 50);
            pop();
            text("START", width / 2, height / 1.2);
        } else {
            background(255);
            //Mobile Splash
            textAlign(CENTER);
            textSize(90);
            textFont("Pacifico");
            text("Oops,", width / 2, height / 2.2);
            textSize(36);
            textFont("Montserrat");
            text("Leapo is currently a desktop only ", width / 2, height / 2);
            text("experiene, come back through a desktop", width / 2, height / 1.9);
        }
    };

    this.playerScreen = function() {
            background(255);
            textAlign(CENTER);
            textSize(60);
            textFont("Pacifico");
            text("leapo", 100, 100);
            textFont("Montserrat");
            textSize(20);
            text("Mimic one of the gestures showen above to get started", width / 2, height / 1.2);
            //Instructions images
            image(metalhand, width / 16, height / 2 - 135, 270, 270);
            image(classichand, width / 3.4, height / 2 - 135, 270, 270);
            image(srufhand, width / 1.9, height / 2 - 135, 270, 270);
            image(hiphophand, width / 1.3, height / 2 - 135, 270, 270);
            //Get video element from the DOM
            if(domvideos.length < 1){
            domvideos = document.getElementsByTagName('video');
            }
            //Make it a video loop on hover

            if (int(dist(width / 16 + 135, height / 2, mouseX, mouseY)) < 100) {
                image(metalvideo, width / 16, height / 2 - 135, 270, 270);
                //Make it so it only calls once every draw loop
                if(domvideos[0] == false){
                    metalvideo.play();
                };
                textFont("Montserrat");
                textSize(20);
                text("Metal", width / 6.7, height / 1.5);
              }
            if (int(dist(width / 3.4 + 135, height / 2, mouseX, mouseY)) < 100) {
                image(classicvideo, width / 3.4, height / 2 - 135, 270, 270);
                //Make it so it only calls once every draw loop
                setTimeout(function() {
                    classicvideo.loop();
                    classicvideo.play();
                }, 2500);
                textFont("Montserrat");
                textSize(20);
                text("Classic Rock", width / 2.6, height / 1.5);
            }
            if (int(dist(width / 1.9 + 135, height / 2, mouseX, mouseY)) < 100) {
                image(surfvideo, width / 1.9, height / 2 - 135, 270, 270);
                //Make it so it only calls once every draw loop
                if(domvideos[1].paused){
                    surfvideo.play();
                }
                textFont("Montserrat");
                textSize(20);
                text("Surf", width / 1.62, height / 1.5);
            }
            if (int(dist(width / 1.3 + 135, height / 2, mouseX, mouseY)) < 100) {
                image(hopvideo, width / 1.3, height / 2 - 135, 270, 270);
                //Make it so it only calls once every draw loop
                setTimeout(function() {
                    hopvideo.loop();
                    hopvideo.play();
                }, 2500);
                textFont("Montserrat");
                textSize(20);
                text("Hip-Hop", width / 1.16, height / 1.5);
            };
    };

    this.metalScreen = function() {
            background(255);
            textAlign(CENTER);
            textSize(60);
            textFont("Pacifico");
            text("leapo", 100, 100);
            textFont("Montserrat");
            textSize(20);
            text("Metal", width / 2, 100);
            if (trackStreams !== 'undefined'){
            push();
              for (var i = 0; i < trackStreams.length; i++){
                noStroke();
                fill(200);
                rect(i*width/trackStreams.length+25, height/1.1, 25, 25, 255);
              }
            pop();
            image(metalhand, width/3.4, height/6 , 512, 512);
            image(metalvideo, width/3.4, height/6 , 512, 512);
            };
    };

    this.buttonManager = function() {
            //Start Button
            if (int(dist(width / 2, height / 1.2, mouseX, mouseY)) < 50 && started == false) {
                println('Yay, App Started');
                started = true;
            };
    };
    this.musicStateReset = function() {
            for (var i = 0; i < musicState.length; i++) {
                musicState[i] = false;
            };
    };
}


function preload() {
  //Images
    metalhand = loadImage('assets/pics/metalhand.png');
    classichand = loadImage('assets/pics/classic.png');
    srufhand = loadImage('assets/pics/surf.png');
    hiphophand = loadImage('assets/pics/hop.png');
  //Videos
    metalvideo = createVideo("assets/vids/metalhand.webm");
    surfvideo = createVideo("assets/vids/surf.webm");
    hopvideo = createVideo("assets/vids/hop.webm");
    classicvideo = createVideo("assets/vids/classic.webm");
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    //Init App
    app = new App();
    //Check Mobile
    app.isMobile();

    //Set the video so it doesn't show in the DOM and loop
    metalvideo.loop();
    metalvideo.hide();

    surfvideo.loop();
    surfvideo.hide();

    hopvideo.loop();
    hopvideo.hide();

    classicvideo.loop();
    classicvideo.hide();

    //Gesture Listeners
    trainer.on('METAL', function() {
        console.log('METAL YAH!');
        app.musicStateReset();
        musicState.metalon = true;
        loadJSON('http://api.soundcloud.com/' + souncloudData[1] + souncloudData[0], gotData);
        metalvideo.loop();
        metalvideo.play();
    });
    trainer.on('SURF', function() {
        console.log('SURF TIME!');
        app.musicStateReset();
        musicState.surfon = true;
    });
    trainer.on('ROCK', function() {
        console.log('ROCK IT!');
        app.musicStateReset();
        musicState.rockon = true;
    });
    trainer.on('HOP', function() {
        console.log("IT'S BIGGER THEN A HIP-HOP");
        app.musicStateReset();
        musicState.hipon = true;
    });
}

function draw() {
    background(255);
    //Initiate App
    if (Mobile == false) {
        app.welcomeScreen('Desktop');
    } else {
        app.welcomeScreen('Mobile');
    }
    if (started == true) {
        app.playerScreen();
    }
    if (musicState.metalon == true) {
        app.metalScreen();
    }
}

function mousePressed() {
    app.buttonManager();
}


function mouseDragged() {}

function mouseReleased() {}

function handleTracklist() {
    if (trackCounter <= trackStreams.length + 1) {
        trackCounter++;
        audioPlayer.src = trackStreams[trackCounter - 1];
        audioPlayer.play();
    } else {
        console.log('Playlist Done');
        audioPlayer.pause();
        audioPlayer.src = '';
        musicState.metalon = false;
    }
}

function gotData(data) {
    for (var i = 0; i < data.tracks.length; i++) {
        trackNames.push(data.tracks[i].title);
        trackStreams.push(data.tracks[i].stream_url + souncloudData[0]);
        trackArts.push(data.tracks[i].artwork_url);
    }
    audioPlayer.src = trackStreams[0];
    trackCounter = 1;
    audioPlayer.play();
    audioPlayer.addEventListener("ended", handleTracklist);
}
//Change Canvas Size
window.onresize = function() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    resizeCanvas(w, h);
}
