/* eslint-disable class-methods-use-this */
import Particle from './particle';

const range = (min, max) => (min - max) * Math.random() + max;

class Confetti extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
        }

        :host {
          position: absolute;
          z-index: 9;
          pointer-events: none;
        }
      </style>
      <canvas id="confetti"></canvas>
    `;

    this.canvas = this.shadowRoot.querySelector('#confetti');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = document.documentElement.clientWidth;
    this.canvas.height = document.documentElement.clientHeight;
    this.particles = [];
    this.MAX_COUNT = 50;
    this.initializeParticles();
    this.prepareAnimation();
  }

  initializeParticles() {
    for (let i = 0; i < this.NUM; i += 1) {
      this.particles.push(new Particle(range(0, this.canvas.width), range(-309, 0), this.canvas));
    }
  }

  prepareAnimation() {
    this.count = 0;
    this.rafId = null;
  }

  draw(self) {
    self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
    if (self.count < self.MAX_COUNT) {
      self.particles.push(new Particle(range(0, self.canvas.width), range(-500, 0), self.canvas));
    }
    self.count += 1;
    self.particles.forEach((particle) => {
      particle.draw(self.context);
      if (particle.y > self.canvas.height) {
        self.particles.splice(self.particles.indexOf(particle), 1);
      }
    });
    self.rafId = requestAnimationFrame(() => self.draw(self));
    if (self.particles.length === 0) {
      setTimeout(() => {
        cancelAnimationFrame(self.rafId);
      }, 1000);
    }
  }

  dropConfetti() {
    this.rafId = requestAnimationFrame(() => {
      this.draw(this);
    });
  }
}

customElements.define('confetti-canvas', Confetti);

export default Confetti;
