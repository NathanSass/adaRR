import { Fixture } from "./Fixture.jsx";
"use strict";

class Toilet extends Fixture {
	constructor(params) {
		var superParams = params;
		superParams.name = 'toilet';
		super(superParams);
	}
}

export { Toilet };