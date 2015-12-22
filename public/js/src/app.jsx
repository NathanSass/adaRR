(function() {

	var React      = require('react');
	var ReactDOM   = require('react-dom');
	var page       = require('page');


	var Header       = require('./Header.jsx');
	var ContentArea1 = require('./ContentArea1.jsx');
	var ContentArea2 = require('./ContentArea2.jsx');
	var Footer       = require('./Footer.jsx');
	
	var RoomCards      = require('./RoomCards.jsx');
	var ResizeableRoom = require('./ResizeableRoom.jsx');


	var Router = React.createClass({
		dataModel: '',
		
		getInitialState: function () {
			return { contentArea1: <div />,
					 contentArea2: <div />,
					 newHttp: this.newHttp,
					 actionableQuestion: '',
					 setData: this.setData
					};
		},
		///////////////////
		
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
			console.log("newHttp called with this data: ", data);
		},

		//////////////////////
		
		componentDidMount: function () {

			var self = this;

			page('/', function (ctx) {
				
				self.setState({ contentArea1: 
									<span>
										<div className="miniHeading">
											What is an accessible bathroom? <br/>
											Click <a href="http://www.bobrick.com/documents/planningguide.pdf">here</a> to find out and see the full guidelines.
										</div>
										<div className="greeter">Welcome! Today we are going to design an accessible bathroom</div>
									</span>,
								contentArea2:
									<RoomCards />,
								actionableQuestion: "What is the shape of your room?"
								});
			
			});

			page('/configureRoom', function (ctx) {

				self.setState({ contentArea1: 
								<ResizeableRoom setData={self.state.setData} />,
								contentArea2: <div />,
								actionableQuestion: "Adjust the walls until they match your room."
							});
		
			});

			page('*', function (ctx) {
				// console.log("React Router: visited random");
			});

			page.start();

		},

		render: function () {

			return (
				<div>
					<Header />
					
					<ContentArea1 setData={this.state.setData}>
						{this.state.contentArea1}
					</ContentArea1>
					
					<ContentArea2  setData={this.state.setData} newHttp={this.state.newHttp} actionableQuestion={this.state.actionableQuestion}>
						{this.state.contentArea2}
					</ContentArea2>
					
					<Footer />
				</div>
			)
		}
	});

	ReactDOM.render(<Router />, document.getElementById('app'));
}());