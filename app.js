let state = [1, 2, 3, 4, 5, 6, 7, 8, 0];

const availableMoves = (array) => {
	const index = array.indexOf(0);
	const row = Math.floor(index / 3);
	const column = index % 3;
	const possible_moves = [];
	if (column > 0) possible_moves.push('left');
	if (column < 2) possible_moves.push('right');
	if (row < 2) possible_moves.push('down');
	if (row > 0) possible_moves.push('up');
	return possible_moves;
}

const moveOffset = {
	'left': -1,
	'up': -3,
	'right': 1,
	'down': 3
}

const swap = (array, index, offset) => {
	[array[index], array[index + offset]] = [array[index + offset], array[index]]
	return array;
}

const availableStates = state => {
	const moves = availableMoves(state);
	const index = state.indexOf(0);
	let states = [];
	moves.forEach(el => {
		const offset = moveOffset[el];
		const array = [...state];
		swap(array, index, offset);
		states.push(array);
	});
	return states;
}

const shuffle = ([...array]) => {
	const index = array.indexOf(0);
	const moves = availableMoves(array);
	const randomMove = moves[Math.floor(Math.random() * moves.length)];
	const offset = moveOffset[randomMove];
	swap(array, index, offset);
	return array;
}

for (let i = 0; i <= 100; i += 1) {
	state = shuffle(state);
}
const arraysEquality = (array1, array2) => {
	return JSON.stringify(array1) == JSON.stringify(array2);
}

const searchArrayInArrays = (search, array) => {
	const searchJson = JSON.stringify(search);
	const arrayJson = array.map(el => JSON.stringify(el.state));
	return arrayJson.indexOf(searchJson);
}

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

const findPath = (array, current) => {
	let g = 1;
	let path = [current];
	while (g !== 0) {
		const find = array.find(el => el.state == current.previous);
		path.push(find);
		current = find;
		g = find.g;

	}

	return path.map(el => el.state);;
}

const goal = [1, 2, 3, 4, 5, 6, 7, 8, 0];
const aSearch = state => {
	console.time('a');
	let open = [];
	let closed = [];
	let iteration = 0;
	let current = {
		state, previous: null, f: manhattanDist(state, goal) + 1, g: 0
	};
	open.push(current);
	while (open.length > 0) {
		iteration++;

		if (!arraysEquality(current.state, goal)) {
			const states = availableStates(current.state);
			states.forEach(el => {
				if (searchArrayInArrays(el, closed) === -1) {
					const newCurrent = { state: el, previous: current.state, f: manhattanDist(el, goal) + current.g + 1, g: current.g + 1 };
					const newCurrentIndex = searchArrayInArrays(el, open);
					if (newCurrentIndex !== -1) {
						if (open[newCurrentIndex].f > newCurrent.f) {
							open[newCurrentIndex] = newCurrent;
						}
					} else {
						open.push(newCurrent);
					};
				}
			});

			closed.push(current);
			open = open.filter(el => el !== current);
			const lowest = open.reduce((res, el) => el.f < res.f ? el : res);
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

}
aSearch(state);
