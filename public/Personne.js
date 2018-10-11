
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
        // while(this.vit.mag()<1){
        //     this.vit = createVector(random(-2, 2), random(-2, 2));
        // }
    }

    update() {
        push();

        pop();
        let coor = myMap.latLngToPixel(this.initpos.x,  this.initpos.y);
        if (coor.x != -100 && coor.y != -100){
            this.coor = myMap.latLngToPixel(this.initpos.x,  this.initpos.y);
            this.pos = createVector(this.coor.x, this.coor.y).add(this.vit);
            let px = myMap.pixelToLatLng(this.pos.x,  this.pos.y);
            this.initpos.x = px.lat;
            this.initpos.y = px.lng;
        }

        if ((this.pos.x >= width) || (this.pos.x <= 0)) {
            this.vit.x = -this.vit.x;
        }
        if ((this.coor.y >= height) || (this.coor.y <= 0)) {
            this.vit.y = -this.vit.y;
        }
    }

    dance(bar) {
        if ((this.pos.x > bar.pos.x+(bar.l/2)) || (this.pos.x < bar.pos.x-(bar.l/2))) {
            this.vit.x = -this.vit.x;
        }
        if ((this.pos.y > bar.pos.y+(bar.l/2)) || (this.pos.y < bar.pos.y-(bar.l/2))) {
            this.vit.y = -this.vit.y;
        }
    }

    draw() {
        push();
        translate(this.pos * random(0.1, 0.7));

        let coor = myMap.latLngToPixel(this.initpos.x,  this.initpos.y);
        if (coor.x != -100 && coor.y != -100){
            fill(colorR, colorG, colorB);
            ellipse(this.pos.x, this.pos.y, r);
        }
        pop();
    }
    outside() {
        push();
        this.color = 255;
        fill(this.color);
        this.vit = createVector(random(-5, 5), random(-5, 5));
        this.inside = false;
        pop();
    }
}