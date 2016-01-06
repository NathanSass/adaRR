(function() {
	var React = require('react');
	var DrawResizeableRoom = require('./draw/drawResizeableRoom.js');

	module.exports = React.createClass({
		
		componentDidMount: function() {
			var params = {
				setData: this.props.setData
			};

			DrawResizeableRoom.init(params);

		},

		render: function() {

			return (
				<div id="resizeableRoomContainer" className="resizeableRoom" />
			)
		}
	});
}());