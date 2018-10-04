

var data = getData();

var p;
var parts = [];
var r = 5;
var l = 15;
var bars = [];

var personnes = [];
var music = ['Alan Walker - Fade.mp3', 'Cartoon - On  On.mp3', 'DEAF KEV - Invincible.mp3', 'Fatal Bazooka feat. Vitoo.mp3','GALA - Freed from desire.mp3','Jain - Alright.mp3','Le Wanski - Bella Ciao.mp3','Lost Temple - Panda Dub.mp3','Martin Garrix  Brooks - Like I Do.mp3','MC Fioti - Bum Bum Tam Tam.mp3','OrelSan - San.mp3','White Town - Your Woman.mp3'];
var ouvertureBar;
var ambiance;
var decaps;
var decaps2;

var nbParticules = 100;



// Create a new Mappa instance.
// var mappa = new Mappa('Map-Provider', key);
let myMap;
let canvas;
// Create a new Mappa instance using Leaflet.
const mappa = new Mappa('Leaflet');
const options = {
    lat: 47.212305,
    lng: -1.555840,
    zoom: 16,
    style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}{r}.png"
};

var favoriteBar;

var mapBorder = [];

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

    if (myMap.map){
        mapBorder = myMap.map.getBounds();
    }



    data.then(function(dataResult) {
        dataResult.results.forEach(function (element, index) {
            let lat = parseFloat(element.geometry.location.lat);
            let lng = parseFloat(element.geometry.location.lng);
            let name = element.name;
            // bars.push(new Bar(lat, lng, name, music[index]));
            if (index > music.length-1){
                bars.push(new Bar(lat, lng, name, random(0, music.length)));
            } else {
                bars.push(new Bar(lat, lng, name, index));
            }
        })
    })

    for (var i = 0; i < nbParticules; i++) {
        if (mapBorder._southWest && mapBorder._northEast){
            let minLat = mapBorder._southWest.lat;
            let maxLat = mapBorder._northEast.lat;
            let minLng = mapBorder._southWest.lng;
            let maxLng = mapBorder._northEast.lng;

            personnes.push(new Personnes(random(minLat, maxLat), random(minLng, maxLng)));
        }else {
            personnes.push(new Personnes(options.lat, options.lng));
        }
    }
}

function playFavoriteBar(favoriteBar) {

    if (favoriteBar != bars[0]){

        leWanski.play()
    }
}


function draw() {
    // background(0);
    clear();

    if (myMap.map){
        mapBorder = myMap.map.getBounds();
    }


    for (let i = 0; i < bars.length; i++) {
        bars[i].update();
        parts[0].update();
        // console.log(parts[j].pos.dist(bars[i].pos));
        if (dist(bars[i].coor.x, bars[i].coor.y, parts[0].pos.x, parts[0].pos.y) < bars[i].l/1.5) {
            bars[i].inside();
        } else {
            bars[i].outside();
        }
        for (let o = 0; o < personnes.length; o++) {
            // personnes[o].update();
            if (dist(bars[i].coor.x, bars[i].coor.y, personnes[o].pos.x, personnes[o].pos.y) < bars[i].l/1.5) {
                bars[i].entrer(bars[i], personnes[o]);
                // console.log(bars[i].nbPersonne)
            } else {
                bars[i].sortir();
            }
        }
    }

    for (let i = 0; i < personnes.length; i++) {
        personnes[i].update();
        personnes[i].draw();
    }

    getFavoriteBar(bars);
    playFavoriteBar(favoriteBar);
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

  class Bar{
    constructor(x , y, name, music) {

        this.pos = {
            'x' : x,
            'y' : y
        };
        // this.pos = createVector(x, y);
        this.coor = myMap.latLngToPixel(this.pos.x, this.pos.y);
        this.song = 0;
        // this.ambiance = loadSound('bruit-ambiance.mp3');
        // this.ouvertureBar = loadSound('ouverture-bar.mp3');
        // this.decaps2 = loadSound('decapsuler-2.mp3');
        // this.decaps = loadSound('decapsuler.mp3');
        // this.music = loadSound(music);
        this.music = music;
        this.nbPersonne = [];
        this.maxPerson = random(50, 100);
        this.text = name;
        this.l = l;
        this.maxl = random(50, 100);
    }
    update() {
        this.coor = myMap.latLngToPixel(this.pos.x, this.pos.y);
        push();
            textAlign(CENTER);
            textSize(15);
            fill(0, 102, 153);
            text(this.text, this.coor.x+50, this.coor.y-10);
        pop();
        push();
            rect(this.coor.x, this.coor.y, this.l, this.l);
        pop();

        // rect(this.pos.x, this.pos.y, this.l, this.l);
    }
    inside() {
        push();
            this.song += 1;
            // console.log('song', this.song);
            if (this.song == 1) {
                // this.ouvertureBar.play();
                // this.ambiance.play();
                // this.ambiance.setVolume(0.5);
            } else if(this.song%1450 == 0) {
                // this.ambiance.play();
            } else if(this.song%150 == 0) {
                var decaps_switch = Math.round(random(0, 10));

                if (decaps_switch%2 == 0) {
                    // this.decaps.play();
                } else {
                    // this.decaps2.play();
                }
            }

            fill('#fae');
            rect(this.coor.x, this.coor.y, this.l, this.l);
        pop();
    }
    outside() {
        push();
            this.song = 0;
            // this.ambiance.stop();
            // this.ouvertureBar.stop();
            // this.decaps.stop();
            // this.decaps2.stop();
            fill('#fff');
            // rect(this.pos.x, this.pos.y, this.l, this.l);
        pop();
    }
    bigger() {
        this.music.play();
    }
      
    entrer(bar, personne){

        if (!bar.nbPersonne.includes(personne)) {
            bar.nbPersonne.push(personne)
            // personne.vit = createVector(0, 0);
            this.l++;
        }
    }

    sortir(){
    //     push();
    //         fill('#fff');
    //         rect(this.pos.x, this.pos.y, this.l, this.l);
    //     pop();
    }
  }


class Personnes {
    constructor(x, y) {
        this.initpos = {
            'x' :  x,
            'y' :  y
        };
        // this.initpos = createVector(x, y);
        // console.log(this.initpos)
        this.coor = myMap.latLngToPixel(this.initpos.x,  this.initpos.y);
        this.pos = createVector(this.coor.x, this.coor.y);
        this.vit = createVector(random(-2, 2), random(-2, 2));
        this.inBar = false;
        while(this.vit.mag()<1){
            this.vit = createVector(random(-2, 2), random(-2, 2));
        }
        //this.vit = createVector(0, 0);
    }

    update() {
        let coor = myMap.latLngToPixel(this.initpos.x,  this.initpos.y);
        if (coor.x != -100 && coor.y != -100){
            this.coor = myMap.latLngToPixel(this.initpos.x,  this.initpos.y);

            // console.log(createVector(this.coor.x, this.coor.y));
            // console.log(createVector(this.coor.x, this.coor.y).add(this.vit));

            this.pos = createVector(this.coor.x, this.coor.y).add(this.vit);
            // console.log(this.coor.x)
            // this.coor.x += this.vit.x;
            // this.coor.y += this.vit.y;
            // console.log(this.coor.x)

            // // console.log(this.pos);
            // // console.log(myMap.pixelToLatLng(this.pos.x,  this.pos.y));
            let px = myMap.pixelToLatLng(this.pos.x,  this.pos.y);

            this.initpos.x = px.lat;
            this.initpos.y = px.lng;
        }



        // this.initpos.add(this.vit);
        // this.coor = myMap.latLngToPixel(this.initpos.x, this.initpos.y);
        // this.pos = createVector(this.coor.x, this.coor.y);



        // this.coor = myMap.latLngToPixel(this.pos.x, this.pos.y);

        if ((this.pos.x > width) || (this.pos.x < 0)) {
            this.vit.x = -this.vit.x;
        }
        if ((this.pos.y > height) || (this.pos.y < 0)) {
            this.vit.y = -this.vit.y;
        }
    }

    inside(bar) {

    }

    draw() {
        push();
        // translate(this.pos * random(0.1, 0.7));

        ellipse(this.pos.x, this.pos.y, r);

        pop();
    }
}

function getFavoriteBar(bars) {
    
    bars.sort(compare)

    favoriteBar =  bars[0];
}

function compare(a,b) {
    if (a.nbPersonne.length < b.nbPersonne.length)
        return -1;
    if (a.nbPersonne.length > b.nbPersonne.length)
        return 1;
    return 0;
}

function doubleClicked() {

}

function mouseReleased() {

}