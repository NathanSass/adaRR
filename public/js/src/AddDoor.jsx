(function() {
	var React = require('react');
	var DrawAddDoor = require('./draw/drawAddDoor.jsx');

	module.exports = React.createClass({
		
		componentDidMount: function() {
			var rect;
			this.props.rect ? rect = this.props.rect : rect = { h: 158, w: 235 }; //BUGBUG for development purposes
			
			var params = {
				containerId: 'addDoorContainer',
				canvasId: 'addDoorCanvas',
				setData: this.props.setData,
				mode: 'locateDoor_',
				room: rect
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