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
var music = ['Alan Walker - Fade.mp3', 'Cartoon - On  On.mp3', 'DEAF KEV - Invincible.mp3', 'Fatal Bazooka feat. Vitoo.mp3', 'GALA - Freed from desire.mp3', 'Jain - Alright.mp3', 'Le Wanski - Bella Ciao.mp3', 'Lost Temple - Panda Dub.mp3', 'Martin Garrix  Brooks - Like I Do.mp3', 'MC Fioti - Bum Bum Tam Tam.mp3', 'OrelSan - San.mp3', 'White Town - Your Woman.mp3'];
var ouvertureBar;
var ambiance;
var decaps;
var decaps2;
var reset = false;

var nbParticules = 150;

var heures = 18;
var minutes = 0;

var nuit = false;

// var vitTemps = 333.332;
var vitTemps = 150.332;

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

// var favoriteBar;

var nbPersonnes = 1;
var nbBars = 5;

var barOuvertSong;
var barFermeSong;

var nbBarsBefore;

socket.on('nbParticules', function(val){
    nbPersonnes = val;
});
socket.on('nbBars', function(val){
    nbBarsBefore = nbBars;
    nbBars = val;
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


/*if(ouvert==false){
        barOuvertSong.play();
            ouvert=true;
        }*/


function preload() {
    // ouvertureBar = loadSound('ouverture-bar.mp3');
    // ambiance = loadSound('bruit-ambiance.mp3');
    // decaps = loadSound('decapsuler.mp3');
    // decaps2 = loadSound('decapsuler-2.mp3');
    // leWanski = loadSound('zik/Le Wanski - Bella Ciao.mp3');

    song = loadSound('zik/Le Wanski - Bella Ciao.mp3');
    // song = loadSound('rone-bye-bye_macadam.mp3');
    
    barOuvertSong = loadSound('ouverture-bar.mp3');
    barFermeSong = loadSound('close.mp3');

    fft = new p5.FFT();
    peakDetect = new p5.PeakDetect();
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
                bars.push(new Bar(lat, lng, name));
            } else {
                bars.push(new Bar(lat, lng, name));
            }
        })
    });


    setInterval(chrono, vitTemps);
}

function draw() {
    // background(0);
    clear();
    if(nuit==false){
        changerMap();
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
        }

        if (bars[i].coor.x != -100 && bars[i].coor.y != -100){
            if (dist(bars[i].coor.x, bars[i].coor.y, parts[0].pos.x, parts[0].pos.y) < bars[i].l/1.5) {
                bars[i].inside();
            } else {
                bars[i].outside();
            }
            for (let o = 0; o < personnes.length; o++) {
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
            bars[igros].bigger();
            // console.log('Bar le plus gros :', igros, ' = ', bars[igros].text ,' avec', gros, 'personnes !');
        }
    }

    for (let i = 0; i < personnes.length; i++) {
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

function changerMap(){
    var jour = heures + minutes/60;

    if(jour>19){
        push();
        fill('rgba(0,0,0, 0.75)')
        rect(width/2, height/2, width, height);
        pop();
        // let mappa = new Mappa('Leaflet');
        // options.style = "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}{r}.png";
        // myMap = mappa.tileMap(options);
        // myMap.overlay(canvas);
        myMap.tiles._url = "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}{r}.png";
        myMap.tiles._tileZoom = 16;
        myMap.options.style = "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}{r}.png";
        myMap.options.zoom = 16;
        nuit=true;
    }
}