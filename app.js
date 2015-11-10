console.log("hi");

var ITEMS = {
	toilet: { w: 2},
	person: { l: 5, w: 5 }
};

var rrW,
	rrH;

var door;

var currentLocation = { w: 0, h: 0 };
var checkableCoords;


function checkHorizontalWallForToiletSpace() {
	while (currentLocation.w <= rrW) {
		checkableCoords = { surface: 'w', coordLinked: [currentLocation.w - ITEMS.toilet.w/2, currentLocation.w + ITEMS.toilet.w/2] };

		if ( (currentLocation.w - ITEMS.toilet.w/2 > 0) && // Do this to check first horizontal surface
					(currentLocation.w + ITEMS.toilet.w/2 <= rrW) &&
					notDoor() ) {
			
			console.log("Workable horizontal wall: ", currentLocation);
			// execute code here that would now do other sets of checks on these
		}

		currentLocation.w += 1;
	}

	return; //list of workable places for next set of tests;
}

function notDoor() {
	if ( checkableCoords.surface === 'w' ){
		
		for (var i = 0; i ++ ; i <= checkableCoords.coordLinked.length) {
			// Item is before the door
			(coordLinked[0] <= door.x[0]) && (coordLinked[1] <= door.x[0])

			// Item is after door
			((coordLinked[1] >= door.x[1]) && (coordLinked[1] >= door.x[1])
			
		}
	}
}


function checkVerticalWallForToiletSpace() {
	while (currentLocation.h <= rrH) {
		if ( (currentLocation.h - ITEMS.toilet.w/2 >= 0) &&
				 (currentLocation.h + ITEMS.toilet.w/2 <= rrH) ) {
			
			console.log("Workable verticle wall: ", currentLocation);
			// execute code here that would now do other sets of checks on these
		}

		currentLocation.h += 1;
	}

	return; //list of workable places for next set of tests;
}

function findAccessible(roomObj){
	rrW = roomObj.w;
	rrH = roomObj.h;
	roomObj.doorX && door.x = roomObj.doorX;

	checkHorizontalWallForToiletSpace();
	checkVerticalWallForToiletSpace();
		
}


var restRoom1 = {h: 7, w: 7, doorX: [0, 3]};
findAccessible(restRoom1);