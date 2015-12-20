(function() {
	var React = require('react');
	var RoomCards = require('./RoomCards.jsx');

	module.exports = React.createClass({
		/*
			Add all possible values here for what will be passed to child component
		*/
		getInitialState: function() {
		    return { selected: '' };
		},
		/*
			Child component upates the model which will be sent when next button is clicked
		*/
		updateModelFromChildComponent: function(data) {
			var obj   = {};
			var key   = Object.keys(data)[0] //BUGBUG will only work with one value
			var value = data[key];
			obj[key]  = value;
			
			this.setState(obj);
		},
		
		handleNextButton: function(event) {
			var selectedRoom = this.state.selected;
			
			var data = {
				currentPage: 1,
				selectedRoom: selectedRoom
			};
			
			// Function call that sends an http request
			this.props.newHttp(data);
		},

		render: function() {

			return (
				<section className="contentArea2">
					<div className="contentArea">
						<div className="actionableQuestion">
							What is the shape of your room?
						</div>
						<RoomCards updateModelFromChildComponent={this.updateModelFromChildComponent} selected={this.state.selected} />
						<button className="nextButton" type="button" onClick={this.handleNextButton}>Next</button>
					</div>
				</section>
			)
		}
	});
}());