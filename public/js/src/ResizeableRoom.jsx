(function() {
	var React = require('react');
	var DrawResizeableRoom = require('./DrawResizeableRoom.jsx');

	module.exports = React.createClass({
		
		componentDidMount: function() {

			DrawResizeableRoom.init();

		},

		render: function() {

			return (
				<div id="resizeableRoomContainer" className="resizeableRoom" />
			)
		}
	});
}());