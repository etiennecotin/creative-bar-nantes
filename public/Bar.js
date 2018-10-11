// "use strict";

// export default class Bar {
class Bar {
    constructor(x, y, name) {

        this.pos = {
            'x': x,
            'y': y
        };
        // this.pos = createVector(x, y);
        this.coor = myMap.latLngToPixel(this.pos.x, this.pos.y);
        this.song = 0;
        this.ambiance = loadSound('bruit-ambiance.mp3');
        this.ouvertureBar = loadSound('ouverture-bar.mp3');
        this.decaps2 = loadSound('decapsuler-2.mp3');
        this.decaps = loadSound('decapsuler.mp3');        
        this.nbPersonne = [];
        this.maxPerson = random(50, 100);
        this.text = name;
        this.l = l;
        this.r = random(0, 255)
        this.g = random(0, 255)
        this.b = random(0, 255)
    }
    update() {
        this.coor = myMap.latLngToPixel(this.pos.x, this.pos.y);
        push();
        textAlign(CENTER);
        textSize(10);
        fill(0, 102, 153);
        text(this.text, this.coor.x + 0, this.coor.y - 10);
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
            this.ouvertureBar.play();
            this.ambiance.play();
            this.ambiance.setVolume(0.5);
        } else if(this.song%1450 == 0) {
            this.ambiance.play();
        } else if(this.song%150 == 0) {
            var decaps_switch = Math.round(random(0, 10));

            if (decaps_switch%2 == 0) {
                this.decaps.play();
            } else {
                this.decaps2.play();
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
        this.ambiance.stop();
        this.ouvertureBar.stop();
        this.decaps.stop();
        this.decaps2.stop();
        fill('#fff');
        // rect(this.pos.x, this.pos.y, this.l, this.l);
        pop();
    }
    bigger() {
        push();
        fill(this.r, this.g, this.b);
        colorR = this.r;
        colorG = this.g;
        colorB = this.b;
        rect(this.coor.x, this.coor.y, this.l+rms*ampMouvementBar, this.l+rms*ampMouvementBar);
        // this.music.play();
        pop();
    }
    lower() {
        push();
        fill('white')
        pop();
    }

    entrer(bar, personne) {

        if (!bar.nbPersonne.includes(personne)) {
            bar.nbPersonne.push(personne)
            personne.vit = createVector(0, 0);
            personne.dance(bar)
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

// export default Bar;