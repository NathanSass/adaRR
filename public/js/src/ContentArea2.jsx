(function() {
	var React = require('react');

	module.exports = React.createClass({
		getInitialState: function() {
		    return { selected: '' };
		},

		handleCardClicked: function(event) {
			var selectedRoomShape = event.currentTarget.getAttribute('data');
			this.setState({ 'selected': selectedRoomShape });
		},
		
		handleNextButton: function(event) {
			var selectedRoom = this.state.selected;
			this.props.newHttp(selectedRoom);
		},

		render: function() {

			return (
				<section className="contentArea2">
					<div className="contentArea">
						<div className="actionableQuestion">
							What is the shape of your room?
						</div>
						<div className="roomCardContainer">
							<a href="javascript:void(0);" className={this.state.selected === 'rectangular' ? 'active roomCard' : 'roomCard'} onClick={this.handleCardClicked} data="rectangular">
								<div className="roomShapeContainer">
									<img src="/public/img/rectangular.svg" alt="logo"/>
									<div>Rectangular</div>
								</div>
							</a>
							<a href="javascript:void(0);" className={this.state.selected === 'indentTopRight' ? 'active roomCard' : 'roomCard'} onClick={this.handleCardClicked} data="indentTopRight">
								<div className="roomShapeContainer">
									<img src="/public/img/rectangular.svg" alt="logo"/>
									<div>Indent top right</div>
								</div>
							</a>
							<a href="javascript:void(0);" className={this.state.selected === 'indentTopLeft' ? 'active roomCard' : 'roomCard'} onClick={this.handleCardClicked} data="indentTopLeft">
								<div className="roomShapeContainer">
									<img src="/public/img/rectangular.svg" alt="logo"/>
									<div>Indent top left</div>
								</div>
							</a>
							<a href="javascript:void(0);" className={this.state.selected === 'indentBottomRight' ? 'active roomCard' : 'roomCard'} onClick={this.handleCardClicked} data="indentBottomRight">
								<div className="roomShapeContainer">
									<img src="/public/img/rectangular.svg" alt="logo"/>
									<div>Indent bottom right</div>
								</div>
							</a>
						</div>
						<button className="nextButton" type="button" onClick={this.handleNextButton}>Next</button>
					</div>
				</section>
			)
		}
	});
}());