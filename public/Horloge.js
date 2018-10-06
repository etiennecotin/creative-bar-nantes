
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