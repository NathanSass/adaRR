var room;

var startingCoordinate = { x: 0, y: 0 };

var TOILET = {
	w: 5,
	d: 4.5,
	loc: 1
};

var roomCorners = [];

/**
** returns true if point is inside or on perimeter of room
**/
function isPointPerimeterOrInside(pt) {
	// y = max_y, x = max_x
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
			x: startPoint.x + fixture.w,
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
		newFixture.note = "secondHorz, 2nd";
	} else {
		newFixture.loc = {
			x: sPoint.x - fixture.loc,
			y: sPoint.y
		};
		newFixture.note = "secondHorz, 1st";
	}

	return newFixture;
}

/*** calculates for objects on: // [0,0], [0, 10]
** returns a toilet coord location
** automatically builds justified bottom, second point builds top (clockwise)
***/
function fixtureFirstVertical(fixture, startPoint) { // returns toilet coord location
	var sPoint;
	if (startPoint) {
		sPoint = {
			x: startPoint.x,
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
		newFixture.note = "firstVert, 2nd";
	} else {
		newFixture.loc = {
			x: sPoint.x,
			y: sPoint.y + fixture.loc
		};
		newFixture.note = "firstVert, 1st";
	}

	return newFixture;
}

/*** calculates for objects on: // [10,10], [10, 0]
** returns a toilet coord location
** automatically builds justified bottom, second point builds top (clockwise)
***/
function fixtureSecondVertical(fixture, startPoint) { // returns toilet coord location
	var sPoint;
	if (startPoint) {
		sPoint = {
			x: startPoint.x,
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
		newFixture.note = "secondVert, 2nd";
	} else {
		newFixture.loc = {
			x: sPoint.x,
			y: sPoint.y - fixture.loc
		};
		newFixture.note = "secondVert, 1st";
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
			x: startPoint.x - fixture.w,
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
		newFixture.note = "firstHorizontal, 2nd";
	} else {
		newFixture.loc = {
			x: sPoint.x + fixture.loc,
			y: sPoint.y
		};
		newFixture.note = "firstHorizontal, 1st";

	}

	return newFixture;
}

/*** Finds corners of the room
** Bases rr construction off of corners
** should advance array after using each on
***/
function findRoomCorners() {
	roomCorners.push(startingCoordinate);
	roomCorners.push({x: 0, y: room.y});
	roomCorners.push({x: room.x, y: room.y});
	roomCorners.push({x: room.x, y: 0});
}

/*** Advances the coordinate being worked with
** Used in loops, returns false when all coordinates used.
***/
function advanceStartingCoordinate() {
	var currentCoordI = roomCorners.indexOf(startingCoordinate);
	currentCoordI += 1;
	
	if( roomCorners[currentCoordI] ) {
		startingCoordinate = roomCorners[currentCoordI];
		console.log("starting coordinate is ", startingCoordinate);
		return true;
	} else {
		return false;
	}
}

function buildToilet() {
	var newToilets = [];
	
	// Catches [0,0]
	if ( (startingCoordinate.x === 0) && (startingCoordinate.y === 0) ) { // For [0,0] to [0, 10],
		console.log("first vertical");
		newToilets.push( fixtureFirstVertical(TOILET) );
		newToilets.push( fixtureFirstVertical(TOILET, {x: 0, y: room.y }) );
	}
	// Catches [0, 10]
	if ( (startingCoordinate.x === 0) && (startingCoordinate.y === room.y) ) { // For [0, 10] to [10, 10]
		console.log("first horizontal");
		newToilets.push( fixtureFirstHorizontal(TOILET) );
		newToilets.push( fixtureFirstHorizontal(TOILET, {x: room.x, y: room.y}) );
	}
	// Catches [10, 10]
	if ( (startingCoordinate.x === room.x) && (startingCoordinate.y === room.y ) ) { // [10, 10], [10,0]
		console.log("second vertical");
		newToilets.push( fixtureSecondVertical(TOILET) );
		newToilets.push( fixtureSecondVertical(TOILET, {x: room.x, y: 0 }) );
	}
	// Catches [10, 0]
	if ( (startingCoordinate.x === room.x) && (startingCoordinate.y === 0) ) { //  [10, 0], [0, 0]
		console.log("second horizontal");
		newToilets.push( fixtureSecondHoriz(TOILET) );
		newToilets.push( fixtureSecondHoriz(TOILET, {x: 0, y: 0 }) );
	}

		// var validToilet = true;

		// for (var coord in newToilet) { // checks that the coordinates are inside of the room
		// 	if (newToilet.hasOwnProperty(coord)) {
		// 		if ( isPointPerimeterOrInside(newToilet[coord]) ) { continue; }
		// 		validToilet = false;
		// 		break;
		// 	}
		// }
		// validToilet && console.log("We have a valid toilet");

	return newToilets;
}

/** Goes around the room and builds all possible fixtures
*** Currently only implemented for toilets
***/
function buildFixtureAroundRoom(fixtureBuilderFunc) {
	var allPossibleFixtures = [];
	do {
		allPossibleFixtures.push( fixtureBuilderFunc()[0] ); // BUGBUG: May have more possible
		allPossibleFixtures.push( fixtureBuilderFunc()[1] );
	} while( advanceStartingCoordinate() );
	return allPossibleFixtures;
}

function findPossibleToiletLocations() {
	var allPossibleToiletsArr = buildFixtureAroundRoom ( buildToilet );
	var validToiletArr = []; // This will get populated with toilets 
	allPossibleToiletsArr.forEach( function(toilet, i) {

		var validToilet = true;
		for (var coord in toilet) {
			if (toilet.hasOwnProperty(coord) && coord != "note") { // note is used for me to visually keep track of things
				
				if (isPointPerimeterOrInside( toilet[coord])) { continue; }
				validToilet = false;
				break;
			
			}
		
		}

		if (validToilet) {
			validToiletArr.push(toilet);
		}
	});

	return validToiletArr;
}

function findAcccesible (roomObj) {
	room = roomObj;

	findRoomCorners();
	var usefulToilets = findPossibleToiletLocations();
	console.log(usefulToilets);

	// buildToilet();

}


var sampleBathRoom = {
	x: 10,
	y: 10,
	
	door: {
		pos1: [1, 0],
		pos2: [4, 0]
	}
};
findAcccesible(sampleBathRoom);

