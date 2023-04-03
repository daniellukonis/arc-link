const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const resizeCanvas = canvas => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas(canvas);

const clearCanvas = (canvas, context) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

clearCanvas(canvas, context);

class Arc {
  constructor(canvas, context, index, quantity) {
    this.canvas = canvas;
    this.context = context;

    this.midX = Math.round(this.canvas.width / 2);
    this.midY = Math.round(this.canvas.height / 2);

    this.max = this.canvas.width > this.canvas.height ? this.canvas.height : this.canvas.width;

    this.quantity = quantity;

    this.slice = Math.PI / 10;
    this.angle = this.slice * index; 
    this.nextAngle = this.angle - (this.quantity * this.slice) + Math.PI * 2;
    this.angleSpeed = 0.025;

    this.active = false;
    
    this.radius = this.max / 3;
    this.lineWidth = 2 * Math.PI * this.radius / 30;

    this.gradient = context.createLinearGradient(0, 0, this.midX * 0.7, 0);
    this.gradient.addColorStop(1, '#000');
    this.gradient.addColorStop(0, '#FFF');
    
    this.next = 0;
  }

  draw({context} = this) {
    context.save();
    context.strokeStyle = this.gradient;
    context.lineWidth = this.lineWidth;
    context.translate(this.midX, this.midY);
    context.rotate(this.angle);
    context.beginPath()
    context.arc(0, 0, this.radius, 0, Math.PI / 10);
    context.stroke();
    context.restore();
  }

  move() {
    if(this.angle >= this.nextAngle) {
        this.stop();
      this.angle = this.nextAngle;
      this.nextAngle = this.angle - (this.quantity * this.slice) + Math.PI * 2;
      this.next.start();
    }

    if(this.active) {
      this.angle += this.angleSpeed;
    }
    this.angle += 0.001;
  }

  start() {
    this.active = true;
  }

  stop() {
    this.active = false;
  }

  animate() {
    this.move();
    this.draw();
  }
}

class Ring {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;

    this.midX = Math.round(this.canvas.width / 2);
    this.midY = Math.round(this.canvas.height / 2);

    this.max = this.canvas.width > this.canvas.height ? this.canvas.height : this.canvas.width;
    this.radius = this.max / 3;

    this.lineWidth = 2 * Math.PI * this.radius / 30;
  }

  draw({context} = this) {
    context.save();
    context.strokeStyle = '#111';
    context.lineWidth = this.lineWidth - 10;
    context.translate(this.midX, this.midY);
    context.beginPath()
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  }

  animate() {
    this.draw();
  }
}

class Spark {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;

    this.midX = Math.round(this.canvas.width / 2);
    this.midY = Math.round(this.canvas.height / 2);

    this.max = this.canvas.width > this.canvas.height ? this.canvas.height : this.canvas.width;
    this.radius = this.max / 3;

    this.angle = Math.PI * 2 * Math.random();
    this.angleSpeed = 0.01 * Math.random();

    this.cp1angle = 0;
    this.cp1angleSpeed = Math.random();
    this.cp1Range = 20;
    this.cp1y = 0;

    this.cp2angle = 0;
    this.cp2angleSpeed = Math.random();
    this.cp2Range = 20;
    this.cp2y = 0;

    this.strokeStyle = '#32CD3250';
    this.lineWidth = 2;
  }

  draw({context} = this) {
    const cp1x = this.radius * 0.25;

    const cp2x = this.radius * 0.75;

    const endx = this.radius;
    const endy = 0;
    
    context.save();
    context.strokeStyle = this.strokeStyle;
    context.lineWidth = this.lineWidth;
    context.translate(this.midX, this.midY);
    context.rotate(this.angle);
    context.beginPath();
    context.moveTo(0, 0);
    context.bezierCurveTo(cp1x, this.cp1y, cp2x, this.cp2y, endx, endy);
    context.stroke();
    context.restore();
  }

  move() {
    this.angle += this.angleSpeed;
    this.cp1angle += this.cp1angleSpeed;
    this.cp2angle += this.cp2angleSpeed;
    this.cp1y = Math.sin(this.cp1angle) * this.cp1Range;
    this.cp2y = Math.sin(this.cp2angle) * this.cp2Range;
  }

  animate() {
    this.move();
    this.draw();
  }
}


const quantity = 14
const arcs = [];
for(let i = 0; i < quantity; i++) {
  arcs.push(new Arc(canvas, context, i, quantity));
  arcs[i].next = arcs[i - 1];
}

arcs[0].next = arcs[arcs.length - 1];
arcs[arcs.length - 1].start();

const sparks = [];
for(let i = 0; i < 30; i++) {
  sparks.push(new Spark(canvas, context));
}

const ring = new Ring(canvas, context);

const loop = () => {
  
  clearCanvas(canvas, context);
  sparks.forEach(e => e.animate());
  ring.animate();
  arcs.forEach(e => e.animate());
  
  requestAnimationFrame(loop)
}

loop();