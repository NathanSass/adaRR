var React      = require('react');
var ReactDOM   = require('react-dom');

var Room = require('./Room.jsx');



var rooms  = [ // TODO: initialize with an empty array
	{
		"id":"canvas1",
		"maxX":243.84,
		"maxY":152.4,
		"canvasOffset":60.96,
		"door":
			{
				"pos1":{"x":236.22,"y":213.36},
				"pos2":{"x":304.8,"y":213.36}
			},
		"note":"firstHorz, 1st",
		"canvasSize":365.76
	},{"id":"canvas2","maxX":243.84,"maxY":152.4,"canvasOffset":60.96,"door":{"pos1":{"x":236.22,"y":213.36},"pos2":{"x":304.8,"y":213.36}},"note":"secondHorz, 2nd","canvasSize":365.76},{"id":"canvas3","maxX":243.84,"maxY":152.4,"canvasOffset":60.96,"door":{"pos1":{"x":236.22,"y":213.36},"pos2":{"x":304.8,"y":213.36}},"note":"secondVert, 1st","canvasSize":365.76},{"id":"canvas4","maxX":243.84,"maxY":152.4,"canvasOffset":60.96,"door":{"pos1":{"x":236.22,"y":213.36},"pos2":{"x":304.8,"y":213.36}},"note":"secondVert, 2nd","canvasSize":365.76}]

var FormAndCanvas = React.createClass({
	
	getInitialState: function() {
	    return { data: rooms };
	},

	handleServerData: function(data) {
		var rooms = JSON.parse(data);
		
		this.setState( {data: rooms } );
	},

	sendDataToServer: function() {
		var Success = false;
		$.ajax({
			url: '/x=8&y=5&doorpos1=5.75&doorpos1=5&doorpos2=8&doorpos2=5',
			crossDomain: true,
			type: 'POST',
			success: function(data) { this.handleServerData(data) }.bind(this),
			error: function(er) {
				console.log('got error')
			}
		})

	},
	render: function () {
		var data = this.state.data;
		return (
			<div>
				<h2> App.jsx {this.state.data.changeMe}</h2>
				{this.state.data.map(function(validRoom, idx){
					return <Room key={idx} data={validRoom} />
				})}
				<button type="button" onClick={this.sendDataToServer}>NEW BUTTON</button>
			</div>
		)
	}
})



ReactDOM.render(
    <FormAndCanvas/>,
    document.getElementById('canvasContainer')
);