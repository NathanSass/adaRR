(function() {
	var React = require('react');
	var Draw  = require('./Draw.jsx');

	module.exports = React.createClass({
		
		drawRoom: function(validRoom) {

			var params = {
				setData: this.props.setData,
				room: validRoom
			};

			Draw.draw(params);
		},

		render: function() {
			var self = this;
			return (
				<div id="roomsWithToilets" className="roomsWithToilet">
					{this.props.data.map(function(validRoom, idx){
						
						return (
							<a
								key       = {idx}
								href      = "javascript:void(0);"
								className = "roomWithToilet-link" >
								
								<canvas
									id     = {validRoom.id}
									key    = {idx}
									width  = {validRoom.canvasSize}
									height = {validRoom.canvasSize}
									data   = {self.drawRoom(validRoom)}
								/>
							
							</a>
						)
					
					})}
				</div>
			)
		}
	});
}());