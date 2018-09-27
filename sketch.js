

var data = getData();

var p;
var parts = [];
var r = 20;
var l = 50;
var bars = [];

var personnes = [];
var ouvertureBar;
var ambiance;
var decaps;
var decaps2;



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
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
};

function preload() {
    ouvertureBar = loadSound('ouverture-bar.mp3');
    ambiance = loadSound('bruit-ambiance.mp3');
    decaps = loadSound('decapsuler.mp3');
    decaps2 = loadSound('decapsuler-2.mp3');
}

function setup() {

    canvas = createCanvas(windowWidth, windowHeight);

    myMap = mappa.tileMap(options);
    myMap.overlay(canvas);

    parts.push(new Particule((width / 2) + 0, (height / 2) + 0));

    for (var i = 0; i < 50; i++) {
        personnes.push(new Personnes((random(0, width)), (random(0, height))));
    }
    data.then(function(dataResult) {
        dataResult.results.forEach(function (element) {
            let lat = parseFloat(element.geometry.location.lat);
            let lng = parseFloat(element.geometry.location.lng);
            let name = element.name;
            bars.push(new Bar(lat, lng, name));
        })
    });
}

function draw() {
    // background(0);
    clear();


    for (var i = 0; i < bars.length; i++) {
        bars[i].update();
        // for (var j = 0; j < parts.length; j++) {
            parts[0].update();
            // console.log(parts[j].pos.dist(bars[i].pos));
            if (dist(bars[i].coor.x, bars[i].coor.y, parts[0].pos.x, parts[0].pos.y) < 50) {
                bars[i].inside();
            } else {
                bars[i].outside();
            }
        // }
    }


    for (var i = 0; i < personnes.length; i++) {
        personnes[i].update();
    }

    for (var i = 0; i < personnes.length; i++) {
        personnes[i].draw();
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

  class Bar{
    constructor(x , y, name) {

        this.pos = {
            'x' : x,
            'y' : y
        }
        // this.pos = createVector(x, y);
        this.coor = myMap.latLngToPixel(this.pos.x, this.pos.y);
        this.song = 0;
        this.ambiance = loadSound('bruit-ambiance.mp3');
        this.ouvertureBar = loadSound('ouverture-bar.mp3');
        this.decaps2 = loadSound('decapsuler-2.mp3');
        this.decaps = loadSound('decapsuler.mp3');
        this.text = name;
    }
    update() {
        this.coor = myMap.latLngToPixel(this.pos.x, this.pos.y);
        push();
        textAlign(CENTER);
        textSize(20);
        fill(0, 102, 153);
        text(this.text, this.coor.x+50, this.coor.y-10);
        pop();
        rect(this.coor.x, this.coor.y, 20, 20);
        
    }
    inside() {
        push();
        this.song += 1;
        // console.log('song', this.song);
        
        if (this.song == 1) {
            this.ouvertureBar.play();
            this.ambiance.play();
            this.ambiance.setVolume(0.5);
        } else if(this.song%1450 == 0) {
            this.ambiance.play();
        } else if(this.song%150 == 0) {
            var decaps_switch = Math.round(random(0, 10));
            console.log(decaps_switch);
            
            if (decaps_switch%2 == 0) {
                this.decaps.play();
            } else {
                this.decaps2.play();
            }
        }
        
        fill('#fae');
        rect(this.coor.x, this.coor.y, l, l);
        pop();
    }
    outside() {
        push();
        this.song = 0;
        this.ambiance.stop();
        this.ouvertureBar.stop();
        this.decaps.stop();
        this.decaps2.stop();
        fill('#fff');
        rect(this.coor.x, this.coor.y, l, l);
        pop();
    }
  }


class Personnes {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vit = createVector(random(-2, 2), random(-2, 2));
        while(this.vit.mag()<1){
            this.vit = createVector(random(-2, 2), random(-2, 2));
        }
        //this.vit = createVector(0, 0);
    }

    update() {
        this.pos.add(this.vit);

        if ((this.pos.x > width) || (this.pos.x < 0)) {
            this.vit.x = -this.vit.x;
        }
        if ((this.pos.y > height) || (this.pos.y < 0)) {
            this.vit.y = -this.vit.y;
        }
    }

    draw() {
        push();
        translate(this.pos * random(0.1, 0.7));

        ellipse(this.pos.x, this.pos.y, r);

        pop();
    }
}


function doubleClicked() {

}

function mouseReleased() {

}