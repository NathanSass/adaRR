var React  = require('react');

var Canvas = require('./Canvas.jsx');


module.exports = React.createClass({
	
	getInitialState: function(){
		var formattedData = this.populateRoomVariable(this.props.data);
		return { data: formattedData };
	},
	
	populateRoomVariable: function (data) {
		var ftToCm = this.ftToCm;
		var canvasOffset = this.canvasOffset();
		return {
			id           : data.id + 'XXXX',
			width        : ftToCm(data.maxX),
			height       : ftToCm(data.maxY),
			canvasOffset : canvasOffset,
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

	render: function() {
	    return (
		    <Canvas data={this.state.data} />
	    )    
	}

});