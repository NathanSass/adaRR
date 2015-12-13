var React = require('react');

var Draw  = require('./Draw.jsx');

module.exports = React.createClass({
	
	getInitialState: function(){
		var formattedData = this.populateRoomVariable(this.props.data);
		return { data: formattedData };
	},

	componentDidMount: function() {
		this.buildCanvasAndDrawRooms();
	},

	componentWillReceiveProps: function(nextProps) {
		var formattedData = this.populateRoomVariable(nextProps.data);
		
		this.setState({ data: formattedData });

		this.buildCanvasAndDrawRooms();
	},

	buildCanvasAndDrawRooms: function() {
		// var canvas = React.findDOMNode(this);
		var canvas = document.getElementById(this.state.data.id);
		var ctx    = canvas.getContext("2d");
		
		this.state.data.ctx = ctx;
		this.setState({data: this.state.data}); //BUGBUG: Not best Practice
		
		var roomAndCanvasData = this.state.data;
		
		////////////////////////////
		//// ENTRY POINT FOR DRAWING
		Draw.draw(roomAndCanvasData);
		/////////////////////////////
	},

	populateRoomVariable: function (data) {
		var ftToCm       = this.ftToCm;
		var canvasOffset = this.canvasOffset();
		var canvasSize   = this.getCanvasSize(data);
		
		return {
			changeMe	 : data.changeMe,
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
	    	<div>
	    		<h1> This should change {data.changeMe}</h1>
			    <canvas id={data.id} width={data.canvasSize} height={data.canvasSize} style={canvasStyle} />
	    	</div>
	    )    
	}

});