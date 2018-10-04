var data = getData();

var p;
var parts = [];
var r = 5;
var l = 15;
var bars = [];
var gros = 0;
var igros;

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


// Create a new Mappa instance.
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

// var mapBorder = [];

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

    setInterval(chrono, 333.332);
}

function playFavoriteBar(favoriteBar) {

    if (favoriteBar != bars[0]) {

        leWanski.play()
    }
}

function draw() {
    // background(0);
    clear();


    for (let i = 0; i < bars.length; i++) {
        bars[i].update();
        parts[0].update();

        if (reset) {
            bars[i].l = 15;
            bars[i].nbPersonne = [];
            igros = undefined;
            gros = 0;
        }
        if (bars[i].nbPersonne.length > gros) {
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
                if (dist(bars[i].coor.x, bars[i].coor.y, personnes[o].pos.x, personnes[o].pos.y) < bars[i].l/1.5) {
                    bars[i].entrer(bars[i], personnes[o]);
                } else {
                    bars[i].outside();
                }
                for (let o = 0; o < personnes.length; o++) {
                    // personnes[o].update();
                    if (dist(bars[i].coor.x, bars[i].coor.y, personnes[o].pos.x, personnes[o].pos.y) < bars[i].l/1.5) {

                        bars[i].entrer(bars[i], personnes[o]);
                    } else {
                        bars[i].sortir();
                    }
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

    getFavoriteBar(bars);
    playFavoriteBar(favoriteBar);

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

class Bar {
    constructor(x, y, name, music) {

        this.pos = {
            'x': x,
            'y': y
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
    }
    update() {
        this.coor = myMap.latLngToPixel(this.pos.x, this.pos.y);
        push();
        textAlign(CENTER);
        textSize(15);
        fill(0, 102, 153);
        text(this.text, this.coor.x + 50, this.coor.y - 10);
        pop();
        push();
            if (this.coor.x != -100 && this.coor.y != -100) {
                // console.log(this.coor.x);
                rect(this.coor.x, this.coor.y, this.l, this.l);
            }
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
        // }

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
        push();
        fill('red');
        rect(this.coor.x, this.coor.y, this.l, this.l);
        // this.music.play();
        pop();
    }

    entrer(bar, personne) {

        if (!bar.nbPersonne.includes(personne)) {
            bar.nbPersonne.push(personne)
            personne.vit = createVector(0, 0);
            personne.color = 0;
            personne.inside = true;
            this.l++;
            if (this.l > this.maxPerson) {
                this.l = this.maxPerson
            }
        }
    }

    sortir() {
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
        this.coor = myMap.latLngToPixel(this.initpos.x,  this.initpos.y);
        this.pos = createVector(this.coor.x, this.coor.y);
        this.vit = createVector(random(-5,5), random(-5, 5));
        this.color = 255;
        this.inside = false;
        while(this.vit.mag()<1){
            this.vit = createVector(random(-2, 2), random(-2, 2));
        }
    }

    update() {
        let coor = myMap.latLngToPixel(this.initpos.x,  this.initpos.y);
        if (coor.x != -100 && coor.y != -100){
            this.coor = myMap.latLngToPixel(this.initpos.x,  this.initpos.y);
            this.pos = createVector(this.coor.x, this.coor.y).add(this.vit);
            let px = myMap.pixelToLatLng(this.pos.x,  this.pos.y);
            this.initpos.x = px.lat;
            this.initpos.y = px.lng;
        }

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
            translate(this.pos * random(0.1, 0.7));

            let coor = myMap.latLngToPixel(this.initpos.x,  this.initpos.y);
            if (coor.x != -100 && coor.y != -100){
                fill(this.color);
                ellipse(this.pos.x, this.pos.y, r);
            }
        pop();
    }
    outside() {
        push();
            this.color = 255;
            fill(this.color);
            this.vit = createVector(random(-2, 2), random(-2, 2));
        pop();
    }
}

class Horloge {
    constructor(x, y) {
        push();
        strokeWeight(2);
        translate(125, 125);

        var radius = 100;
        var numPoints = 60;
        var angle = TWO_PI / numPoints;

        var secondsRadius = radius * 0.72;
        var minutesRadius = radius * 0.60;
        var hoursRadius = radius * 0.50;
        var clockDiameter = radius * 1.8;
        this.heures = heures;
        this.minutes = minutes;

        fill(80);
        noStroke();
        ellipse(0, 0, clockDiameter, clockDiameter);

        var m = map(this.minutes + norm(0, 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
        var h = map(this.heures + norm(this.minutes, 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;

        strokeWeight(2);
        stroke(255);
        beginShape(POINTS);
        var i = 0;
        while (i < numPoints) {
            x = cos(angle * i) * secondsRadius;
            y = sin(angle * i) * secondsRadius;
            vertex(x, y);
            i++;
        }
        endShape();


        strokeWeight(2);
        line(0, 0, cos(m) * minutesRadius, sin(m) * minutesRadius);
        strokeWeight(4);
        line(0, 0, cos(h) * hoursRadius, sin(h) * hoursRadius);

        fill(255);
        textSize(10);
        strokeWeight(0.1);

        x = cos(PI + HALF_PI) * secondsRadius - 5;
        y = sin(PI + HALF_PI) * secondsRadius - 6;
        text("12", x, y);

        x = cos(TWO_PI) * secondsRadius + 7;
        y = sin(TWO_PI) * secondsRadius + 6;
        text("3", x, y);

        x = cos(HALF_PI) * secondsRadius - 3;
        y = sin(HALF_PI) * secondsRadius + 15;
        text("6", x, y);

        x = cos(PI) * secondsRadius - 13;
        y = sin(PI) * secondsRadius + 5;
        text("9", x, y);
        pop();
    }
}

function getFavoriteBar(bars) {

    bars.sort(compare)

    favoriteBar = bars[0];
}

function compare(a, b) {
    if (a.nbPersonne.length < b.nbPersonne.length)
        return -1;
    if (a.nbPersonne.length > b.nbPersonne.length)
        return 1;
    return 0;
}

function doubleClicked() {

}

function mouseReleased() {
    reset = true;
}

function chrono() {
    this.minutes++;
}