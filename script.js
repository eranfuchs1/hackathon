let beg = true;
let yadd = 0;
let xadd = 0;
let x = 0;
let y = 0;
let hours = 6;
let steering_deg = 0;
let steering = 0;
let speed = 0;
let speed_limit = 400;
let rounding = 5000;
let landed = true;
let fire = false;
let inventory = {'trees':[],'fuel':[]};
let carrier_inventory = {'trees':[], 'fuel':[], 'jet_fuel':0};
let jet_fuel = 1000;

let round_num = (num, round) => {
	return Math.floor(num / round) * round;
};


let spawn_airport = (box) => {
	let airport = document.createElement('div');
	airport.setAttribute('class', 'airport');
	box.appendChild(airport);
	console.log(`airport spawned!`);
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

let set_collectable_item = (box) => {
	let chance = Math.random();
	if (chance > 0.7)
	{
		box.setAttribute('data-collectable-item', 'fuel');
	}
	else
	{
		box.setAttribute('data-collectable-item', 'tree');
	}
};


let make_half_island = (boxes, div_width, div_height) => {
	let container = document.createElement('div');
	container.style.width = `${div_width * boxes[0].length}px`;
	container.style.height = `${div_height * boxes.length}px`;
	container.setAttribute('data-region', `${round_num(x, rounding)} ${round_num(y, rounding)}`);
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
			set_collectable_item(div);
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
			div_sand.setAttribute('class', `box_sand`);
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
		if (i == number - 1)
		{
			//spawn_airport(island);
		}
		document.body.appendChild(island);

	}
};
//create_islands(30, 40, 40, [-1000,-1000]);
//create_islands(10, 15, 40, [-1000,-1000]);
//create_islands(10, 15, 40, [-1000,-1000]);


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


for (let island of Array.from(document.body.children).filter(child => {if (child.tagName == 'div') {return child}}))
{
	round_island(island.children, 30, 30);
}

document.body.addEventListener('keyup', (e) => {
	let keycode = e.which || e.keyCode;
	if (keycode == 37 || keycode == 39)//left
	{
		steering = 0;
	}
	if (keycode == 38)//up
	{
		document.body.querySelector('.airplane').children[0].setAttribute('src', 'fighter_jet.png');
		fire = false;
	}
});
document.body.addEventListener('keydown', (e) => {
	let keycode = e.which || e.keyCode;
	if (keycode == 38)//up
	{
		if (jet_fuel <= 0)
		{
			return;
		}
		else
		{
			--jet_fuel;
		}
		landed = false;
		speed < speed_limit? ++speed: ++speed;
		if (!fire)
		{
			fire = true;
		}
		document.body.querySelector('.airplane').children[0].setAttribute('src', 'fighter_jet_fire.png');
	}
	else if (keycode == 40)//down
	{
		if (check_landing())
		{
			speed > 0? --speed : speed;
			if (speed == 0)
			{
				let tire_screech = document.body.querySelector('.tire_screech');
				if (!landed)
				{
					tire_screech.play();
					tire_screech.autoplay = false;
					landed = true;
				}
			}
		}
		else
		{
			speed += speed > 6? -1: 0;
		}
	}
	else if (keycode == 37)//left
	{
		if (steering > -2)
		{
			steering -= 0.5;
		}
		steering_deg += steering;
	}
	else if (keycode == 39)//right
	{
		if (steering < 2)
		{
			steering += 0.5;
		}
		steering_deg += steering;
	}
	else if (keycode == 32)
	{
		bomb_func([(window.innerWidth / 2)-x,(window.innerHeight / 2)-y]);
	}
	else if (keycode == 65)
	{
		photosnap();
	}
});


let check_limits = (coords) => {
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
	let roundnum = rounding;
	let roundedx = round_num(coords[0], roundnum);
	let roundedy = round_num(coords[1], roundnum);
	//console.log(roundedx, roundedy);
	for (limit of limits)
	{
		if (limit[0] == roundedx && limit[1] == roundedy)
		{
			return;
		}
	}
	limits.push([roundedx, roundedy]);
	create_islands(5, 10, 20, [roundedx, roundedy]);
	//console.log(`new islands ${x} ${y}`);
	/*
	if (xadd < 0)
	{
		if (yadd < 0)
		{
			create_islands(10, 15, 40, [roundedx, -roundnum-y-1000]);
		}
		else if (yadd > 0)
		{
			create_islands(10, 15, 40, [-roundnum-x-1000, roundnum-y-1000]);
		}
		else
		{
			create_islands(10, 15, 40, [-roundnum-x-1000, -y-1000]);
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
	}*/
};

let photosnap = () => {
	let below = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2);
	for (let obj of below)
	{
		if (obj.getAttribute('data-region'))
		{
			let d = 10.0;
			let j = (window.innerWidth / 2) -x + (Math.cos(steering_deg * Math.PI / 180) * d);
			let i = (window.innerHeight / 2) -y + (Math.sin(steering_deg * Math.PI / 180) * d);
			console.log(`steering_deg${steering_deg}`);
			console.log(`j${j} i${i}`);
			console.log(`x${x} y${y}`);
			console.log(obj.style.left, obj.style.top);
			console.log(obj.style.width, obj.style.height);
			break;
		}
	}
};

let sound = document.body.querySelector('.airplane_sound');
sound.mozPreservesPitch = false;

let calculate_deg = () => {
	return speed > 10? Math.atan2(yadd, xadd) * 180 / Math.PI : steering_deg;
};

let check_landing = () => {
	//let island = document.querySelector(`[data-region="${round_num(x, rounding)} ${round_num(y, rounding)}"]`);
	let below = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2);
	for (let box of below)
	{
		if (box.hasAttribute('class'))
		{
			if (box.getAttribute('class').match(/airport/))
			{
				return true;
			}
		}
	}
	return false;
};


let inventory_string = (obj) => {
	let answer = '{';
	for (key in obj)
	{
		if (typeof(obj[key]) == typeof(['type of', 'array']))
		{
			answer += `${key}: ${obj[key].length},`;
		}
		else
		{
			answer += `${key}: ${obj[key].toString()},`;
		}
	}
	answer += '}';
	return answer;
};


let airplane_steering_anim = setInterval(() => {
	let airplane = document.querySelector('.airplane');
	airplane.style.transform = `rotate(${calculate_deg()}deg)`;
	if (steering_deg < 0)
	{
		steering_deg += 360;
	}
	else if (steering_deg > 360)
	{
		steering_deg -= 360;
	}
	xadd = Math.floor(speed * Math.cos(steering_deg * (Math.PI / 180)));
	yadd = Math.floor(speed * Math.sin(steering_deg * (Math.PI / 180)));
}, 40);

let airplane_anim = setInterval(() => {
	if (beg)
	{
		init_on_airport();
		beg = false;
	}
	x -= xadd;
	y -= yadd; document.body.style.left = `${x}px`;
	document.body.style.top = `${y}px`;
	//document.body.querySelector('.fuel_clock').innerHTML = `speed: ${speed} coords: [x:${-x}, y:${-y}] fuel: ${jet_fuel} inventory: ${inventory_string(inventory)}`;
	let clocks = document.body.querySelector('.fuel_clock');
	clocks.querySelector('.clock_speed').innerHTML = `<p>speed<br>${speed}</p>`;
	clocks.querySelector('.clock_fuel').innerHTML = `<p>fuel<br>${jet_fuel}</p>`;
	clocks.querySelector('.terminal').innerHTML = `<p>inventory ${inventory_string(inventory)}</p>`;
}, 100);


let landing_checker = setInterval(() => {
	if (check_landing())
	{
		//console.log(`can land! coords: [${-x},${-y}]`);
	}
	if (landed)
	{
		for (let item in inventory)
		{
			if (inventory[item].length == 0)
			{
				continue;
			}
			carrier_inventory[item].push(inventory[item][0]);
			inventory[item].pop(0);
		}
	}
}, 100);

let airplane_sound_anim = setInterval(() => {
	if (speed < speed_limit)
	{
		sound.playbackRate = 4 * speed / speed_limit;
		sound.volume = speed / speed_limit;
	}
	else
	{
		sound.playbackRate = 4;
	}
}, 10);


let map_gen_anim = setInterval(() => {
	check_limits([-x, -y]);
	check_limits([rounding-x, -y]);
	check_limits([-x, rounding-y]);
	check_limits([rounding -x, rounding-y]);
}, 1000);

let make_sunshine = (hours) => {
	if (hours < 5)
	{
		return 0;
	}
	else if (hours < 12)
	{
		return hours - 5;
	}
	else if (hours < 19)
	{
		return 14 - (hours - 5);
	}
	else
	{
		return 0;
	}
	return 0;
};

/*let time = new Date();
console.log(time.getHours());
document.body.style.backgroundColor = `rgb(10, 10,${Math.floor((make_sunshine(time.getHours()) * (7 / 100)) * 100)})`;*/

hours = hours < 23 ? ++hours : 0;
document.body.style.backgroundColor = `rgb(10, 70,${50 + Math.floor((make_sunshine(hours) * (200 / 7)))})`;
setInterval(() => {
	hours = hours < 23 ? ++hours : 0;
	document.body.style.backgroundColor = `rgb(10, 70,${50 + Math.floor((make_sunshine(hours) * (200 / 7)))})`;
}, 1000 * 30);


let init_on_airport = () => {
	let airport = document.querySelector('.airport');
	let rect = airport.getBoundingClientRect();
	x = -(rect.left - (window.innerWidth / 2)) -330;
	y = -(rect.top - (window.innerHeight / 2)) -130;
};


spawn_airport(document.body);


let compass = () => {
	let airport = document.querySelector('.airport');
	let rect = airport.style;
	let comp = Math.atan2(-300 - rect.top + y , - rect.left + x) * 180 / Math.PI;
	return comp
};

let compass_anim = setInterval(() => {
	let comp = compass();
	document.body.querySelector('.compass').style.transform = `rotate(${comp}deg)`;
}, 50);

let bomb_func = (pos) => {
	if (check_landing())
	{
		return;
	}
	let bomb_div = document.createElement('div');
	bomb_div.setAttribute('class', 'bomb');
	bomb_div.style.left = `${pos[0]}px`;
	bomb_div.style.top = `${pos[1]}px`;
	bomb_div.style.zIndex = '10000';
	document.body.appendChild(bomb_div);
	setTimeout(() => {
		let explosion = document.createElement('div');
		explosion.setAttribute('class', 'explosion');
		explosion.style.left = '-50px';
		explosion.style.top = '-50px';
		bomb_div.appendChild(explosion);
		let bomb_sound = new Audio('explosion.mp3');
		bomb_sound.play();
		bomb_sound.autoplay = 'false';
		bomb_div.appendChild(bomb_sound);

	}, 300);
	setTimeout(() => {
		for (let i = y + pos[1] - 10; i <= y + pos[1] + 10; i += 10)
		{
			for (let j = x + pos[0] - 10; j <= x + pos[0] + 10; j += 10)
			{
				console.log(j, i);
				let below = document.elementsFromPoint(j, i);
				console.log(below);
				for (let bombed of below)
				{
					if (bombed.getAttribute('class') == 'box_sand')
					{
						bombed.style.backgroundColor = `gray`;
					}
				if (bombed.getAttribute('class') == 'box') //|| bombed.getAttribute('class') == 'box_sand')
					{
						let item = bombed.getAttribute('data-collectable-item');
						if (item == 'fuel' && inventory['fuel'].length < 2000)
						{
							inventory['fuel'].push(10);
						}
						else if (item == 'tree' && inventory['trees'].length < 2000)
						{
							inventory['trees'].push(bombed);
						}
						bombed.remove();
						break;
					}
				}
			}
		}
		bomb_div.remove();
	}, 2000);
};

let carrier_anim = setInterval(() => {
	if (carrier_inventory['fuel'].length > 0)
	{
		carrier_inventory['jet_fuel'] += carrier_inventory['fuel'][0];
		carrier_inventory['fuel'].pop(0);
	}
	if (landed)
	{
		if (carrier_inventory['jet_fuel'] > 0)
		{
			jet_fuel++;
			carrier_inventory['jet_fuel']--;
		}
	}
}, 100);

let cockpit_sights_func = () => {
	for (let d = 1; d < 1000; d += 100)
	{
		let j = (window.innerWidth / 2)  - x + (Math.cos(steering_deg * Math.PI / 180) * d);
		let i = (window.innerHeight / 2) - y + (Math.sin(steering_deg * Math.PI / 180) * d);
		let div = document.createElement('div');
		div.style.position = 'absolute';
		div.style.width = '600px';
		div.style.height = '600px';
		div.style.left = `${-j-300}px`;
		div.style.top = `${-i-300}px`;
		document.body.appendChild(div);
		let zone = document.querySelectorAll(`[data-region="${round_num(j, rounding)} ${round_num(i, rounding)}"]`);
		let rect = div.getBoundingClientRect();
		for (let islands of zone)
		{
			if ([...islands.children].some(island => island.getBoundingClientRect().top > div.getBoundingClientRect().top && island.getBoundingClientRect().bottom < div.getBoundingClientRect().bottom && island.getBoundingClientRect().left > div.getBoundingClientRect().left && island.getBoundingClientRect().right < div.getBoundingClientRect().right))
			{
				console.log(`land!${[x, y].toString()}`);
			}
		}
		div.remove();
		/*
		{
			let mleft = parseInt(island.style.left.replace(/px$/, ''));
			let mright = mleft + parseInt(island.style.width.replace(/px$/, ''));
			let mtop = parseInt(island.style.top.replace(/px$/, ''));
			let mbottom = mtop + parseInt(island.style.height.replace(/px$/, ''));
			let mleft = island.offset().left;
			let mtop = island.offset().top;
			let mright =  mleft + 300;
			let mbottom = mtop + 300;
			if (rect.left >= mleft && rect.left <= mright)
			{
				if (rect.top >= mtop && rect.top <= mbottom)
				{
					alert(`left: ${mleft}, right: ${mright}, top: ${mtop}, bottom: ${mbottom}, x: ${x}, y:${y}, i: ${i}, j:${j}`);
					return;
				}
			}
		}*/
	}
};

//let cockpit_sights = setInterval(() => {
	//cockpit_sights_func();
//}, 400);
