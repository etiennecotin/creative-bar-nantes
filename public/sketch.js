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

var nbParticules = 50;

var heures = 8;
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
    zoom: 16,
    //style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}{r}.png"
    style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
};

// var favoriteBar;

var nbParticules2 = 1;
var nbBars = 1;

socket.on('nbParticules', function(val){
    nbParticules2 = val;
});
socket.on('nbBars', function(val){
    nbBars = val;
});


function preload() {
    // ouvertureBar = loadSound('ouverture-bar.mp3');
    // ambiance = loadSound('bruit-ambiance.mp3');
    // decaps = loadSound('decapsuler.mp3');
    // decaps2 = loadSound('decapsuler-2.mp3');
    // leWanski = loadSound('zik/Le Wanski - Bella Ciao.mp3');
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
                bars.push(new Bar(lat, lng, name, random(0, music.length)));
            } else {
                bars.push(new Bar(lat, lng, name, index));
            }
        })
    });


    setInterval(chrono, vitTemps);
}

function draw() {
    // background(0);
    clear();

    // if (myMap.map){
    //     mapBorder = myMap.map.getBounds();
    // }


    for (let i = 0; i < bars.length; i++) {
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

    if(nuit==false){
        changerMap();
    }
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
        options.style = "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}{r}.png";
        myMap = mappa.tileMap(options);
        myMap.overlay(canvas);
        nuit=true;
    }
}