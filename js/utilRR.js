(function() {
	
	var exports     = module.exports;
	
	exports.inchToCm = function(inches) {
		return inches * 2.54;
	};

	exports.cmToFt = function(cm) {
		return cm / 30.48;
	};

	exports.ftToCm = function(foot) {
		return foot * 30.48;
	};

	exports.ftToCmAndRound = function(ft) {
		var cm = this.ftToCm(ft);
		return Math.round(cm * 100) / 100;
	};

}());