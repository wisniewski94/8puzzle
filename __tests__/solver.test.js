/* eslint-disable no-undef */
const AStarSolver = require('../solver');
const Board = require('../board');

describe('AStarSolver methods', () => {
  let solver;

  beforeEach(() => {
    const board = new Board([1, 2, 3, 0, 5, 6, 4, 7, 8], 3);
    solver = new AStarSolver(board);
  });

  it('Manhattan Distance for [1, 2, 3, 0, 5, 6, 4, 7, 8] from goal is 3', () => {
    const { activeNode } = solver;
    const distance = solver.getManhattanDistance(activeNode.node.board, solver.goal);
    expect(distance).toBe(6);
  });

  it('has correct open list size', () => {
    const { openList } = solver;
    solver.solve();
    expect(openList.length).toBe(4);
  });

  it('has correct closed list size', () => {
    const { closedList } = solver;
    solver.solve();
    expect(closedList.length).toBe(3);
  });

  it('has correct path size', () => {
    solver.solve();
    const { solution } = solver;
    expect(solution.length).toBe(3);
  });

  it('has correct path', () => {
    solver.solve();
    const { solution } = solver;
    expect(solution).toEqual([
      [
        1, 2, 3, 4, 5,
        6, 7, 8, 0,
      ],
      [
        1, 2, 3, 4, 5,
        6, 7, 0, 8,
      ],
      [
        1, 2, 3, 4, 5,
        6, 0, 7, 8,
      ],
    ]);
  });
});

describe('AStarSolver for 4x4', () => {
  let globalSolver;

  beforeEach(() => {
    const board = new Board([6, 14, 8, 3, 13, 0, 11, 2, 9, 15, 1, 5, 7, 12, 4, 10], 4);
    globalSolver = new AStarSolver(board);
  });

  it('Manhattan Distance for [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0] from goal is 0', () => {
    const board = new Board([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0], 4);
    const solver = new AStarSolver(board);
    const { activeNode } = solver;
    const distance = solver.getManhattanDistance(activeNode.node.board, solver.goal);
    expect(distance).toBe(0);
  });

  it('Manhattan Distance for [6, 14, 8, 3, 13, 0, 11, 2, 9, 15, 1, 5, 7, 12, 4, 10] from goal is 42', () => {
    const { activeNode } = globalSolver;
    const distance = globalSolver.getManhattanDistance(activeNode.node.board, globalSolver.goal);
    expect(distance).toBe(42);
  });
});
