var React = require('react');

module.exports = React.createClass({

	getInitialState: function() {
		var canvasSize = this.getCanvasSize(this.props.data);
		console.log('CS ', canvasSize)
		return { data: { canvasSize: canvasSize, id: this.props.data.id } };
	},

	getCanvasSize: function(roomData) {
		var canvasSize;
		roomData.height >= roomData.width ? canvasSize = roomData.height : canvasSize = roomData.width; // Ensures the canvas is square and large enough
		canvasSize  += roomData.canvasOffset * 2;
		console.log('canvasSize', canvasSize)
		return canvasSize;

	},

	render: function() {
		var data = this.state.data;
		var canvasStyle = {
			background: '#FDFDFD'
		};
	    return (
		    <canvas id={data.id} width={data.canvasSize} height={data.canvasSize} style={canvasStyle}/>
	    )    
	}
});