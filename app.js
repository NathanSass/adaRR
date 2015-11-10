var room;

var startingCoordinate = { x: 0, y: 0 };

var TOILET = {
	w: 5,
	d: 4.5
};



function isPointPerimeterOrInside(pt) {
	return pt.y <= room.y && pt.x <= room.x;
	// pt.y >= bounding.min_y && pt.y <= bounding.max_y && pt.x <= bounding.max_x && pt.x >= bounding.min_x // checks if on perimter
}



function buildToilet() {
	
	var firstPoint = startingCoordinate;
	var secondPoint;

	var newToilet = {
		w1: firstPoint,
	};

	if (startingCoordinate.x < room.x) {  // checks in horizontal orientation
		secondPoint = {
			x: startingCoordinate.x + TOILET.w,
			y: startingCoordinate.y
		};

		newToilet.d1 = {
			x: firstPoint.x,
			y: firstPoint.y + TOILET.d
		};

		newToilet.d2 = {
			x: secondPoint.x,
			y: secondPoint.y + TOILET.d
		};

	} else { // checks for vertical
		
		secondPoint = {
			x: startingCoordinate.x,
			y: startingCoordinate.y + TOILET.w
		};

		newToilet.d1 = {
			x: firstPoint.x + TOILET.d,
			y: firstPoint.y
		};

		newToilet.d2 = {
			x: secondPoint.x + TOILET.d,
			y: secondPoint.y
		};
	
	}

	newToilet.w2 = secondPoint;
	
	if ( isPointPerimeterOrInside(secondPoint) ){
		console.log("Valid bathroom endpoint", secondPoint);
	}

	// Add newToilet to the array of possible bathroom configs

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
}

// pt.y >= bounding.min_y && pt.y <= bounding.max_y && pt.x <= bounding.max_x && pt.x >= bounding.min_x // checks if on perimter
pt.y > bounding.min_y && pt.y < bounding.max_y && pt.x<bounding.max_x && pt.x > bounding.min_x // checks if inside

var pt = {y: 3, x: 2};




var sampleBathRoom = {
	x: 7,
	y: 7,
	
	door: {
		pos1: [1, 0],
		pos2: [4, 0]
	}
};
findAcccesible(sampleBathRoom)

