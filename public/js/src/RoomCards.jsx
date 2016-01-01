(function() {
	var React = require('react');

	module.exports = React.createClass({

		handleCardClicked: function(event) {
			var selectedRoomShape = event.currentTarget.getAttribute('data');
			
			var data = {
				selected: selectedRoomShape
			};
			this.props.updateModelFromChildComponent(data);
		},

		render: function() {

			return (
				<div className="roomCardContainer">
					<a href="javascript:void(0);" className={this.props.selected === 'rectangular' ? 'active roomCard' : 'roomCard'} onClick={this.handleCardClicked} data="rectangular">
						<div className="roomShapeContainer">
							<img src="/public/img/rectangular.svg" alt="logo"/>
							<div>Rectangular</div>
						</div>
					</a>
					<a href="javascript:void(0);" className={this.props.selected === 'custom' ? 'active roomCard' : 'roomCard'} onClick={this.handleCardClicked} data="custom">
						<div className="roomShapeContainer">
							<img src="/public/img/custom.svg" alt="logo"/>
							<div>Custom</div>
						</div>
					</a>
				</div>
			)
		}
	});
}());