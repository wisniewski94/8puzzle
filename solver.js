const checkIfArraysEqual = (arr1, arr2) => JSON.stringify(arr1) === JSON.stringify(arr2);

const searchArrayInArrays = (array, arrays) => {
  const searchJson = JSON.stringify(array);
  const arrayJson = arrays.map((el) => JSON.stringify(el.state));
  return arrayJson.indexOf(searchJson);
};

class AStarSolver {
  constructor(puzzle) {
    const goal = [...Array(puzzle.board.length - 1).keys()].map((el) => el + 1);
    goal.push(0);
    this.node = puzzle;
    this.solution = [];
    this.goal = goal;
    this.size = Math.sqrt(puzzle.board.length);
    this.activeNode = {
      node: this.node,
      fScore: 0,
      gScore: 0,
      previous: null,
    };

    this.openList = [];
    this.closedList = [];
  }

  aStarSearch() {
    const { goal } = this;
    const STEP = 0;
    let distance = 0;
    let foundSolution;

    this.openList.push(this.activeNode);
    this.activeNode.fScore = this.getManhattanDistance(this.activeNode.node.board, goal) + 0;

    foundSolution = checkIfArraysEqual(this.activeNode.node.board, goal);
    while (foundSolution === false) {
      distance += STEP;
      const nextNodes = this.activeNode.node.nextAvailableStates;
      // eslint-disable-next-line no-loop-func
      nextNodes.forEach((node) => {
        const neighbour = node;
        const search = JSON.stringify(neighbour.board);
        const searchInClosed = this.closedList.map((el) => JSON.stringify(el.node.board));
        const searchClosedIndex = searchInClosed.indexOf(search);
        if (searchClosedIndex === -1) {
          const searchInOpen = this.openList.map((el) => JSON.stringify(el.node.board));
          const searchOpenIndex = searchInOpen.indexOf(search);
          const gScore = this.activeNode.gScore + distance;
          const hScore = this.getManhattanDistance(neighbour.board, goal);
          const fScore = hScore + gScore;
          const newNode = {
            node: neighbour,
            gScore,
            fScore,
            previous: this.activeNode,
          };

          if (searchOpenIndex !== -1) {
            if (this.openList[searchOpenIndex].fScore > fScore) {
              this.openList[searchOpenIndex] = newNode;
            }
          } else {
            this.openList.push(newNode);
          }
        }
      });

      this.closedList.push(this.activeNode);
      // eslint-disable-next-line max-len
      const withoutCurrent = this.openList.filter((node) => JSON.stringify(node) !== JSON.stringify(this.activeNode));
      this.openList = withoutCurrent;

      // eslint-disable-next-line max-len
      this.activeNode = this.openList.reduce((prev, curr) => (prev.fScore < curr.fScore ? prev : curr));
      console.log(this.activeNode.fScore);
      foundSolution = checkIfArraysEqual(this.activeNode.node.board, goal);
    }

    if (foundSolution) {
      this.solution = this.reconstructPath(this.activeNode);
    }
  }

  getManhattanDistance(activeNode, goal) {
    let distance = 0;
    activeNode.forEach((el, index) => {
      const goalIndex = goal.indexOf(el);
      const y1 = Math.floor(index / this.size);
      const x1 = index % this.size;
      const y2 = Math.floor(goalIndex / this.size);
      const x2 = goalIndex % this.size;
      distance += (Math.abs(x1 - x2) + Math.abs(y1 - y2));
    });
    return distance;
  }

  findNodeWithLowestFScore(openList) {
    let lowestFScore = Infinity;
    let lowestFScoreNode;
    openList.forEach((node) => {
      const fScore = this.getManhattanDistance(node, this.goal);
      if (fScore < lowestFScore) {
        lowestFScore = fScore;
        lowestFScoreNode = node;
      }
    });
    return lowestFScoreNode;
  }

  reconstructPath(node) {
    const path = [];
    let currentNode = node;
    while (currentNode.previous) {
      path.push(currentNode);
      currentNode = currentNode.previous;
    }
    const boardStates = path.map((item) => item.node.board);
    boardStates.push(this.node.board);
    return boardStates;
  }

  solve() {
    this.aStarSearch();
  }
}

module.exports = AStarSolver;
