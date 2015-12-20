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
					<a href="javascript:void(0);" className={this.props.selected === 'indentTopRight' ? 'active roomCard' : 'roomCard'} onClick={this.handleCardClicked} data="indentTopRight">
						<div className="roomShapeContainer">
							<img src="/public/img/rectangular.svg" alt="logo"/>
							<div>Indent top right</div>
						</div>
					</a>
					<a href="javascript:void(0);" className={this.props.selected === 'indentTopLeft' ? 'active roomCard' : 'roomCard'} onClick={this.handleCardClicked} data="indentTopLeft">
						<div className="roomShapeContainer">
							<img src="/public/img/rectangular.svg" alt="logo"/>
							<div>Indent top left</div>
						</div>
					</a>
					<a href="javascript:void(0);" className={this.props.selected === 'indentBottomRight' ? 'active roomCard' : 'roomCard'} onClick={this.handleCardClicked} data="indentBottomRight">
						<div className="roomShapeContainer">
							<img src="/public/img/rectangular.svg" alt="logo"/>
							<div>Indent bottom right</div>
						</div>
					</a>
				</div>
			)
		}
	});
}());