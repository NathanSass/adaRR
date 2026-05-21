(function() {
	var React = require('react');
	var drawAddDoor = require('./draw/drawAddThings.jsx');

	module.exports = React.createClass({
		
		componentDidMount: function() {
			var room;
			this.props.room ? room = this.props.room : room = { h: 158, w: 235 }; //BUGBUG for development purposes
			
			var params = {
				containerId: 'addDoorContainer',
				canvasId: 'addDoorCanvas',
				setData: this.props.setData,
				mode: 'locateDoor',
				room: room
			};

			drawAddDoor.init( params );

		},

		render: function() {

			return (
				<div id="addDoorContainer" className="addDoorContainer" />
			)
		}
	});
}());