const AStarSolver = require('./solver');
const Board = require('./board.js');

const game = new Board();
game.shuffleTimes(32);
console.log(game.board);
const solver = new AStarSolver(game);
solver.solve();
console.log(solver.solution.length);
