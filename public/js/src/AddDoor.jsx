(function() {
	var React = require('react');
	var DrawAddDoor = require('./draw/drawAddDoor.js');

	module.exports = React.createClass({
		
		componentDidMount: function() {
			var rect;
			this.props.rect ? rect = this.props.rect : rect = { h: 158, w: 235 }; //BUGBUG for development purposes
			
			var params = {
				setData: this.props.setData,
				rect: rect
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