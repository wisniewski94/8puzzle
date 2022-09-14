import './style.css';
import Confetti from './confetti';
import Puzzle from './puzzle';

const confetti = document.querySelector('confetti-canvas');

document.querySelector('puzzle-board').addEventListener('puzzleSolved', () => {
  confetti.dropConfetti();
});
