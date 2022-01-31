const checkIfArraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

const findBoardInList = (searchSet, array) => {
  const search = JSON.stringify(array);
  const searchInList = searchSet.map((el) => JSON.stringify(el.node.board));
  return searchInList.indexOf(search);
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

    this.openList.push(this.activeNode);
    this.activeNode.fScore = this.getManhattanDistance(this.activeNode.node.board, goal) + 1;

    while (this.openList.length > 0) {
      const foundSolution = checkIfArraysEqual(this.activeNode.node.board, goal);
      if (!foundSolution) {
        const nextNodes = this.activeNode.node.nextAvailableStates;
        // eslint-disable-next-line no-loop-func
        nextNodes.forEach((node) => {
          const neighbour = node;
          const nodeInClosed = findBoardInList(this.closedList, neighbour.board);
          if (nodeInClosed === -1) {
            const nodeInOpen = findBoardInList(this.openList, neighbour.board);
            const gScore = this.activeNode.gScore + 1;
            const hScore = this.getManhattanDistance(neighbour.board, goal);
            const fScore = hScore + gScore;
            const newNode = {
              node: neighbour,
              gScore,
              fScore,
              previous: this.activeNode,
            };

            if (nodeInOpen !== -1) {
              if (this.openList[nodeInOpen].fScore > fScore) {
                this.openList[nodeInOpen] = newNode;
              }
            } else {
              this.openList.push(newNode);
            }
          }
        });

        this.closedList.push(this.activeNode);
        // eslint-disable-next-line max-len
        const withoutCurrent = this.openList.filter((node) => {
          if (node.node.board.length !== this.activeNode.node.board.length) {
            return true;
          }

          for (let i = 0; i < node.node.board.length; i++) {
            if (node.node.board[i] !== this.activeNode.node.board[i]) {
              return true;
            }
          }

          return false;
        });
        this.openList = withoutCurrent;

        // eslint-disable-next-line max-len
        this.activeNode = this.openList.reduce((prev, curr) => (curr.fScore < prev.fScore ? curr : prev));
      } else {
        this.solution = this.reconstructPath(this.activeNode);
        console.log(this.openList.length);
        return this.solution;
      }
    }
    return null;
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
    console.time('b');
    this.aStarSearch();
    console.timeEnd('b');
  }
}

module.exports = AStarSolver;
