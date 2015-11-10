var room;

var startingCoordinate = { x: 0, y: 0 };

var TOILET = {
	w: 5,
	d: 4.5,
	loc: 1
};

function isPointPerimeterOrInside(pt) {
	return pt.y <= room.y && pt.x <= room.x;
	// pt.y >= bounding.min_y && pt.y <= bounding.max_y && pt.x <= bounding.max_x && pt.x >= bounding.min_x // checks if on perimter
}

/*** calculates for objects on: // [10,0], [0, 0]
** returns a toilet coord location
** automatically builds justified right second point builds right (origin) (clockwise)
***/
function fixtureSecondHoriz(fixture, startPoint) { // returns toilet coord location,
	var sPoint;
	if (startPoint) {
		sPoint = {
			x: startingCoordinate.x + fixture.w,
			y: startPoint.y
		};
	} else {
		sPoint = { x: startingCoordinate.x, y: startingCoordinate.y };
	}

	var newFixture = {
		w1: sPoint,
	};
	
	newFixture.w2 = {
		x: sPoint.x - fixture.w,
		y: sPoint.y
	};

	newFixture.d1 = {
		x: sPoint.x,
		y: sPoint.y + fixture.d
	};

	newFixture.d2 = {
		x: sPoint.x - fixture.w,
		y: sPoint.y + fixture.d
	};

	if (startPoint) {
		newFixture.loc = {
			x: sPoint.x - fixture.w + fixture.loc,
			y: sPoint.y
		};
	} else {
		newFixture.loc = {
			x: sPoint.x - fixture.loc,
			y: sPoint.y
		};
	}

	return newFixture;
}

/*** calculates for objects on: // [0,0], [0, 10]
** returns a toilet coord location
** automatically builds justified bottom, second point builds top (clockwise)
***/
function fixtureFirstVerical(fixture, startPoint) { // returns toilet coord location
	var sPoint;
	if (startPoint) {
		sPoint = {
			x: startingCoordinate.x,
			y: startPoint.y - fixture.w
		};
	} else {
		sPoint = { x: startingCoordinate.x, y: startingCoordinate.y };
	}

	var newFixture = {
		w1: sPoint,
	};
	
	newFixture.w2 = {
		x: sPoint.x,
		y: sPoint.y + fixture.w
	};

	newFixture.d1 = {
		x: sPoint.x + fixture.d,
		y: sPoint.y
	};

	newFixture.d2 = {
		x: sPoint.x + fixture.d,
		y: sPoint.y + fixture.w
	};

	if (startPoint) {
		newFixture.loc = {
			x: sPoint.x,
			y: sPoint.y + fixture.w - fixture.loc
		};
	} else {
		newFixture.loc = {
			x: sPoint.x,
			y: sPoint.y + fixture.loc
		};
	}

	return newFixture;
}

/*** calculates for objects on: // [10,10], [10, 0]
** returns a toilet coord location
** automatically builds justified bottom, second point builds top (clockwise)
***/
function fixtureSecondVerical(fixture, startPoint) { // returns toilet coord location
	var sPoint;
	if (startPoint) {
		sPoint = {
			x: startingCoordinate.x,
			y: startPoint.y + fixture.w
		};
	} else {
		sPoint = { x: startingCoordinate.x, y: startingCoordinate.y };
	}

	var newFixture = {
		w1: sPoint,
	};
	
	newFixture.w2 = {
		x: sPoint.x,
		y: sPoint.y - fixture.w
	};

	newFixture.d1 = {
		x: sPoint.x - fixture.d,
		y: sPoint.y
	};

	newFixture.d2 = {
		x: sPoint.x - fixture.d,
		y: sPoint.y - fixture.w
	};

	if (startPoint) {
		newFixture.loc = {
			x: sPoint.x,
			y: sPoint.y + fixture.w - fixture.loc
		};
	} else {
		newFixture.loc = {
			x: sPoint.x,
			y: sPoint.y - fixture.loc
		};
	}

	return newFixture;
}

/*** calculates for objects on: // [0,10], [10, 10]
** returns a toilet coord location
** automatically builds justified left, second point builds right (clockwise)
***/
function fixtureFirstHorizontal(fixture, startPoint) { // returns toilet coord location
	var sPoint;
	if (startPoint) {
		sPoint = {
			x: startingCoordinate.x - fixture.w,
			y: startPoint.y
		};
	} else {
		sPoint = { x: startingCoordinate.x, y: startingCoordinate.y };
	}

	var newFixture = {
		w1: sPoint,
	};
	
	newFixture.w2 = {
		x: sPoint.x + fixture.w,
		y: sPoint.y
	};

	newFixture.d1 = {
		x: sPoint.x,
		y: sPoint.y - fixture.d
	};

	newFixture.d2 = {
		x: sPoint.x + fixture.w,
		y: sPoint.y - fixture.d
	};

	if (startPoint) {
		newFixture.loc = {
			x: sPoint.x + fixture.w - fixture.loc,
			y: sPoint.y
		};
	} else {
		newFixture.loc = {
			x: sPoint.x + fixture.loc,
			y: sPoint.y
		};
	}

	return newFixture;
}

function buildToilet() {
	var newToilet;
	
	if ( (startingCoordinate.x === 0) && (startingCoordinate.y <= room.y) ) { 
		console.log("first vertical");
		newToilet = fixtureFirstVerical(TOILET, {x: 0, y: 7});
	} // [0,0], [0, 10]
	
	// if ( (startingCoordinate.x >= 0) && (startingCoordinate.y === 0) ) { // [0, 0], [10, 0]
	// 	console.log("first horizontal");
	// 	newToilet = fixtureSecondHoriz(TOILET);
	// }

	// if ( (startingCoordinate.x === room.x) && (startingCoordinate.y >= 0 ) ) { console.log("first vertical"); } // [10,0] , [10, 10]

	// if ( (startingCoordinate.x <= room.x) && (startingCoordinate.y === room.y) ) { console.log("second horizontal"); } // [0, 10], [10, 10]

	
	startingCoordinate = {x: 0, y: 0};
	var b = fixtureSecondHoriz(TOILET, {x: 0, y:0});
	b;

	var validToilet = true;

	for (var coord in newToilet) { // checks that the coordinates are inside of the room
		if (newToilet.hasOwnProperty(coord)) {
			if ( isPointPerimeterOrInside(newToilet[coord]) ) { continue; }
			validToilet = false;
			break;
		}
	}
	validToilet && console.log("We have a valid toilet");
}

function findAcccesible (roomObj) {
	room = roomObj;

	buildToilet();

}


var pt = {y: 3, x: 2};
var bounding = {
	min_y: 0,
	min_x: 0,
	max_y: 7,
	max_x: 7
};

// pt.y >= bounding.min_y && pt.y <= bounding.max_y && pt.x <= bounding.max_x && pt.x >= bounding.min_x // checks if on perimter
// pt.y > bounding.min_y && pt.y < bounding.max_y && pt.x<bounding.max_x && pt.x > bounding.min_x // checks if inside

// var pt = { y: 3, x: 2 };




var sampleBathRoom = {
	x: 7,
	y: 7,
	
	door: {
		pos1: [1, 0],
		pos2: [4, 0]
	}
};
findAcccesible(sampleBathRoom);

