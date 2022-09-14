/* eslint-disable no-bitwise */
const range = (min, max) => (min - max) * Math.random() + max;

class Particle {
  constructor(x, y, canvas) {
    this.setPhysics();
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.dimensions = {
      w: range(7, 10),
      h: range(7, 10),
    };
    this.scale = {
      x: 1,
      y: 1,
    };
    this.rotation = Math.random() * Math.PI;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.color = this.COLORS[~~range(1, 5)];
  }

  applyForces() {
    this.velocity.x -= this.velocity.x * (this.DRAG * this.velocity.y * 0.2);
    this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();
    this.velocity.y = Math.min(this.velocity.y + this.GRAVITY, this.TERMINAL_VELOCITY);
  }

  setPhysics() {
    this.NUM = 35;
    this.COLORS = [[85, 71, 106], [174, 61, 99], [219, 56, 83], [244, 92, 68], [248, 182, 70]];
    this.DRAG = 0.075;
    this.GRAVITY = 0.09;
    this.TERMINAL_VELOCITY = 4;
  }

  setPosition() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  loop() {
    if (this.x > this.canvas.width) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = this.canvas.width;
    }
  }

  spin() {
    this.scale.y = Math.cos(this.y * 0.1);
  }

  draw(context) {
    const width = this.dimensions.w * this.scale.x;
    const height = this.dimensions.h * this.scale.y;
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    this.applyForces();
    this.setPosition();
    this.loop();
    this.spin();
    context.fillStyle = `rgba(${this.color.join(',')}, 1)`;
    context.fillRect(width / 2, height / 2, width, height);
    context.setTransform(1, 0, 0, 1, 0, 0);
  }
}

export default Particle;
