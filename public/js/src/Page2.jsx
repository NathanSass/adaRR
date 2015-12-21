(function() {

	var React      = require('react');
	var page       = require('page');

	var Header       = require('./Header.jsx');
	var ContentArea1 = require('./ContentArea1.jsx');
	var ContentArea2 = require('./ContentArea2.jsx');
	var Footer       = require('./Footer.jsx');


	module.exports = React.createClass({
		
		getInitialState: function() {
		    return { data: 'booom', newHttp: this.newHttp };
		},

		handleServerData: function(data) {
			var rooms = JSON.parse(data);
			
			this.setState( {data: rooms } );
		},

		sendDataToServer: function() {
			var Success = false;
			$.ajax({
				// url: 'x=8&y=5&doorpos1=5.75&doorpos1=5&doorpos2=8&doorpos2=5',
				url: 'x=10&y=10&doorpos1=0.5&doorpos1=0&doorpos2=2.25&doorpos2=0',
				crossDomain: true,
				type: 'POST',
				success: function(data) { this.handleServerData(data); }.bind(this),
				error: function(er) {
					console.log('got error');
				}
			});

		},

		newHttp: function(data) {

			if (data.currentPage == 1) { // Currently no support for other room shapes so no point in http call
				page('/configureRoom');
			}
			console.log("PARENT FUNCTION CALLLED ~~~~~~~~~~~ YAY with this data: ", data);
		},
		
		render: function () {
			var data = this.state.data;
			return (
				<div>
					<Header />
					
					<ContentArea1>
						<h1> Widget will go here that does all that dope stuff </h1>
					</ContentArea1>
					
					<ContentArea2 newHttp={this.newHttp} actionableQuestion="Adjust the walls until they match your room.">
					</ContentArea2>
					
					<Footer />
				</div>
			)
		}
	});
}());