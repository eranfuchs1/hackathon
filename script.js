let last_x = 0;
let last_y = 0;
let random_airplanes = [];
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
let limits = [];
let hiddens = [];
let store_ns = () => {
	let my_ns = {};
	my_ns.beg = beg;
	my_ns.yadd = yadd;
	my_ns.xadd = xadd;
	my_ns.x = x;
	my_ns.y = y;
	my_ns.hours = hours;
	my_ns.steering = steering;
	my_ns.steering_deg = steering_deg;
	my_ns.speed = speed;
	my_ns.rounding = rounding;
	my_ns.landed = landed;
	my_ns.fire = fire;
	my_ns.inventory = inventory;
	my_ns.carrier_inventory = carrier_inventory;
	my_ns.jet_fuel = jet_fuel;
	my_ns.limits = limits;
	my_ns.random_airplanes = random_airplanes;
	return JSON.stringify(my_ns);
};
let load_ns = (ns) => {
	ns = JSON.parse(ns);
	x = ns['x']
	y = ns['y']
	beg = ns.beg
	yadd = ns.yadd
	xadd = ns.xadd
	hours = ns.hours
	steering = ns.steering
	steering_deg = ns.steering_deg
	speed = ns.speed
	rounding = ns.rounding
	landed = ns.landed
	fire = ns.fire
	inventory = ns.inventory
	carrier_inventory = ns.carrier_inventory
	jet_fuel = ns.jet_fuel
	limits = ns.limits
	random_airplanes = ns.random_airplanes
}

let round_num = (num, round) => {
	return Math.floor(num / round) * round;
};


let spawn_airport = (box) => {
	let airport = document.createElement('div');
	airport.setAttribute('class', 'airport');
	box.appendChild(airport);
};


limits.push([0,0]);


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
		box.attributes['data-collectable-item'] = 'fuel';
	}
	else
	{
		box.attributes['data-collectable-item'] = 'tree';
	}
};


let make_half_island = (boxes, div_width, div_height, location) => {
	let container = {};
	container.tagName = 'div';
	container.style = {};
	container.style.width = `${div_width * boxes[0].length}px`;
	container.style.height = `${div_height * boxes.length}px`;
	container.attributes = {};
	container.attributes['class'] = `container`;
	container.attributes['data-region'] = `${round_num(location[0], rounding)} ${round_num(location[1], rounding)}`;
	container.style.position = 'absolute';
	container.children = [];
	for (let i of boxes.keys())
	{
		for (let j of boxes[i].keys())
		{
			if (!boxes[i][j])
			{
				continue;
			}
			let div = {};
			let div_sand = {};
			div.tagName = 'div';
			div_sand.tagName = 'div';
			div.attributes = {};
			div.attributes['data-x'] = `${j}`;
			div.attributes['data-y'] = `${i}`;
			div.style = {};
			div.style.left = `${j * div_width}px`;
			div.style.top = `${i * div_height}px`;
			div.style.width = `${div_width}px`;
			div.style.height = `${div_height}px`;
			div.attributes['class'] = 'box';
			div.style.backgroundColor = random_rgba([155,155],[210, 255],[155, 155]);
			set_collectable_item(div);
			div.style.position = 'absolute';
			div_sand.style = {};
			div_sand.style.position = 'absolute';
			div_sand.style.left = `${j * div_width}px`;
			div_sand.style.top = `${i * div_height}px`;
			div_sand.style.width = `${div_width}px`;
			div_sand.style.height = `${div_height}px`;
			div_sand.style.backgroundColor = 'rgb(194, 178, 128)';
			div_sand.attributes = {};
			div_sand.attributes['data-x'] = `${j}`;
			div_sand.attributes['data-y'] = `${i}`;
			div_sand.attributes['class'] = `box_sand`;
			container.children.push(div_sand);
			container.children.push(div);
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


let parse_json_dom = (json) => {
	let dom_obj = document.createElement(json.tagName);
	if ('children' in json)
	{
		for (let child of json['children'])
		{
			dom_obj.appendChild(parse_json_dom(child));
		}
	}
	for (let key in json.style)
	{
		dom_obj.style[key] = json.style[key];
	}
	for (let key in json.attributes)
	{
		dom_obj.setAttribute(key, json.attributes[key]);
	}
	return dom_obj;
};

let create_islands = (min, max, number, location) => {
	let islands = [];
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

		let island = make_half_island(boxes, div_width, div_height, location); island.style.position = 'absolute';
		island.style.left = `${location[0] + Math.ceil(Math.random() * 100 * i)}px`
		island.style.top = `${location[1] + Math.ceil(Math.random() * 100 * i)}px`
		document.body.appendChild(parse_json_dom(island));
		islands.push(island);

	}
	return islands;
};


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
			jet_fuel -= 5;
			speed += 5
		}
		landed = false;
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
			if (speed - 1 >= 0)
			{
				speed -= 1;
			}
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
			speed += speed >= 20? -10: 0;
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
	let roundnum = rounding;
	let roundedx = round_num(coords[0], roundnum);
	let roundedy = round_num(coords[1], roundnum);
	for (let limit of limits)
	{
		if (limit[0] == roundedx && limit[1] == roundedy)
		{
			return;
		}
	}
	limits.push([roundedx, roundedy]);
	store_island(create_islands(5, 10, 5, [roundedx, roundedy]));
	for (let i of Array(1))
	{
		spawn_random_airplane([roundedx, roundedy]);
	}
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
	let clocks = document.body.querySelector('.fuel_clock');
	clocks.querySelector('.clock_speed').innerHTML = `<p>speed<br>${speed}</p>`;
	clocks.querySelector('.clock_fuel').innerHTML = `<p>fuel<br>${jet_fuel}</p>`;
	clocks.querySelector('.terminal').innerHTML = `<p>inventory ${inventory_string(inventory)}coords[${-x},${-y}]</p>`;
}, 100);


let landing_checker = setInterval(() => {
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
	for (let i = -2; i <= 2; i++)
	{
		for (let j = -2; j <= 2; j++)
		{
			check_limits([-x + (j * rounding), -y + (i * rounding)]);
		}
	}
}, 100);

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

let radar = (airplane_div) => {
	let comp = Math.atan2(airplane_div[1] + ( - window.innerHeight / 2) + y, airplane_div[0] + ( - window.innerWidth / 2) + x) * 180 / Math.PI;
	return comp
};

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
				let below = document.elementsFromPoint(j, i);
				for (let bombed of below)
				{
					if (bombed.getAttribute('class') == 'box_sand')
					{
						bombed.style.backgroundColor = `gray`;
					}
					if (bombed.getAttribute('class') == 'box')
					{
						let item = bombed.getAttribute('data-collectable-item');
						if (item == 'fuel' && inventory['fuel'].length < 2000)
						{
							inventory['fuel'].push(100);
						}
						else if (item == 'tree' && inventory['trees'].length < 2000)
						{
							inventory['trees'].push(bombed);
						}
						bombed.remove();
					}
					else if (bombed.getAttribute('class') == 'random_airplane')
					{
						inventory['fuel'].push(10000);
						bombed.remove();
					}
				}
			}
		}
	}, 400);
	setTimeout(() => {
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
			jet_fuel += 100;
			carrier_inventory['jet_fuel']-= 100;
		}
	}
}, 100);



let spawn_random_airplane = (area) => {
	if (random_airplanes.length > 5)
	{
		return;
	}
	let random_deg = Math.floor(Math.random() * 360);
	let airplane_div = document.createElement('div');
	let radardiv = document.createElement('div');
	radardiv.setAttribute('class', 'radar');
	radardiv.setAttribute('id', `radar${random_airplanes.length}`);
	radardiv.style.transform = `rotate(${radar(airplane_div)}deg)`;
	radardiv.innerHTML = '&#8594;';
	airplane_div.setAttribute('class', 'random_airplane');
	airplane_div.style.color = 'red';
	airplane_div.style.transform = `rotate(${random_deg}deg)`;
	airplane_div.style.left = area[0];
	airplane_div.style.top = area[1];
	airplane_div.style.width = '100px';
	airplane_div.style.zIndex = '7000';
	airplane_div.innerHTML = '<img src="fighter_jet.png" width="100px">';
	airplane_div.setAttribute('id', `airplane${random_airplanes.length}`)
	document.body.appendChild(airplane_div);
	document.body.appendChild(radardiv);
	random_airplanes.push({'airplane_div': airplane_div.getAttribute('id'), 'radardiv': radardiv.getAttribute('id'), 'random_deg': random_deg, 'area': area, 'd': 45});
};
setInterval(() => {
	for (let i of random_airplanes.keys())
	{
		if (!random_airplanes[i])
		{
			random_airplanes.pop(i);
		}
	}
	for (let i of random_airplanes.keys())
	{
		let airplane_obj = random_airplanes[i];
		let airplane_div = document.getElementById(airplane_obj['airplane_div']);
		let random_deg = airplane_obj['random_deg'];
		let area = airplane_obj['area'];
		let d = airplane_obj['d'];
		let radardiv = document.getElementById(airplane_obj['radardiv']);
		if (!document.body.contains(airplane_div))
		{
			radardiv.remove();
			delete random_airplanes[i];
			continue;
		}
		area[0] += Math.cos(random_deg * Math.PI / 180) * d;
		area[1] += Math.sin(random_deg * Math.PI / 180) * d;
		airplane_div.style.left = `${area[0]}px`;
		airplane_div.style.top = `${area[1]}px`;
		radardiv.style.transform = `rotate(${radar(area)}deg)`;
		if (round_num(-x, rounding) == round_num(area[0], rounding) && round_num(-y, rounding) == round_num(area[1], rounding))
		{
			radardiv.style.visibility = 'visible';
		}
		else
		{
			radardiv.style.visibility = 'hidden';
		}
	}
}, 100);

let radar_map = setInterval(() => {
	let locations = [];
	for (let div of document.body.querySelectorAll('.container'))
	{
		locations.push([Math.ceil((parseInt(div.style.left.replace(/px/, '')) + x)/ (rounding / 10)), Math.ceil((parseInt(div.style.top.replace(/px/, '')) + y) / (rounding/ 10))])
	}
	for (let div of document.body.querySelector('.radar_map').children)
	{
		div.remove();
		delete div;
	}
	for (let loc of locations)
	{
		let dot = document.createElement('div');
		dot.style.position = 'absolute';
		dot.style.width = '1px';
		dot.style.height = '1px';
		dot.style.backgroundColor = 'yellow';
		dot.style.left = `${100 + loc[0]}px`;
		dot.style.top = `${100 + loc[1]}px`;
		document.body.querySelector('.radar_map').appendChild(dot);
	}
}, 2000);

let radar_map2 = setInterval(() => {
	let locations = [];
	for (let div of document.body.querySelectorAll('.random_airplane'))
	{
		locations.push([Math.ceil((parseInt(div.style.left.replace(/px/, '')) + x) / (rounding / 10)), Math.ceil((parseInt(div.style.top.replace(/px/, '')) + y) / (rounding/ 10))])
	}
	for (let div of document.body.querySelector('.random_airplane').children)
	{
		div.remove();
		delete div;
	}
	for (let loc of locations)
	{
		let dot = document.createElement('div');
		dot.style.position = 'absolute';
		dot.style.width = '4px';
		dot.style.height = '4px';
		dot.style.backgroundColor = 'red';
		dot.style.zIndex = '100';
		dot.style.left = `${100 + loc[0]}px`;
		dot.style.top = `${100 + loc[1]}px`;
		document.body.querySelector('.radar_map').appendChild(dot);
	}
}, 500);


let store_limit = (limit) => {
	let html = '';
	for (let island of document.querySelectorAll(`[data-region*="${limit[0]} ${limit[1]}"]`))
	{
		html += island.outerHTML;
	}
	return html
};
let store_everything = () => {
	let xhttp = new XMLHttpRequest();
	xhttp.open("POST", "ajax_info.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(`html=${btoa(encodeURI(document.body.innerHTML))}&js_namespace=${btoa(encodeURI(store_ns()))}`);
};
let load_island = async (data_region) => {
	let xhttp = new XMLHttpRequest();
	xhttp.responseType = 'json';
	xhttp.onreadystatechange = function() {
		if (this.response)
		{
			for (let key in this.response)
			{
				let div = parse_json_dom(this.response[key]);
				document.body.appendChild(div);
			}
		}
	};
	xhttp.open("GET", `http://127.0.0.1:3000/api?xy=${encodeURI(data_region)}`, true);
	xhttp.send();
};
let store_island = (island) => {
	let xhttp = new XMLHttpRequest();
	xhttp.open("POST", "http://127.0.0.1:3000/api", true);
	xhttp.setRequestHeader("Content-Type", "application/json;charset=ASCII");
	xhttp.send(JSON.stringify({'xy':island[0].attributes['data-region'], 'data':island}));
};
let load_everything = () => {
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.body.innerHTML = decodeURI(atob(this.responseText));
		}
	};
	xhttp.open("POST", "ajax_info.php", true);
	xhttp.send();
};
let load_everything_js = () => {
	let xhttp = new XMLHttpRequest();
	xhttp.open("GET", "ajax_info.php?js=true", true);
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			load_ns(decodeURI(atob(this.responseText)));
		}
	};
	xhttp.send();
};

let hider_func = (j, k) => {
	for (let i of hiddens.keys())
	{
		let island = hiddens[i];
		if (!island.hasAttribute('data-region'))
		{
			continue;
		}
		if (island.getAttribute('data-region') == `${round_num(x, rounding) + j} ${round_num(y, rounding) + k}`)
		{
			document.body.appendChild(hiddens.pop(i));
		}
	}
};


let repeater_8 = (xremote,yremote,callback) => {
	for (let i = -yremote; i <= yremote; i++)
	{
		for (let j = -xremote; j <= xremote; j++)
		{
			callback(`${round_num(x, rounding) + j * rounding} ${round_num(y, rounding) + i * rounding}`);
		}
	}
};

let hider_anim = setInterval(() => {
	if (last_x == round_num(x, rounding) && last_y == round_num(y, rounding))
	{
		return;
	}
	last_x = round_num(x, rounding);
	last_y = round_num(y, rounding);

	let xy_adder = 3;
	for (let island of document.body.children)
	{
		if (!island.hasAttribute('data-region'))
		{
			continue;
		}
		let xy = island.getAttribute('data-region').split(' ');
		let xy_x = parseInt(xy[0]);
		let xy_y = parseInt(xy[1]);
		let max_x = round_num(x + xy_adder * rounding, rounding);
		let max_y = round_num(y + xy_adder * rounding, rounding);
		let min_x = round_num(x - xy_adder * rounding, rounding);
		let min_y = round_num(y - xy_adder * rounding, rounding);
		if (xy_x > max_x || xy_x < min_x || xy_y > max_y || xy_y < min_y)
		{
			island.remove();
			delete island
		}
	}
	repeater_8(xy_adder,xy_adder, load_island);
}, 100);
