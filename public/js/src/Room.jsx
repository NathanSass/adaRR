var React  = require('react');

module.exports = React.createClass({
	
	getInitialState: function(){
		var formattedData = this.populateRoomVariable(this.props.data);
		return { data: formattedData };
	},
	
	populateRoomVariable: function (data) {
		var ftToCm       = this.ftToCm;
		var canvasOffset = this.canvasOffset();
		var canvasSize   = this.getCanvasSize(data);
		
		return {
			id           : data.id + 'XXXX',
			width        : ftToCm(data.maxX),
			height       : ftToCm(data.maxY),
			canvasOffset : canvasOffset,
			canvasSize   : canvasSize,
			door         : {
				pos1: { x: ftToCm(data.door.pos1.x) + canvasOffset, y: ftToCm(data.door.pos1.y) + canvasOffset },
				pos2: { x: ftToCm(data.door.pos2.x) + canvasOffset, y: ftToCm(data.door.pos2.y) + canvasOffset }
			}
		};
	},
	
	
	ftToCm: function(foot) {
		return foot * 30.48;
	},
	
	canvasOffset: function() {
		return this.ftToCm(2);
	},

	getCanvasSize: function(roomData) {
		var canvasSize;
		var canvasOffset = this.canvasOffset();
		var height       = this.ftToCm(roomData.maxY);
		var width        = this.ftToCm(roomData.maxX);
		
		height >= width ? canvasSize = height : canvasSize = width; // Ensures the canvas is square and large enough
		canvasSize  += canvasOffset * 2;
		return canvasSize;
	},

	render: function() {
	    var data = this.state.data;
		var canvasStyle = {
			background: '#FDFDFD'
		};
	    return (
		    <canvas id={data.id} width={data.canvasSize} height={data.canvasSize} style={canvasStyle} />
	    )    
	}

});