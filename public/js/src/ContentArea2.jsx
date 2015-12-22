(function() {
	var React = require('react');

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
			var key   = Object.keys(data)[0]; //BUGBUG will only work with one value
			var value = data[key];
			obj[key]  = value;
			
			obj['directRoute'] = '/configureRoom'; //Temporary until other room shapes get added
			
			this.props.setData(obj); // For network call
			this.setState(obj);
		},
		
		handleNextButton: function(event) {
			var selectedRoom = this.state.selected;
			
			// Function call that sends an http request, the data should already be there
			this.props.newHttp();
		},
		/*
			This takes the elements that will be yielded and adds the necessary properties to them.
			Add the props here that will be needed by child components
		*/
		renderChildren: function() {
			return React.Children.map(this.props.children, function (child) {
				return React.cloneElement(child, {
					updateModelFromChildComponent: this.updateModelFromChildComponent,
					selected: this.state.selected
				});
			}.bind(this));
		},

		render: function() {

			return (
				<section className="contentArea2">
					<div className="contentArea">
						<div className="actionableQuestion">
							{this.props.actionableQuestion}
						</div>
						{this.renderChildren()}
						<button className="nextButton" type="button" onClick={this.handleNextButton}>Next</button>
					</div>
				</section>
			)
		}
	});
}());