(function() {
	var React = require('react');
	var Draw  = require('./draw/drawRoomsWithToilets.jsx');

	module.exports = React.createClass({

		getInitialState: function() {
			return { selectedIdx: '' };
		},
		
		drawRoom: function(validRoom) {

			var params = {
				setData: this.props.setData,
				room: validRoom
			};

			Draw.draw(params);
		},

		handleRoomClicked: function(e) {
			var selectedIdx = parseInt( e.currentTarget.getAttribute('data-idx') );
			this.replaceState({ selectedIdx: selectedIdx });
			
			var selectedRoom = this.props.data[selectedIdx];
			this.props.setData({ data: selectedRoom });
		},

		render: function() {
			var self = this;
			return (
				<div id="roomsWithToilets" className="roomsWithToilet">
					{this.props.data.map(function(validRoom, idx){
						
						var anchorClass = 'roomWithToilet-link ';
						if ( idx === parseInt( self.state.selectedIdx )) {
							anchorClass += 'active ';
						}
						
						return (
							<a
								key       = {idx}
								href      = "javascript:void(0);"
								data-idx  = {idx}
								onClick   = {self.handleRoomClicked}
								className = {anchorClass} >
								
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