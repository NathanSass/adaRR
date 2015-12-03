var ROOM;

var startingCoordinate = { x: 0, y: 0 };

var TOILET = {
	w: 5,
	d: 5,
	loc: 1.5
};

var roomCorners = [];

/*
	returns true if point is inside or on perimeter of room
*/
function isPointPerimeterOrInsideRoom(pt) { //Currently not being used
	return pt.y <= ROOM.y && pt.x <= ROOM.x;
	// pt.y >= bounding.min_y && pt.y <= bounding.max_y && pt.x <= bounding.max_x && pt.x >= bounding.min_x // checks if on perimter
}

function _intSortMinToMax (a, b) {
	return a > b ? 1 : a < b ? -1 : 0;
}

/* 
	Tests a point if it is inside a given bounding fixture.
	returns true if point is inside or on perimeter of room
*/
function isPointPerimetorInsideRectangle(pt, fixture) {
	var max_x, min_x, max_y, min_y;
	var allX = [];
	var allY = [];
	
	for ( var coord in fixture) {
		if ( fixture.hasOwnProperty(coord) && coord != "note" ) {
			allX.push( fixture[coord].x );
			allY.push( fixture[coord].y );
		}
	}

	allX = allX.sort( _intSortMinToMax );
	allY = allY.sort( _intSortMinToMax );

	var boundingMax_x = allX[allX.length - 1];
	var boundingMin_x = allX[0];
	var boundingMax_y = allY[allY.length - 1];
	var boundingMin_y = allY[0];
	
	return pt.y >= boundingMin_y && pt.y <= boundingMax_y && pt.x <= boundingMax_x && pt.x >= boundingMin_x; // checks if on perimeter
}

/*
	calculates for objects on: // [10,0], [0, 0]
	returns a toilet coord location
	automatically builds justified right second point builds right (origin) (clockwise)
*/
function fixtureFirstHorizontal(fixture, startPoint) { // returns toilet coord location,
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
		y: sPoint.y + fixture.d
	};

	newFixture.d2 = {
		x: sPoint.x + fixture.w,
		y: sPoint.y + fixture.d
	};

	if (startPoint) {
		newFixture.loc = {
			x: sPoint.x + fixture.w - fixture.loc,
			y: sPoint.y
		};
		newFixture.note = "firstHorz, 2nd";
	} else {
		newFixture.loc = {
			x: sPoint.x + fixture.loc,
			y: sPoint.y
		};
		newFixture.note = "firstHorz, 1st";
	}

	return newFixture;
}

/*
	calculates for objects on: // [0,0], [0, 10]
 	returns a toilet coord location
 	automatically builds justified bottom, second point builds top (clockwise)
*/
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
		x: sPoint.x + fixture.d,
		y: sPoint.y
	};

	newFixture.d2 = {
		x: sPoint.x + fixture.d,
		y: sPoint.y - fixture.w
	};

	if (startPoint) {
		newFixture.loc = {
			x: sPoint.x,
			y: sPoint.y - fixture.w + fixture.loc
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

/*
	calculates for objects on: // [10,10], [10, 0]
	returns a toilet coord location
	automatically builds justified bottom, second point builds top (clockwise)
*/
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
		x: sPoint.x - fixture.d,
		y: sPoint.y
	};

	newFixture.d2 = {
		x: sPoint.x - fixture.d,
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

/*
	calculates for objects on: // [0,10], [10, 10]
	returns a toilet coord location
	automatically builds justified left, second point builds right (clockwise)
*/
function fixtureSecondHorizontal(fixture, startPoint) { // returns toilet coord location
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
		y: sPoint.y - fixture.d
	};

	newFixture.d2 = {
		x: sPoint.x - fixture.w,
		y: sPoint.y - fixture.d
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

/*
	Finds corners of the room
	Bases rr construction off of corners
	should advance array after using each on
*/
function findRoomCorners() {
	roomCorners.push(startingCoordinate);
	roomCorners.push({x: ROOM.x, y: 0});
	roomCorners.push({x: ROOM.x, y: ROOM.y});
	roomCorners.push({x: 0, y: ROOM.y});
}

/*
	Advances the coordinate being worked with
	Used in loops, returns false when all coordinates used.
*/
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

/*
	Uses startingCoordinate to determine which vertex to begin bulding a toilet from
	returns two toilets, one on each side of the line segment
	should get run in a loop that increments the startingCoordinate
*/
function buildToilet() {
	var newToilets = [];
	
	// Catches [0,0]
	if ( (startingCoordinate.x === 0) && (startingCoordinate.y === 0) ) { // For [0, 0] to [10,0] 
		console.log("first horizontal");
		newToilets.push( fixtureFirstHorizontal(TOILET) );
		newToilets.push( fixtureFirstHorizontal(TOILET, {x: ROOM.x, y: 0 }) );
	}1
	// Catches [10, 0]
	if ( (startingCoordinate.x === ROOM.x) && (startingCoordinate.y === 0) ) { //  [10, 0], [10, 10]
		console.log("first vertical");
		newToilets.push( fixtureFirstVertical(TOILET) );
		newToilets.push( fixtureFirstVertical(TOILET, {x: ROOM.x, y: ROOM.y }) );
	}
	// Catches [10, 10]
	if ( (startingCoordinate.x === ROOM.x) && (startingCoordinate.y === ROOM.y ) ) { // [10, 10], [10,0]
		console.log("second horizontal");
		newToilets.push( fixtureSecondHorizontal(TOILET) );
		newToilets.push( fixtureSecondHorizontal(TOILET, {x: 0, y: ROOM.y}) );
	}
	// Catches [0, 10]
	if ( (startingCoordinate.x === 0) && (startingCoordinate.y === ROOM.y) ) { // For [0, 10] to [0, 0]
		console.log("second vertical");
		newToilets.push( fixtureSecondVertical(TOILET) );
		newToilets.push( fixtureSecondVertical(TOILET, {x: 0, y: 0 }) );
	}
	
	return newToilets;
}

/*
	Goes around the room and builds all possible fixtures
	increments startingCoordinate
	Currently only implemented for toilets
*/
function buildFixtureAroundRoom(fixtureBuilderFunc) {
	var allPossibleFixtures = [];
	do {
		var fixtures = fixtureBuilderFunc();
		allPossibleFixtures.push( fixtures[0] ); // BUGBUG: May have more possible
		allPossibleFixtures.push( fixtures[1] );
	} while( advanceStartingCoordinate() );
	return allPossibleFixtures;
}

function findPossibleToiletLocations() {
	var allPossibleToiletsArr = buildFixtureAroundRoom ( buildToilet );
	var validToiletArr        = [];
	
	allPossibleToiletsArr.forEach( function(toilet, i) {

		if (!isPointPerimetorInsideRectangle( ROOM.door.pos1, toilet) &&
				!isPointPerimetorInsideRectangle( ROOM.door.pos2, toilet)	) {
			validToiletArr.push(toilet);
		}
	});

	return validToiletArr;
}

function findAcccesible (roomObj) {
	ROOM = roomObj;

	findRoomCorners();
	var usefulToilets = findPossibleToiletLocations();
	console.log(usefulToilets);
}


// var sampleBathRoom = {
// 	x: 8,
// 	y: 5,
	
// 	door: {
// 		pos1: { x: 0, y: 0 },
// 		pos2: { x: 2.75, y: 0 }
// 	}
// };

var sampleBathRoom = {
	x: 8,
	y: 5,
	
	door: {
		pos1: { x: 5.75, y: 5 },
		pos2: { x: 8, y: 5 }
	}
};

findAcccesible(sampleBathRoom);

