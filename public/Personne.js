
class Personnes {
    constructor(x, y) {

        this.initpos = {
            'x' :  x,
            'y' :  y
        };
        this.coor = myMap.latLngToPixel(this.initpos.x,  this.initpos.y);
        this.pos = createVector(this.coor.x, this.coor.y);
        this.vit = createVector(random(-1,1), random(-1, 1));
        this.color = 255;
        this.inside = false;
        this.acc = createVector(random() * 0.1, random() * 0.1);
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
            if (!this.inside) {
                this.vit.add(this.acc);
            }
            this.pos = createVector(this.coor.x, this.coor.y).add(this.vit);
            let px = myMap.pixelToLatLng(this.pos.x,  this.pos.y);
            this.initpos.x = px.lat;
            this.initpos.y = px.lng;
        }


        if ((this.pos.x >= width-50) || (this.pos.x <= 50)) {
            let acc = createVector(width/2 , height/2).sub(this.pos).setMag(0.1);
            // let acc = createVector(-(this.pos.x - width/2) / 100 , -(this.pos.y - height/2) / 100 );
            this.vit.add(acc)
            // this.vit.x = -this.vit.x;
        }
        if ((this.coor.y >= height - 50) || (this.coor.y <= 50)) {
            let acc = createVector(width/2 , height/2).sub(this.pos).setMag(0.1);
            // let acc = createVector(-(this.pos.x - width/2) / 100 , -(this.pos.y - height/2) / 100 );
            this.vit.add(acc)
            // this.vit.y = -this.vit.y;
        }

        if ((frameCount % 50) == 0) {
            this.acc = createVector(random() * 0.5 - 0.25, random() * 0.5 - 0.25).setMag(0.1);
        }

        if (deplacementGeo){
            this.vit.x = min(max(this.vit.x, -1), 1);
            this.vit.y = min(max(this.vit.y, -1), 1);
        } else {
            if (this.vit.mag() > 2 ){
                this.vit.setMag(1.95);
            }
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