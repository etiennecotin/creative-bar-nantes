var p;
var parts = [];
var r = 20;
var l = 50;
var bars = [];
var personnes = [];
var son;

function preload() {
    son = loadSound('ouverture-bar.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    parts.push(new Particule((width / 2) + 0, (height / 2) + 0));
    parts.push(new Particule((width / 2) + r, (height / 2) + r));
    parts.push(new Particule((width / 2) - r, (height / 2) - r));
    parts.push(new Particule((width / 2) + r, (height / 2) - r));
    parts.push(new Particule((width / 2) - r, (height / 2) + r));

    for (var i = 0; i < 50; i++) {
        personnes.push(new Personnes((random(0, width)), (random(0, height))));
    }

    bars.push(new Bar((100), (300)));
    bars.push(new Bar((300), (200)));
    bars.push(new Bar((500), (300)));
    bars.push(new Bar((700), (600)));
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
        // if(mouseIsPressed) {
        this.mouse = createVector(mouseX, mouseY);
        this.vit = this.mouse.sub(this.pos).div(50);
        // }
        ellipse(this.pos.x, this.pos.y, r);
        pop();
    }
    draw() {

        // ellipse(this.pos.x, this.pos.y, 50);
        // ellipse(this.pos.x, this.pos.y, 30);
    }

}

class Bar {
    constructor(x, y) {
        this.pos = createVector(x, y);
    }
    update() {
        rect(this.pos.x, this.pos.y, l, l);

    }
    inside() {
        son.play();
        push();
        fill('#fae');
        rect(this.pos.x, this.pos.y, l, l);
        pop();
    }
    outside() {
        push();
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