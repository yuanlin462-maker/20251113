let objs = [];
let rects = [];
let colors = ['#ffffff', '#232323'];
let bgCol;
let fillCol;

function setup() {
	// 全螢幕畫布
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	bgCol = random(colors);
	startLifeAgain();
}

function draw() {
	// 將畫布背景改為白色；移除覆蓋整個畫布的矩形繪製
	background(255);
	for (let i of objs) {
		i.run();
	}

	if (frameCount % 180 == 0) {
		bgCol = fillCol;
		startLifeAgain();
	}
}

function windowResized() {
	// 視窗尺寸改變時重新調整畫布與動畫配置
	resizeCanvas(windowWidth, windowHeight);
	startLifeAgain();
}

function startLifeAgain() {
	objs = [];
	rects = [];
	fillCol = random(colors);
	while (bgCol == fillCol) {
		fillCol = random(colors);
	}
	divideRect(0, 0, width, height, 40);
	for (let i of rects) {
		let d = dist(width / 2, height / 2, i.x, i.y);
		let t = -int(d / 5);
		objs.push(new FoldingRect(i.x, i.y, i.w, i.h, t));
	}
}

function easeInOutQuart(x) {
	return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

function divideRect(x, y, w, h, min) {
	if (w > min && h > min) {
		if (w >= h) {
			let rndw = random(0.1, 0.9) * w;
			divideRect(x, y, rndw, h, min);
			divideRect(x + rndw, y, w - rndw, h, min);
		}
		if (w < h) {
			let rndh = random(0.1, 0.9) * h;
			divideRect(x, y, w, rndh, min);
			divideRect(x, y + rndh, w, h - rndh, min);
		}
	} else {
		rects.push({ x: x + w / 2, y: y + h / 2, w: w + 0.5, h: h + 0.5 });
	}
}


class FoldingRect {
	constructor(x, y, w, h, t) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.hfw = this.w / 2;
		this.hfh = this.h / 2;
		this.p1 = createVector(0, 0);
		this.p2 = createVector(0, 0);
		this.p3 = createVector(0, this.hfh);
		this.p4 = createVector(0, this.hfh);

		this.t = t;
		this.t1 = 20;
		this.t2 = this.t1 + 20;
		this.t3 = this.t2 + 20;

		this.opt = int(random(2));
		this.xsc = random([-1, 1]);
		this.ysc = random([-1, 1]);
	}

	show() {
		push();
		translate(this.x, this.y);
		scale(this.xsc, this.ysc);
		noStroke();
		fill(fillCol);
		beginShape();
		vertex(this.p1.x, this.p1.y);
		vertex(this.p2.x, this.p2.y);
		vertex(this.p3.x, this.p3.y);
		vertex(this.p4.x, this.p4.y);
		endShape(CLOSE);
		pop();
	}

	move() {
		if (0 < this.t && this.t < this.t1) {
			let n = norm(this.t, 0, this.t1 - 1);
			this.p2.x = lerp(0, this.hfw, easeInOutQuart(n));
			this.p3.x = lerp(0, this.hfw, easeInOutQuart(n));
		}
		else if (this.t1 < this.t && this.t < this.t2) {
			let n = norm(this.t, this.t1, this.t2 - 1);
			if (this.opt == 0) {
				this.p1.x = lerp(0, -this.hfw, easeInOutQuart(n));
				this.p4.x = lerp(0, -this.hfw, easeInOutQuart(n));
			} else {
				this.p1.y = lerp(0, -this.hfh, easeInOutQuart(n));
				this.p2.y = lerp(0, -this.hfh, easeInOutQuart(n));
			}

		}
		else if (this.t2 < this.t && this.t < this.t3) {
			let n = norm(this.t, this.t2, this.t3 - 1);
			if (this.opt == 0) {
				this.p1.y = lerp(0, -this.hfh, easeInOutQuart(n));
				this.p2.y = lerp(0, -this.hfh, easeInOutQuart(n));
			} else {
				this.p1.x = lerp(0, -this.hfw, easeInOutQuart(n));
				this.p4.x = lerp(0, -this.hfw, easeInOutQuart(n));
			}
		}
		this.t++;
	}

	run() {
		this.show();
		this.move();
	}
}
