var React      = require('react');
var ReactDOM   = require('react-dom');

var Room = require('./Room.jsx');


var room = {
				id: 'firstCanvas',
				changeMe: 'oneHundo',
				maxX: 10,
				maxY: 10,
				door: {
					pos1: { x: 0.4, y: 0 },
					pos2: { x: 3.1, y: 0 }
				}
			};

var room2 = {
			id: 'firstCanvas',
			changeMe: 'twoHundo',
			maxX: 10,
			maxY: 10,
			door: {
				pos1: { x: 0.4, y: 0 },
				pos2: { x: 3.1, y: 0 }
			}
};
var FormAndCanvas = React.createClass({
	
	getInitialState: function() {
	    return { data: room };
	},

	handleServerData: function(data) {
		var rooms = JSON.parse(data);
		console.log('FormAndCanvas', data);
		///
		this.setState( {data: room2} );
		// this.forceUpdate();
	},

	sendDataToServer: function() {
		console.log("SEND DATA TO SERVER FROM FormAndCanvas");
		var Success = false;
		$.ajax({
			url: '/x=8&y=5&doorpos1=5.75&doorpos1=5&doorpos2=8&doorpos2=5',
			crossDomain: true,
			type: 'POST',
			success: function(data) {this.handleServerData(data)}.bind(this),
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
				<button type="button" onClick={this.sendDataToServer}>NEW BUTTON</button>
				<Room data={this.state.data}/>
			</div>
		)
	}
})

ReactDOM.render(
    <FormAndCanvas/>,
    document.getElementById('canvasContainer')
);