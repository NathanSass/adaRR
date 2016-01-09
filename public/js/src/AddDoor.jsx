(function() {
	var React = require('react');
	var DrawAddDoor = require('./draw/drawAddDoor.jsx');

	module.exports = React.createClass({
		
		componentDidMount: function() {
			var room;
			this.props.room ? room = this.props.room : room = { h: 158, w: 235 }; //BUGBUG for development purposes
			
			var params = {
				containerId: 'addDoorContainer',
				canvasId: 'addDoorCanvas',
				setData: this.props.setData,
				mode: 'locateDoor_',
				room: room
			};


			DrawAddDoor.init(params);

		},

		render: function() {

			return (
				<div id="addDoorContainer" className="addDoorContainer" />
			)
		}
	});
}());