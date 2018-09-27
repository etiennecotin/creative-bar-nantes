

var data = getData();

var p;
var parts = [];
var r = 20;
var l = 50;
var bars = [];

var personnes = [];
var name_bar = ['Sur Mesure', 'Peter McCool', 'Buck Mulligan\'s', 'Le Perrok'];
var ouvertureBar;
var ambiance;
var decaps;
var decaps2;

function preload() {
    ouvertureBar = loadSound('ouverture-bar.mp3');
    ambiance = loadSound('bruit-ambiance.mp3');
    decaps = loadSound('decapsuler.mp3');
    decaps2 = loadSound('decapsuler-2.mp3');
}

function setup() {

    createCanvas(windowWidth, windowHeight);
    parts.push(new Particule((width / 2) + 0, (height / 2) + 0));

    for (var i = 0; i < 50; i++) {
        personnes.push(new Personnes((random(0, width)), (random(0, height))));
    }

    bars.push(new Bar((100), (300), name_bar[0]));
    bars.push(new Bar((300), (200), name_bar[1]));
    bars.push(new Bar((500), (300), name_bar[2]));
    bars.push(new Bar((700), (600), name_bar[3]));
}

function draw() {
    background(0);

    for (var i = 0; i < bars.length; i++) {
        bars[i].update();
        for (var j = 0; j < parts.length; j++) {
            parts[j].update();
            // console.log(parts[j].pos.dist(bars[i].pos));
            if (dist(bars[i].pos.x, bars[i].pos.y, parts[j].pos.x, parts[j].pos.y) < 50) {
                bars[i].inside();
            } else {
                bars[i].outside();
            }
        }
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

        this.pos = createVector(x, y);
        this.song = 0;
        this.ambiance = loadSound('bruit-ambiance.mp3');
        this.ouvertureBar = loadSound('ouverture-bar.mp3');
        this.decaps2 = loadSound('decapsuler-2.mp3');
        this.decaps = loadSound('decapsuler.mp3');
        this.text = name;
    }
    update() {
        push();
        textAlign(CENTER);
        textSize(20);
        fill(0, 102, 153);
        text(this.text, this.pos.x+50, this.pos.y-10);
        pop();
        rect(this.pos.x, this.pos.y, l, l);
        
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
        rect(this.pos.x, this.pos.y, l, l);
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
        rect(this.pos.x, this.pos.y, l, l);
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