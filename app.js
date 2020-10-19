/* eslint-disable func-names */
/* eslint-disable no-console */
/**
 * Returns an array of possible moves for the given state. Ex. ['left', 'right', 'up'];
 * @param  {} array
 */
const availableMoves = (array) => {
  const index = array.indexOf(0);
  const row = Math.floor(index / 3);
  const column = index % 3;
  const possibleMoves = [];
  if (column > 0) possibleMoves.push('left');
  if (column < 2) possibleMoves.push('right');
  if (row < 2) possibleMoves.push('down');
  if (row > 0) possibleMoves.push('up');
  return possibleMoves;
};

// Offset map
const moveOffset = {
  left: -1,
  up: -3,
  right: 1,
  down: 3,
};
/**
 * Replaces items in array
 * @param  {array} array - State to be modified
 * @param  {number} index - Index of item to be replaced
 * @param  {number} offset - Move offset
 */
const swap = (array, index, offset) => {
  const arrayCopy = [...array];
  [arrayCopy[index], arrayCopy[index + offset]] = [arrayCopy[index + offset], arrayCopy[index]];
  return arrayCopy;
};
/**
 * Returns an array of possible states after moving empty tile
 * @param  {array} state - Initial state
 */
const availableStates = (state) => {
  const moves = availableMoves(state);
  const index = state.indexOf(0);
  const states = [];
  moves.forEach((el) => {
    const offset = moveOffset[el];
    let array = [...state];
    array = swap(array, index, offset);
    states.push(array);
  });
  return states;
};

/**
 * Moves the empty tile in random direction.
 * @param  {array} array - Array to be modified
 */
const shuffle = ([...array]) => {
  let arrayCopy = array;
  const index = arrayCopy.indexOf(0);
  const moves = availableMoves(arrayCopy);
  const randomMove = moves[Math.floor(Math.random() * moves.length)];
  const offset = moveOffset[randomMove];
  arrayCopy = swap(arrayCopy, index, offset);
  return arrayCopy;
};
/**
 * Shuffles puzzle randomly n times.
 * @param  {number} n - repeat count
 */
const shuffleTimes = (n) => {
  let state = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  for (let i = 0; i <= n; i += 1) {
    state = shuffle(state);
  }
  return state;
};

/**
 * Tests if two arrays are equal.
 * @param  {array} array1
 * @param  {array} array2
 */
const arraysEquality = (array1, array2) => JSON.stringify(array1) === JSON.stringify(array2);
/**
 * Checks if state exists in open or closed list.
 * @param  {array} search - Array that is being searched.
 * @param  {array} array - Target array
 */
const searchArrayInArrays = (search, array) => {
  const searchJson = JSON.stringify(search);
  const arrayJson = array.map((el) => JSON.stringify(el.state));
  return arrayJson.indexOf(searchJson);
};
/**
 * Calculates Manhattan Distance from initial to goal state
 * @param  {array} state
 * @param  {array} goal
 */
const manhattanDist = (state, goal) => {
  let dist = 0;
  state.forEach((el, index) => {
    const y1 = Math.floor(index / 3);
    const x1 = index % 3;
    const goalIndex = goal.indexOf(el);
    const y0 = Math.floor(goalIndex / 3);
    const x0 = goalIndex % 3;
    dist += Math.abs(x1 - x0) + Math.abs(y1 - y0);
  });
  return dist;
};

/**
 * Generates solution path
 * @param  {array} array - Closed list
 * @param  {array} current - Last node from solution path
 */
const findPathHandler = (currentCopy) => function (el) {
  return el.state === currentCopy.previous;
};

const findPath = (array, current) => {
  let currentCopy = { ...current };
  const arrayCopy = [...array];
  let g = 1;
  const path = [current];
  while (g !== 0) {
    const find = arrayCopy.find(findPathHandler(currentCopy));
    path.push(find);
    currentCopy = find;
    g = find.g;
  }
  return path.map((el) => el.state);
};

const goal = [1, 2, 3, 4, 5, 6, 7, 8, 0];

const removeDuplicates = (current) => function (el) {
  return el !== current;
};

/**
 * A* algorithm that solves 8 Puzzle
 * @param  {array} state - puzzle to be solved
 */

const aSearch = (state) => {
  console.time('a');
  let open = [];
  const closed = [];
  let iteration = 0;
  let current = {
    state, previous: null, f: manhattanDist(state, goal) + 1, g: 0,
  };
  open.push(current);
  while (open.length > 0) {
    iteration += 1;

    if (!arraysEquality(current.state, goal)) {
      const states = availableStates(current.state);
      // eslint-disable-next-line no-loop-func
      states.forEach((el) => {
        if (searchArrayInArrays(el, closed) === -1) {
          const newCurrent = {
            state: el,
            previous: current.state,
            f: manhattanDist(el, goal) + current.g + 1,
            g: current.g + 1,
          };
          const newCurrentIndex = searchArrayInArrays(el, open);
          if (newCurrentIndex !== -1) {
            if (open[newCurrentIndex].f > newCurrent.f) {
              open[newCurrentIndex] = newCurrent;
            }
          } else {
            open.push(newCurrent);
          }
        }
      });
      closed.push(current);
      open = open.filter(removeDuplicates(current));
      const lowest = open.reduce((res, el) => (el.f < res.f ? el : res));
      current = lowest;
    } else {
      closed.push(current);
      const path = findPath(closed, current);
      const stats = { path, g: current.g, iteration };
      console.log(stats);
      console.timeEnd('a');
      return stats;
    }
  }
  return null;
};

const state = shuffleTimes(10);
aSearch(state);
