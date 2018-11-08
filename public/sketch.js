// import Bar from './Bar.js'
// var Bar require('Bar')

var data = getData();

var p;
var parts = [];
var r = 5;
var l = 15;
var bars = [];
var gros = 0;
var igros;
var colorR = 255;
var colorG = 255;
var colorB = 255;
var personnes = [];
var music = ['AlanWalkerFade.mp3', 'Cartoon - On  On.mp3', 'DEAF KEV - Invincible.mp3', 'Fatal Bazooka feat. Vitoo.mp3', 'GALA - Freed from desire.mp3', 'Jain - Alright.mp3', 'Le Wanski - Bella Ciao.mp3', 'Lost Temple - Panda Dub.mp3', 'Martin Garrix  Brooks - Like I Do.mp3', 'MC Fioti - Bum Bum Tam Tam.mp3', 'OrelSan - San.mp3', 'White Town - Your Woman.mp3'];
var ouvertureBar;
var ambiance;
var decaps;
var decaps2;
var reset = false;

var nbParticules = 150;

var heures = 9;
var minutes = 0;

var nuit = false;
var opacity = 0;
var tramPlay = 0;
// var vitTemps = 333.332;
// var vitTemps = 150.332;
var vitTemps = 200;


// Create a new Mappa instance.
let myMap;
let canvas;
// Create a new Mappa instance using Leaflet.
const mappa = new Mappa('Leaflet');
const options = {
    lat: 47.212305,
    lng: -1.555840,
    zoom: 15,
    //style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}{r}.png"
    style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
};

//declaration musique
var song, analyzer;
var fft, // Allow us to analyze the song
    numBars = 1024, // The number of bars to use; power of 2 from 16 to 1024
    song,
    rms = 0; // The p5 sound object


var ampMouvementBar = 1;

var playSound = false;

var clearMap = true;

var deplacementGeo = false;

var nbPersonnes = 1;
var nbBars = 5;

var barOuvertSong;
var barFermeSong;

var nbBarsBefore;

var iteration = 0;

var white = false;
var black = false;

socket.on('nbParticules', function(val){
    nbPersonnes = val;
});
socket.on('nbBars', function(val){
    nbBarsBefore = nbBars;
    nbBars = val;
    barOuvertSong.setVolume(0.3);
    barFermeSong.setVolume(0.3);
    if(nbBars>nbBarsBefore){
        barOuvertSong.play();
   }else if(nbBars<nbBarsBefore){
       barFermeSong.play();
   }
});
socket.on('ampMouvementBar', function(val){
    ampMouvementBar = val;    
});
socket.on('playSound', function(val){
    playSound = val;

    if (val){
        song.play()
    } else {
        song.pause()
    }
});
socket.on('reset', function(val){
    reset = val;
});
socket.on('clear', function(val){
    clearMap = val;
    console.log('clear', clearMap);
    
});
socket.on('deplacementGeo', function(val){
    deplacementGeo = val;
    console.log('deplacementGeo', deplacementGeo);
    
});
socket.on('white', function(val){
    white = val;
    iteration = 0;
    console.log('white', white);

});
socket.on('black', function(val){
    black = val;
    iteration = 0;
    console.log('black', black);

});


/*if(ouvert==false){
        barOuvertSong.play();
            ouvert=true;
        }*/


function preload() {
    tram = loadSound('tram.mp3');
    song = loadSound('zik/Le Wanski - Bella Ciao.mp3');    
    barOuvertSong = loadSound('ouverture-bar.mp3');
    barFermeSong = loadSound('close.mp3');

    for (i=0; i<music.length; i++) {
        var path = "./zik/" + music[i];
        // if (fileExists(path)) {
            var thisSound = loadSound(path, storeSound);
        // }
    }
    fft = new p5.FFT();
    peakDetect = new p5.PeakDetect();
}


var allSounds = [];

function storeSound(soundFile) {
    // could I catch the errors here?
    allSounds.push(soundFile);
}

function setup() {

    canvas = createCanvas(windowWidth, windowHeight);

    myMap = mappa.tileMap(options);
    myMap.overlay(canvas);

    rectMode(CENTER);
    parts.push(new Particule((width / 2) + 0, (height / 2) + 0));

    // parts.push(new Particule(0, 0));

    for (var i = 0; i < nbParticules; i++) {
        personnes.push(new Personnes(options.lat+random(-0.005, 0.005), options.lng+random(-0.005, 0.005)));
    }

    data.then(function (dataResult) {
        dataResult.results.forEach(function (element, index) {
            let lat = parseFloat(element.geometry.location.lat);
            let lng = parseFloat(element.geometry.location.lng);
            let name = element.name;
            // bars.push(new Bar(lat, lng, name, music[index]));
            if (index > music.length - 1) {
                bars.push(new Bar(lat, lng, name, allSounds[0]));
            } else {
                bars.push(new Bar(lat, lng, name, allSounds[index]));
            }
        })
    });

    setInterval(chrono, vitTemps);
}


function draw() {
    // background(0);
    if (clearMap) {
        clear();
    }

    // console.log('heures : ',heures+(minutes/60));
    if (heures+(minutes/60) >= 24) {
        minutes = 0;
        heures = 0;
    }
    if (heures+(minutes/60) > 9 && heures+(minutes/60) < 19) {
        nuit=false;//jour
    } else {
        nuit=true;//nuit
    }
    if(nuit==false){//jour
        if (opacity > 0) {
            opacity -= 0.005;
        } else {
            opacity = 0;
        }
        push();
            // if (white){
            //     fill('rgba(0,0,0, '+opacity+')')
            //     rect(width/2, height/2, width, height);
            // }
            if (clearMap){
                fill('rgba(0,0,0, '+opacity+')')
                rect(width/2, height/2, width, height);
                iteration = 0;
            } else {
                iteration++;
                if (iteration <= 1){
                    clear()
                    if (white){
                        fill('rgba(255,255,255, 1)');
                        // fill('rgba(255,255,255, 0)');
                        rect(width/2, height/2, width, height);
                    }
                }
            }
        pop();
        
    } else {//nuit
        if (opacity < 0.75) {
            opacity += 0.005;
        }
        push();
            if (clearMap){
                fill('rgba(0,0,0, '+opacity+')')
                rect(width/2, height/2, width, height);
                iteration = 0;
            } else {
                iteration++;
                if (iteration <= 1){
                    clear()
                    if (black){
                        fill('rgba(0,0,0, 1)')
                    } else {
                        fill('rgba(0,0,0, 0.75)')
                    }
                    rect(width/2, height/2, width, height);
                }
            }
        pop();
    }
    tramPlay += 1
    tram.setVolume(0.4);
       if (heures > 6 && heures < 12) {
           if (tramPlay%1100 == 0) {
               console.log('tram play 6-12');
               tram.play();
           }
       } else if(heures > 12 && heures < 20) {           
        if (tramPlay%800 == 0) {
            console.log('tram play 12-20');
            tram.play();
        }
       } else if(heures > 20 && heures < 22) {
        if (tramPlay%1000 == 0) {
            console.log('tram play 20-22');
            tram.play();
        }
       } else if(heures > 22 && heures < 23) {
        if (tramPlay%1350 == 0) {
            console.log('tram play 22-23');
            tram.play();
        }
       } else if(heures >= 0 && heures < 2) {
        if (tramPlay%1350 == 0) {
            console.log('tram play 0-2');
            tram.play();
        }
       }
       

    // if (myMap.map){
    //     mapBorder = myMap.map.getBounds();
    // }
// peakDetect accepts an fft post-analysis
    var spectrum = fft.analyze();
    peakDetect.update(fft);

    total = 0;
    // for (let i = 0; i< spectrum.length; i+=10){
    //     total += spectrum[i];
    // }
    // var rms2 = (total/spectrum.length)*100;
    rms = peakDetect.penergy*50;
    if (bars.length == 0){
        nbBars = 0;
    }
    for (let i = 0; i < nbBars; i++) {
        bars[i].update();
        parts[0].update();

        if (reset) { // If click mouse
            bars[i].l = 15;
            bars[i].nbPersonne = [];

            igros = undefined;
            gros = 0;
        }
        if (bars[i].nbPersonne.length > gros) { //Stocke le bar le plus gros
            gros = bars[i].nbPersonne.length
            igros = i;
            // console.log('!!! music on : ',bars[i].text);
        } else if(bars[i] == bars[gros]) {
            //RIEN !            
        } else {
            bars[i].lower();
        }

        if (bars[i].coor.x != -100 && bars[i].coor.y != -100){
            if (dist(bars[i].coor.x, bars[i].coor.y, parts[0].pos.x, parts[0].pos.y) < bars[i].l/1.5) {
                bars[i].inside();
            } else {
                bars[i].outside();
            }
            for (let o = 0; o < nbPersonnes; o++) {
                // personnes[o].update();
                if (dist(bars[i].coor.x, bars[i].coor.y, personnes[o].pos.x, personnes[o].pos.y) < bars[i].l) {
                    bars[i].entrer(bars[i], personnes[o]);
                } else {
                    // bars[i].outside();
                    // bars[i].sortir();
                }
            }
        }

        if (bars[igros] != undefined) {
            // console.log('### music on : ',bars[igros].text);
            bars[igros].bigger();
            // console.log('Bar le plus gros :', igros, ' = ', bars[igros].text ,' avec', gros, 'personnes !');
        }
    }

    for (let i = 0; i < nbPersonnes; i++) {
        personnes[i].update();
        personnes[i].draw();
        if (reset && personnes[i].inside == true) {
            personnes[i].outside();
        }

    }
    reset = false;

    new Horloge();

}

class Particule {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vit = createVector(4, 5);
    }

    update() {
        push();
        this.pos.add(this.vit);

        this.mouse = createVector(mouseX, mouseY);
        this.vit = this.mouse.sub(this.pos).div(50);

        ellipse(this.pos.x, this.pos.y, r);
        pop();
    }
    draw() {

    }
}

function doubleClicked() {

}

function mouseReleased() {
    reset = true;
}

function chrono() {
    this.minutes++;
}


/****** TEST  ******/
(function(){
    var log = console.log.bind(console), keyData = document.getElementById('key_data'), 
            deviceInfoInputs = document.getElementById('inputs'), deviceInfoOutputs = document.getElementById('outputs'), 
            device = document.querySelector('.device-name'), midi;

    // request MIDI access
    if(navigator.requestMIDIAccess){
        navigator.requestMIDIAccess({sysex: false}).then(onMIDISuccess, onMIDIFailure);
    }
    else {
        alert("No MIDI support in your browser.");
    }

    // midi functions
    function onMIDISuccess(midiAccess){
        midi = midiAccess;
        var inputs = midi.inputs.values();
        // loop through all inputs
        for(var input = inputs.next(); input && !input.done; input = inputs.next()){
            // listen for midi messages
            input.value.onmidimessage = onMIDIMessage;

            listInputs(input);
        }
        // listen for connect/disconnect message
        midi.onstatechange = onStateChange;

        showMIDIPorts(midi);
    }

    function onMIDIMessage(event){
        var data = event.data, 
                cmd = data[0] >> 4,
                channel = data[0] & 0xf,
                type = data[0], // ignore [inconsistent between devices]
                note = data[1], 
                velocity = data[2];
                
        if (velocity) {
            noteOn(note, velocity);
        }
        else{
            noteOff(note, velocity);
        }
        log('data', data, 'cmd', cmd, 'channel', channel);
        // logger(keyData, 'key data', data);
    }

    function onStateChange(event){
        var port = event.port, state = port.state, name = port.name, type = port.type;
        device.textContent = name.replace(/port.*/i, '');
        showMIDIPorts(midi);
        if(type == "input")
            log("name", name, "port", port, "state", state);

    }

    function listInputs(inputs){
        var input = inputs.value;
        device.textContent = input.name.replace(/port.*/i, '');
            log("Input port : [ type:'" + input.type + "' id: '" + input.id + 
                    "' manufacturer: '" + input.manufacturer + "' name: '" + input.name + 
                    "' version: '" + input.version + "']");
    }

    function noteOn(midiNote, velocity){
        if (midiNote == 64) {
            reset = true;
        } else if(midiNote == 0) {
            nbPersonnes += 1
        } else if(midiNote == 1) {
            nbPersonnes += 5
        } else if(midiNote == 6) {
            nbPersonnes -= 5
        } else if(midiNote == 7) {
            nbPersonnes -= 1
        } else if(midiNote == 16) {
            nbBars += 1;
            barOuvertSong.play();
        } else if(midiNote == 17) {
            nbBars += 5;
            barOuvertSong.play();
        } else if(midiNote == 22) {
            nbBars -= 5;
            barFermeSong.play();
        } else if(midiNote == 23) {
            nbBars -= 1;
            barFermeSong.play();
        } else if(midiNote == 32) {
            ampMouvementBar += 1
        } else if(midiNote == 33) {
            ampMouvementBar += 5
        } else if(midiNote == 38) {
            ampMouvementBar -= 5
        } else if(midiNote == 39) {
            ampMouvementBar -= 1
        } else if(midiNote == 80) {
            clearMap = !clearMap
        } else if(midiNote == 96) {
            deplacementGeo =!deplacementGeo
        } else if(midiNote == 112) {
            white = !white;
            iteration = 0;
        } else if(midiNote == 113) {
            black = !black;
            iteration = 0;
        }  else if(midiNote == 119) {
            document.getElementById('white').classList.add('display');
        }
        if (nbPersonnes > 150) {
            nbPersonnes = 150;
        } else if (nbPersonnes < 0) {
            nbPersonnes = 0;
        }
        if (nbBars > 40) {
            nbBars = 40
        } else if (nbBars < 0) {
            nbBars = 0
        }
        if (ampMouvementBar > 40) {
            ampMouvementBar = 40
        } else if (ampMouvementBar < 1) {
            ampMouvementBar = 0
        }
        console.log('ON : LastTouchePressed : ',midiNote, 'pression de la touche : ', velocity);
    }

    function noteOff(midiNote, velocity){
        console.log('OFF : LastTouchePressed : ',midiNote, 'pression de la touche : ', velocity);
    }


    function onMIDIFailure(e){
        log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
    }
    
    // MIDI utility functions
    function showMIDIPorts(midiAccess){
        var inputs = midiAccess.inputs,
                outputs = midiAccess.outputs, 
                html;
        html = '<h4>MIDI Inputs:</h4><div class="info">';
        inputs.forEach(function(port){
            html += '<p>' + port.name + '<p>';
            html += '<p class="small">connection: ' + port.connection + '</p>';
            html += '<p class="small">state: ' + port.state + '</p>';
            html += '<p class="small">manufacturer: ' + port.manufacturer + '</p>';
            if(port.version){
                html += '<p class="small">version: ' + port.version + '</p>';
            }
        });
        deviceInfoInputs.innerHTML = html + '</div>';

        html = '<h4>MIDI Outputs:</h4><div class="info">';
        outputs.forEach(function(port){
            html += '<p>' + port.name + '<br>';
            html += '<p class="small">manufacturer: ' + port.manufacturer + '</p>';
            if(port.version){
                html += '<p class="small">version: ' + port.version + '</p>';
            }
        });
        deviceInfoOutputs.innerHTML = html + '</div>';
    }


    // // utility functions
    // function logger(container, label, data){
    // 	console.log('LastTouchePressed : ',data[1], 'pression de la touche : ', data[2]);
        
    // 	messages = label + " [cmd: " + (data[0] >> 4) + ", type: " + data[0] + " , note: " + data[1] + " , velocity: " + data[2] + "]";
    // 	container.textContent = messages;
    // }

})();