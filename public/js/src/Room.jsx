var React = require('react');

var Draw  = require('./Draw.jsx');

module.exports = React.createClass({
	
	getInitialState: function(){
		return { data: this.props.data };
	},

	componentDidMount: function() {
		this.buildCanvasAndDrawRooms();
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({ data: this.props.data });

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

	render: function() {
	    var data = this.props.data;
		var canvasStyle = {
			background: '#FDFDFD'
		};
	    
	    return (
	    	<div>
	    		<h1> Canvas {data.id}</h1>
			    <canvas id={data.id} width={data.canvasSize} height={data.canvasSize} style={canvasStyle} />
	    	</div>
	    )    
	}

});