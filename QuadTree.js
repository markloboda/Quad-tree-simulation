export class QuadTree {

    constructor(x, y, w, h, ctx, showGrid, splitNumber, points) {
        this.divideNumber = splitNumber || 0;
        //
        // variable definitions
        //
        this.points = points || [];
        this.n = this.points.length;
        this.divided = false;
        // canvas context
        this.ctx = ctx;
        // coorinates
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.showGrid = showGrid;
        //
        // initialization 
        //
        this.outline();
        this.build();
    }

    createPoints(n) {
        for (let i = 0; i < n; i++) {
            this.addPoint(new Point(10 + Math.random() * (this.w - 20), 10 + Math.random() * (this.h - 20), this.ctx));
        }
        this.build();
    }

    outline() {
        if (this.showGrid) {
            this.ctx.beginPath();
            this.ctx.rect(this.x, this.y, this.w, this.h);
            this.ctx.stroke();
        }
    }

    build() {
        if (this.n > 4 && this.divideNumber < 5) {
            this.divide();
            this.addExistingPoints();
            this.nw.build();
            this.ne.build();
            this.se.build();
            this.sw.build();
        }
    }

    addPoint(point) {
        this.points[this.n++] = point;
    }

    addExistingPoints() {
        for (let i = 0; i < this.n; i++) {
            this.assignPoint(this.points[i]);
        }
    }

    assignPoint(point) {
        if (point.x >= this.nw.x && point.y >= this.nw.y && point.x < this.nw.x + this.nw.w && point.y < this.nw.y + this.nw.h) {
            this.nw.addPoint(point);
        } else if (point.x >= this.ne.x && point.y >= this.ne.y && point.x < this.ne.x + this.ne.w && point.y < this.ne.y + this.ne.h) {
            this.ne.addPoint(point);
        } else if (point.x >= this.se.x && point.y >= this.se.y && point.x < this.se.x + this.se.w && point.y < this.se.y + this.se.h) {
            this.se.addPoint(point);
        } else {
            this.sw.addPoint(point);
        }
    }

    divide() {
        this.divideNumber++;
        this.divided = true;
        this.nw = new QuadTree(this.x, this.y, this.w / 2, this.h / 2, this.ctx, this.showGrid,this.divideNumber);
        this.ne = new QuadTree(this.x + this.w / 2, this.y, this.w / 2, this.h / 2, this.ctx, this.showGrid, this.divideNumber);
        this.se = new QuadTree(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, this.h / 2, this.ctx, this.showGrid, this.divideNumber);
        this.sw = new QuadTree(this.x, this.y + this.h / 2, this.w / 2, this.h / 2, this.ctx, this.showGrid, this.divideNumber);
    }


    drawPoints() {
        for (let i = 0; i < this.n; i++) {
            this.points[i].draw();
        }
    }

    update() {
        let grid = document.getElementById("grid").checked;
        this.showGrid = grid;
        this.reset();
        for (let i = 0; i < this.n; i++) {
            let point = this.points[i];
            //check BOUNCE
            if (!point.bouncedX && (point.x <= 6 || point.x >= this.w - 6)) {
                point.bouncedX = true;
                point.dx = -point.dx;
            } else if (point.bouncedX) {
                point.counterX++;
                if (point.counterX > 100) {
                    point.bouncedX = false;
                    point.counterX = 0;
                }
            }
            if (!point.bouncedY && (point.y <= 6 || point.y >= this.h - 6)) {
                point.bouncedY = true;
                point.dy = -point.dy;
            } else if (point.bouncedY) {
                point.counterY++;
                if (point.counterY > 100) {
                    point.bouncedY = false;
                    point.counterY = 0;
                }
            }
            point.x += point.dx;
            point.y += point.dy;
            point.draw();
        }
        this.build();
        this.checkCollisions();
    }

    checkCollisions() {
        if (!this.divided) {
            for (let i = 0; i < this.n; i++) {
                let point1 = this.points[i];
                for (let j = i + 1; j < this.n; j++) {
                    let point2 = this.points[j];
                    if (point1.x < point2.x + 4 &&
                        point1.x + 4 > point2.x &&
                        point1.y < point2.y + 4 &&
                        point1.y + 4 > point2.y) {
                        point1.collision();
                        point2.collision();
                    } else {
                        point1.noColission();
                        point2.noColission();
                    }
                }
            }
        } else {
            this.ne.checkCollisions();
            this.nw.checkCollisions();
            this.se.checkCollisions();
            this.sw.checkCollisions();
        }
    }

    reset() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.nw = null;
        this.ne = null;
        this.se = null;
        this.sw = null;
        this.divided = false;
        this.divideNumber = 0;
        this.outline();
    }
}


class Point {
    constructor(x, y, ctx) {
        this.x = x;
        this.y = y;

        let randAngle = Math.random() * 2 * Math.PI;
        this.dx = Math.cos(randAngle) * 0.5;
        this.dy = Math.sin(randAngle) * 0.5;

        this.ctx = ctx;
        this.bouncedX = false;
        this.counterX = 0;
        this.bouncedY = false;
        this.counterY = 0;

        this.color = "grey";
        this.draw();
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x - 2, this.y - 2, 4, 4);
    }

    collision() {
        this.color = "red";
    }

    noColission() {
        this.color = "grey";
    }
}


