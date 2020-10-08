let tree = new Quadtree(new Rectangle(400, 400, 400, 400), 4)

function setup() {
    createCanvas(800, 800);
    background(255);
    rectMode(CENTER);

    for(let i = 0; i < 500; i++) {
        let p = new Point(random(width), random(height));
        tree.insert(p);
    }
    background(0);
    tree.show();
}


let points = [];

function draw() {
    rectMode(CENTER);
    if (mouseIsPressed) {
        stroke(0, 255, 0);
        // let range = new Rectangle(mouseX, mouseY, 130, 130);
        // rect(range.x, range.y, range.w * 2, range.h * 2);
        strokeWeight(1);
        let myCircle = new Circle(mouseX, mouseY, 100);
        circle(myCircle.x, myCircle.y, myCircle.r * 2);

        points = [];
        points = tree.queryCircle(myCircle, points);
        for(let p of points) {
            strokeWeight(4);
            point(p.x, p.y);
        }
    }
}
