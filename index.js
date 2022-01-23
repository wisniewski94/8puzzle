const AStarSolver = require('./solver');
const Board = require('./board.js');

const game = new Board([10, 14, 15, 3, 5, 7, 0, 12, 2, 8, 9, 1, 4, 6, 11, 13]);
// game.shuffleTimes(32);
// console.log(game.board);
const solver = new AStarSolver(game);
solver.solve();
console.log(solver.solution);
