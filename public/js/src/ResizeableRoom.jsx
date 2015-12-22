(function() {
	var React = require('react');
	var DrawResizeableRoom = require('./DrawResizeableRoom.jsx');

	module.exports = React.createClass({
		getInitialState: function(){
			return { 
				ctx: '' 
			};
		},
		
		componentDidMount: function() {

			DrawResizeableRoom.init('resizeableRoom');

		},

		render: function() {
			var canvasStyle = {
				background: '#FDFDFD'
			};

			return (
				<div className="resizeableRoom">
					<canvas id="resizeableRoom" width="300" height="400" style={canvasStyle} />
				</div>
			)
		}
	});
}());