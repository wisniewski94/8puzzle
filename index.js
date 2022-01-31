const AStarSolver = require('./solver');
const Board = require('./board.js');

const game = new Board([15, 8, 9, 14, 5, 10, 1, 0, 12, 4, 3, 13, 11, 2, 7, 6]);
// game.shuffleTimes(32);
// console.log(game.board);
const solver = new AStarSolver(game);
solver.solve();
console.log(solver.solution.length);
