import Board from './board';

class Puzzle extends HTMLElement {
  constructor() {
    super();
    this.won = false;
    this.worker = null;
    this.waitingForSolution = false;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
        }

        :host {
          width: 70%;
          max-width: 500px;
          position: relative;
          margin: 0 auto;
          --col: 33.333%;
          --padding: 0%;
          display: block;
        }

        .puzzle {
          display: block;
          position: relative;
          filter: drop-shadow(0px 9px 9px #0004);
          border-radius: 6px;
          overflow: hidden;
          transition: filter 1s ease;
        }

        .puzzle--nofilter {
          filter: none;
        }

        .puzzle--nonumbers .puzzle__number {
          opacity: 0;
          user-select: none;
        }

        .puzzle:after {
          content: '';
          display: block;
          padding-bottom: 100%;
        }

        .puzzle__card {
          position: absolute;
          width: var(--col);
          height: var(--col);
          display: flex;
          justify-content: center;
          transition: all .2s cubic-bezier(0, 0, 0.45, 1.15);
          overflow: hidden;
          align-items: center;
          font-size: 30px;
          -webkit-backface-visibility: hidden;
        }

        .puzzle:not(.puzzle--win) .puzzle__card {
          cursor: pointer;
        }

        .puzzle__number {
          z-index: 2;
          position: absolute;
          left: 50%;
          text-shadow: white 0px 0px 11px;
          top: 50%;
          transform: translate(-50%, -50%);
          color: black;
          opacity: 1;
          font-family: system-ui;
          font-weight: bold;
          transition: opacity 1s ease;
          user-select: initial;
        }

        .puzzle__card img {
          position: absolute;
          width: calc(var(--col) * 9);
          height: calc(var(--col) * 9);
        }

        .puzzle__card:nth-of-type(3n + 1) img {
          left: var(--padding);
        }

        .puzzle__card:nth-of-type(3n + 1) {
          left: 0;
        }

        .puzzle__card:nth-of-type(3n + 2) img {
          right: calc(var(--col) * -3 + var(--padding));
        }

        .puzzle__card:nth-of-type(3n + 2) {
          left: var(--col);
        }

        .puzzle__card:nth-of-type(3n + 3) img {
          right: 0;
        }

        .puzzle__card:nth-of-type(3n + 3) {
          left: calc(2 * var(--col));
        }

        .puzzle__card:nth-of-type(-n + 3) img {
          top: 0;
        }

        .puzzle__card:nth-of-type(-n + 3) {
          top: 0;
        }

        .puzzle__card:nth-of-type(n + 4):nth-of-type(-n + 6) img {
          top: calc(var(--col) * -3);
        }

        .puzzle__card:nth-of-type(n + 4):nth-of-type(-n + 6) {
          top: var(--col);
        }

        .puzzle__card:nth-of-type(n + 7):nth-of-type(-n + 9) img {
          bottom: 0;
        }

        .puzzle__card:nth-of-type(n + 7):nth-of-type(-n + 9) {
          top: calc(2 * var(--col));
        }
        .puzzle__card__inner:not(.puzzle__card__inner--empty) {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          opacity: 1;
          transition: all 1s cubic-bezier(0, 0, 0.45, 1.15);
        }

        .puzzle__card__inner--empty {
          opacity: 0;
          cursor: default;
        }
        
      </style>
      <slot></slot>
      <div id="puzzle" class='puzzle'>
        <div class="puzzle__card">
          <div class="puzzle__card__inner">
            <span class="puzzle__number">1</span>
            <img src="https://picsum.photos/800" />
          </div>
        </div>
        <div class="puzzle__card">
          <div class="puzzle__card__inner">
            <span class="puzzle__number">2</span>
            <img src="https://picsum.photos/800" />
          </div>
        </div>
        <div class="puzzle__card">
          <div class="puzzle__card__inner">
            <span class="puzzle__number">3</span>
            <img src="https://picsum.photos/800" />
          </div>
        </div>
        <div class="puzzle__card">
          <div class="puzzle__card__inner">
            <span class="puzzle__number">4</span>
            <img src="https://picsum.photos/800" />
          </div>
        </div>
        <div class="puzzle__card">
          <div class="puzzle__card__inner">
            <span class="puzzle__number">5</span>
            <img src="https://picsum.photos/800" />
          </div>
        </div>
        <div class="puzzle__card">
          <div class="puzzle__card__inner">
            <span class="puzzle__number">6</span>
            <img src="https://picsum.photos/800" />
          </div>
        </div>
        <div class="puzzle__card">
          <div class="puzzle__card__inner">
            <span class="puzzle__number">7</span>
            <img src="https://picsum.photos/800" />
          </div>
        </div>
        <div class="puzzle__card">
          <div class="puzzle__card__inner">
            <span class="puzzle__number">8</span>
          <img src="https://picsum.photos/800" />
          </div>
        </div>
        <div class="puzzle__card">
          <div class="puzzle__card__inner puzzle__card__inner--empty">
            <img src="https://picsum.photos/800" />
          </div>
        </div>
      </div>
    `;
    this.registerWorker();
    this.createEventListeners();
    this.startPuzzle(60);
    this.renderTiles();
    this.addEventListeners();
  }

  addEventListeners() {
    const tiles = this.shadowRoot.querySelectorAll('.puzzle__card');
    tiles.forEach((tile, index) => {
      tile.addEventListener('click', (event) => {
        if (!this.won) {
          this.handleClick(event, index);
        }
      }, true);
    });
  }

  createEventListeners() {
    this.winEvent = new CustomEvent('puzzleSolved', {
      bubbles: true,
      cancelable: false,
    });
  }

  disablePointer(disable) {
    const tile = this.shadowRoot.querySelector('.puzzle');
    tile.classList.add('puzzle--win');
  }

  showLastTile() {
    const tiles = this.shadowRoot.querySelectorAll('.puzzle__card__inner');
    tiles[tiles.length - 1].classList.remove('puzzle__card__inner--empty');
  }

  removeShadow() {
    const tile = this.shadowRoot.querySelector('.puzzle');
    tile.classList.add('puzzle--nofilter');
  }

  hideNumbers() {
    const tile = this.shadowRoot.querySelector('.puzzle');
    tile.classList.add('puzzle--nonumbers');
  }

  handleWin() {
    this.won = true;
    this.showLastTile();
    this.removeShadow();
    this.hideNumbers();
    this.disablePointer(true);
    this.dispatchEvent(this.winEvent);
  }

  handleClick(event, index) {
    const isMovable = this.puzzle.checkIfMovable(index + 1);
    if (isMovable) {
      this.puzzle.moveTile(index + 1);
      this.renderTiles();
      const win = this.puzzle.checkIfWin();
      if (win) {
        this.handleWin();
      }
    }
  }

  registerWorker() {
    this.worker = new Worker('worker.js', { type: 'module' });
    this.worker.addEventListener('message', (data) => {
      if (this.waitingForSolution) {
        this.solvePuzzle(data.data);
      }
    });
  }

  renderTiles() {
    const { board } = this.puzzle;
    const cards = this.shadowRoot.querySelectorAll('.puzzle__card');
    cards.forEach((card, index) => {
      let tile = index + 1;
      if (tile === board.length) {
        tile = 0;
      }
      const tileIndex = board.indexOf(tile);
      const originX = ((index) % 3) * 100;
      const originY = Math.floor((index) / 3) * 100;

      const positionInColumn = Math.floor(tileIndex / 3) * 100;
      const positionInRow = (tileIndex % 3) * 100;
      const x = -(originX) + positionInRow;
      const y = -(originY) + positionInColumn;
      card.style.transform = `translate3d(${x}%, ${y}%, 0)`;
    });
  }

  solve() {
    this.worker.postMessage(this.puzzle);
  }

  solvePuzzle(solution) {
    solution.forEach((move, index) => {
      setTimeout(() => {
        this.puzzle.moveTile(move);
        this.renderTiles();
        if (index === solution.length - 1) {
          this.handleWin();
        }
      }, index * 300);
    });
  }

  startPuzzle(times) {
    const game = new Board();
    game.shuffleTimes(times);
    this.puzzle = game;
    this.solve();
  }
}

customElements.define('puzzle-board', Puzzle);

export default Puzzle;
