var p;
var parts = [];
var r = 20;
var l = 50;
var bars = [];
var son;
function preload() {
    son = loadSound('ouverture-bar.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  parts.push(new Particule((width/2)+0, (height/2)+0));

  bars.push(new Bar((100), (300)))
  bars.push(new Bar((300), (200)))
  bars.push(new Bar((500), (300)))
  bars.push(new Bar((700), (600)))
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
    
}

  class Particule{
    constructor(x , y) {
        this.pos = createVector(x, y);
        this.vit = createVector(0,0);
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

  class Bar{
    constructor(x , y) {
        this.pos = createVector(x, y);
        this.song = 0;
    }
    update() {
        rect(this.pos.x, this.pos.y, l, l);
    }
    inside() {
        this.song += 1;
        console.log('song', this.song);
        
        if (this.song == 1) {
            son.play();
        }
        push();
        fill('#fae');
        rect(this.pos.x, this.pos.y, l, l);
        pop();
    }
    outside() {
        this.song = 0;
        push();
        fill('#fff');
        rect(this.pos.x, this.pos.y, l, l);
        pop();
    }
  }