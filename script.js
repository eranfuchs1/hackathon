
let round_num = (num, round) => {
	return Math.floor(num / round) * round;
};


let limits = [];
limits.push([0,0]);


let round_island = (boxes, width, height) => {
	boxes_flags = create_boxes(width, height);
	for (let box of boxes)
	{
		boxes_flags[parseInt(box.getAttribute('data-y'))][parseInt(box.getAttribute('data-x'))] = {'on': true, 'box': box};
	}
	let beg = true;
	for (let line of boxes_flags)
	{
		let fl_indices = [-1, -1];
		for (let j of line.keys())
		{
			if (typeof(line[j]) == typeof({'is object':'?'}))
			{
				if (beg)
				{
					fl_indices[0] = j;
					beg = false;
				}
				fl_indices[1] = j;
			}
		}
		if (fl_indices[0] == -1 || fl_indices[1] == -1)
		{
			continue;
		}
		line[fl_indices[0]]['box'].style.borderRadius = `15px 0px 0px 0px`;
		line[fl_indices[1]]['box'].style.borderRadius = `0px 15px 0px 0px`;
	}
};
let random_minmax = (minmax) => {
	return Math.floor((Math.random() * (minmax[1] - minmax[0])) + minmax[0]);
};


let random_rgba = (r, g, b) => {
	return `rgba(${random_minmax(r)}, ${random_minmax(g)}, ${random_minmax(b)}, ${1.0 - Math.random()})`;
};


let random_width_height = (min, max) => {
	let arr = [];
	for (let i of Array(2))
	{
		arr.push(min + Math.floor(Math.random() * ((max - 1) - min)));
	}
	return arr;
};

let random_points = (width, height, num_of_points) => {
	let arr = [];
	for (let i of Array(num_of_points))
	{
		arr.push(random_width_height(0, width));
	}
	return arr;
};

let create_boxes = (width, height) => {
	let boxes = [];
	for (let i of Array(height))
	{
		boxes.push(Array(width));
	}
	for (let i of Array(height).keys())
	{
		for (j of Array(width).keys())
		{
			boxes[i][j] = false;
		}
	}
	return boxes;
};

let insert_points = (boxes, points) => {
	for (point of points)
	{
		if (point[0] >= boxes.length || point[1] >= boxes[0].length)
		{
			continue;
		}
		boxes[point[0]][point[1]] = true;
	}
	return boxes;
};

let find_last_first_point = (boxes_line) => {
	let indices = [-1,-1];
	let beg = true;
	for (point of boxes_line.keys())
	{
		if (boxes_line[point])
		{
			if (beg)
			{
				indices[0] = point;
				beg = false;
			}
			indices[1] = point;
		}
	}
	return indices;
}

let shave_boxes = (boxes, points) => {
	for (let i of boxes.keys())
	{
		let fl_indices = find_last_first_point(boxes[i]);
		if (fl_indices[0] == -1 || fl_indices[1] == -1)
		{
			continue;
		}
		for (let j = fl_indices[0]; j <= fl_indices[1]; j++)
		{
			boxes[i][j] = true;
		}
	}
	return boxes;
};

let shave_boxes_vertical = (boxes) => {
	for (let j of boxes[0].keys())
	{
		let column = [];
		for (let i of boxes.keys())
		{
			column.push(boxes[i][j]);
		}
		let fl_indices = find_last_first_point(column);
		if (fl_indices[0] == -1 || fl_indices[1] == -1)
		{
			continue;
		}
		for (let i = fl_indices[0]; i <= fl_indices[1]; i++)
		{
			boxes[i][j] = true;
		}
	}
	return boxes;
};



let make_half_island = (boxes, div_width, div_height) => {
	let container = document.createElement('div');
	container.style.width = `${div_width * boxes[0].length}px`;
	container.style.height = `${div_height * boxes.length}px`;
	container.style.position = 'absolute';
	for (let i of boxes.keys())
	{
		for (let j of boxes[i].keys())
		{
			if (!boxes[i][j])
			{
				continue;
			}
			let div = document.createElement('div');
			let div_sand = document.createElement('div');
			div.setAttribute('data-x', `${j}`);
			div.setAttribute('data-y', `${i}`);
			div.style.left = `${j * div_width}px`;
			div.style.top = `${i * div_height}px`;
			div.style.width = `${div_width}px`;
			div.style.height = `${div_height}px`;
			div.setAttribute('class', 'box');
			div.style.backgroundColor = random_rgba([155,155],[210, 255],[155, 155]);
			//div.style.borderRadius = `${random_minmax([3,7])}px`;
			div.style.position = 'absolute';
			div_sand.style.position = 'absolute';
			div_sand.style.left = `${j * div_width}px`;
			div_sand.style.top = `${i * div_height}px`;
			div_sand.style.width = `${div_width}px`;
			div_sand.style.height = `${div_height}px`;
			div_sand.style.backgroundColor = 'rgb(194, 178, 128)';
			div_sand.setAttribute('data-x', `${j}`);
			div_sand.setAttribute('data-y', `${i}`);
			container.appendChild(div_sand);
			container.appendChild(div);
		}
	}
	return container;
};


let make_intersections = (boxes, points, direction) => {
	let boxes_cpy = boxes.slice();
	for (let i of boxes.keys())
	{
		for (let j of boxes[i].keys())
		{
			if (boxes[i][j])
			{
				boxes_cpy[i][j] = 3;
			}
			else {
				boxes_cpy[i][j] = 0;
			}
		}
	}

	for (let point of points)
	{
		if (direction == 'right')
		{
			for (let j = point[0] + 1; j < boxes_cpy[point[1]].length; j++)
			{
				++boxes_cpy[point[1]][j];
			}
		}
		else if (direction == 'left')
		{
			for (let j = point[0] - 1; j >= 0; j--)
			{
				++boxes_cpy[point[1]][j];
			}
		}
		else if (direction == 'up')
		{
			for (let i = point[1] + 1; i < boxes_cpy.length; i++)
			{
				++boxes_cpy[i][point[0]];
			}
		}
		else if (direction == 'down')
		{
			for (let i = point[1] - 1; i >= 0; i--)
			{
				++boxes_cpy[i][point[0]];
			}
		}
	}
	for (let i of boxes_cpy.keys())
	{
		for (let j of boxes_cpy[i].keys())
		{
			if (boxes_cpy[i][j] > 3)
			{
				boxes[i][j] = true;
			}
		}
	}
	return boxes;
};


let create_islands = (min, max, number, location) => {
	for (let i of Array(number).keys())
	{
		let myWidth;
		let myHeight;
		let wh_arr = random_width_height(min, max);
		myWidth = wh_arr[0];
		myHeight = wh_arr[1];
		let boxes = create_boxes(myWidth, myHeight);

		let num_of_points = 20;

		let points = random_points(myWidth, myHeight, num_of_points);

		boxes = insert_points(boxes, points);

		boxes = make_intersections(boxes, points, 'up');

		boxes = shave_boxes(boxes, points);

		boxes = shave_boxes_vertical(boxes);

		let div_width = 30;
		let div_height = 30;

		let island = make_half_island(boxes, div_width, div_height);
		island.style.position = 'absolute';
		island.style.left = `${location[0] + Math.ceil(Math.random() * 100 * i)}px`
		island.style.top = `${location[1] + Math.ceil(Math.random() * 100 * i)}px`
		document.body.appendChild(island);

	}
};
create_islands(10, 15, 40, [-1000,-1000]);
create_islands(10, 15, 40, [-1000,-1000]);
create_islands(10, 15, 40, [-1000,-1000]);


let make_island_solid = (boxes) => {
	let lowest;
	let beg = true;
	for (let box of boxes)
	{
		let z_index = parseInt(document.defaultView.getComputedStyle(box, null).getPropertyValue('z-index'), 10);
		if (beg)
		{
			lowest = z_index;
			beg = false;
		}
		else if (z_index < lowest)
		{
			lowest = z_index;
		}
	}
	for (let box of boxes)
	{
		let z_index = parseInt(document.defaultView.getComputedStyle(box, null).getPropertyValue('z-index'), 10);
		if (z_index == lowest)
		{
			box.style.backgroundColor = `rgba(140,200,140,1.0)`;
		}
	}
};


for (let island of document.body.children)
{
	round_island(island.children, 30, 30);
}
let yadd = 0;
let xadd = 0;
let x = 0;
let y = 0;

document.body.addEventListener('keydown', (e) => {
	let keycode = e.which || e.keyCode;
	if (keycode == 38)
	{
		--yadd;
	}
	else if (keycode == 40)
	{
		++yadd;
	}
	else if (keycode == 37)
	{
		--xadd;
	}
	else if (keycode == 39)
	{
		++xadd;
	}
});


let check_limits = () => {
	/*for (island of document.body.children)
	{
		let rect = island.getBoundingClientRect();
		console.log(rect);
		if (x + rect.left >= 0 && x + rect.right <= window.innerWidth)
		{
			if (y + rect.top >= 0 && y + rect.bottom <= window.innerHeight)
			{
				console.log(`no`);
				return;
			}
		}
	}*/
	let roundnum = 3000;
	let roundedx = round_num(x, roundnum);
	let roundedy = round_num(y, roundnum);
	console.log(roundedx, roundedy);
	for (limit of limits)
	{
		if (limit[0] == roundedx && limit[1] == roundedy)
		{
			return;
		}
	}
	limits.push([roundedx, roundedy]);
	console.log(`new islands ${x} ${y}`);
	if (xadd < 0)
	{
		if (yadd < 0)
		{
			create_islands(10, 15, 40, [-roundnum-x, -roundnum-y]);
		}
		else if (yadd > 0)
		{
			create_islands(10, 15, 40, [-roundnum-x, roundnum-y]);
		}
		else
		{
			create_islands(10, 15, 40, [-roundnum-x, -y]);
		}
	}
	else if (xadd > 0)
	{
		if (yadd < 0)
		{
			create_islands(10, 15, 40, [roundnum-x, -roundnum-y]);
		}
		else if (yadd > 0)
		{
			create_islands(10, 15, 40, [roundnum-x, roundnum-y]);
		}
		else
		{
			create_islands(10, 15, 40, [roundnum-x, -y]);
		}
	}
	else {
		if (yadd < 0)
		{
			create_islands(10, 15, 40, [-x, -roundnum-y]);
		}
		else if (yadd > 0)
		{
			create_islands(10, 15, 40, [-x, roundnum-y]);
		}
		else
		{
			create_islands(10, 15, 40, [-x, -y]);
		}
	}
};


let calculate_deg = () => {
	return Math.atan2(yadd, xadd) * 180 / Math.PI;
};
let airplane_anim = setInterval(() => {
	x -= xadd;
	y -= yadd;
	document.body.style.left = `${x}px`;
	document.body.style.top = `${y}px`;
	let airplane = document.querySelector('.airplane');
	airplane.style.transform = `rotate(${calculate_deg()}deg)`;
}, 100);



let map_gen_anim = setInterval(() => {
	check_limits();
}, 1000);


