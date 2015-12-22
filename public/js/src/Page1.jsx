(function() {

	var React      = require('react');
	var page       = require('page');

	var Header       = require('./Header.jsx');
	var ContentArea1 = require('./ContentArea1.jsx');
	var ContentArea2 = require('./ContentArea2.jsx');
	var Footer       = require('./Footer.jsx');
	var RoomCards = require('./RoomCards.jsx');


	module.exports = React.createClass({
		dataModel: '',
		
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

		setData: function(data) {
			this.dataModel = data;
			return this.dataModel;
		},

		getData: function() {
			return this.dataModel;
		},

		newHttp: function() {
			var data = this.getData();
			
			if (data.hasOwnProperty('directRoute')) { // Currently no support for other room shapes so no point in http call
				page(data.directRoute);
			} else {
				var url = "finddoor/" + JSON.stringify(data);
			}
			console.log("Page2 PARENT FUNCTION CALLLED ~~~~~~~~~~~ YAY with this data: ", data);
		},
		
		render: function () {
			var data = this.state.data;
			return (
				<div>
					<Header />
					
					<ContentArea1>
						<div className="miniHeading">
							What is an accessible bathroom? <br/>
							Click <a href="http://www.bobrick.com/documents/planningguide.pdf">here</a> to find out and see the full guidelines.
						</div>
						<div className="greeter">Welcome! Today we are going to design an accessible bathroom</div>
					</ContentArea1>
					
					<ContentArea2  setData={this.setData} newHttp={this.newHttp} actionableQuestion="What is the shape of your room?">
						<RoomCards />
					</ContentArea2>
					
					<Footer />
				</div>
			)
		}
	});
}());