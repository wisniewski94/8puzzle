const AStarSolver = require('./solver');
const Board = require('./board.js');

const game = new Board([
  6, 1, 4, 8, 7,
  3, 0, 5, 2,
]);
// game.shuffleTimes(32);
// console.log(game.board);
const solver = new AStarSolver(game);
solver.solve();
console.log(solver.solution.length);
