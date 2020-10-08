class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point) {
        return (point.x >= this.x - this.w
            && point.x <= this.x + this.w
            && point.y >= this.y - this.h
            && point.y <= this.y + this.h)
    }

    intersectRect(range) {
        if (this.x + this.w < range.x - range.w) return false;
        if (range.x + range.w < this.x - this.w) return false;
        if (this.y + this.h < range.y - range.h) return false;
        if (range.y + range.h < this.y - this.h) return false;
        return true;
    }

    intersectCircle(circle) {
        const nearestX = Math.max(this.x - this.w, Math.min(circle.x, this.x + this.w))
        const nearestY = Math.max(this.y - this.h, Math.min(circle.y, this.y + this.h))
        return circle.contains(new Point(nearestX, nearestY))
    }
}

class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    contains(point) {
        const deltaX = this.x - point.x;
        const deltaY = this.y - point.y;
        return (deltaX * deltaX + deltaY * deltaY <= this.r * this.r)
    }
}

class Quadtree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = []
        this.divided = false;
    }

    subDivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        let topRight = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
        this.topRight = new Quadtree(topRight, this.capacity);

        let topLeft = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
        this.topLeft = new Quadtree(topLeft, this.capacity);

        let bottomRight = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
        this.bottomRight = new Quadtree(bottomRight, this.capacity);

        let bottomLeft = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
        this.bottomLeft = new Quadtree(bottomLeft, this.capacity);

        this.divided = true;
    }

    insert(point) {
        if (!this.boundary.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subDivide();
            }
            if (this.topLeft.insert(point)) return true;
            if (this.topRight.insert(point)) return true;
            if (this.bottomLeft.insert(point)) return true;
            if (this.bottomRight.insert(point)) return true;
        }
        return false;
    }

    show() {
        stroke(255);
        strokeWeight(1);
        noFill();
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.h * 2, this.boundary.w * 2);
        if (this.divided) {
            this.topRight.show();
            this.topLeft.show();
            this.bottomRight.show();
            this.bottomLeft.show();
        }

        for (let p of this.points) {
            strokeWeight(4);
            point(p.x, p.y);
        }
    }

    queryRect(range, res) {
        if (!this.boundary.intersectRect(range)) {
            return res;
        } else {
            for(let p of this.points) {
                if (range.contains(p)) {
                    res.push(p);
                }
            }

            if (this.divided) {
                this.topLeft.queryRect(range, res);
                this.topRight.queryRect(range, res);
                this.bottomLeft.queryRect(range, res);
                this.bottomRight.queryRect(range, res);
            }

            return res;
        }
    }

    queryCircle(circle, res) {
        if (!this.boundary.intersectCircle(circle)) {
            return res;
        } else {
            for(let p of this.points) {
                if (circle.contains(p)) {
                    res.push(p);
                }
            }

            if (this.divided) {
                this.topLeft.queryCircle(circle, res);
                this.topRight.queryCircle(circle, res);
                this.bottomLeft.queryCircle(circle, res);
                this.bottomRight.queryCircle(circle, res);
            }

            return res;
        }
    }
}
