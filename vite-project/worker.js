import AStarSolver from './solver';
import Board from './board';

onmessage = function (e) {
  const board = Object.setPrototypeOf(e.data, Board.prototype);
  const solver = new AStarSolver(board);
  solver.solve();
  console.log(solver.steps);
  postMessage(solver.steps);
};
