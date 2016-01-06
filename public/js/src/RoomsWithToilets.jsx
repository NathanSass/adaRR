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
						return <span key={idx} data={self.drawRoom(validRoom)} />
					})}
				</div>
			)
		}
	});
}());