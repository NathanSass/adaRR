(function() {

	var React      = require('react');
	var ReactDOM   = require('react-dom');
	var page       = require('page');


	var Header         = require('./Header.jsx');
	var ContentArea1   = require('./ContentArea1.jsx');
	var ContentArea2   = require('./ContentArea2.jsx');
	var Footer         = require('./Footer.jsx');
	
	var RoomCards        = require('./RoomCards.jsx');
	var ResizeableRoom   = require('./ResizeableRoom.jsx');
	var AddDoor          = require('./AddDoor.jsx');
	var RoomsWithToilets = require('./RoomsWithToilets.jsx');


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
		
		handleServerData: function(data) { // CURRENTLY NOT USED, but will be needed again :P
			console.log("data ", data);
			if ( this.state.hasOwnProperty('nextUrl') ) {
				data = JSON.parse(data);
				this.setData(data);
				page("/" + this.state.nextUrl);
			}
			// this.setState( {data: rooms } );
		},

		postRoute: function(url) {

			var url  = this.state.nextUrl + '/' + JSON.stringify(this.getData().data);
			
			$.ajax({
				url: url,
				crossDomain: true,
				type: 'POST',
				success: this.handleServerData,
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
				this.postRoute();
			}
			
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
								actionableQuestion: "Adjust the walls until they match your room.",
								nextUrl: "finddoor"
								});
		
			});

			page('/finddoor', function (ctx) {
				
				self.setState({ contentArea1: 
									<AddDoor setData={self.state.setData} rect={self.getData().rect}/>,
								contentArea2: <div />,
								actionableQuestion: "Click on the walls to add your door, then adjust until correct.",
								nextUrl: "chooseToiletLocation",
								data: self.getData()
								});
		
			});

			page('/chooseToiletLocation', function (ctx) {
				
				self.setState({ contentArea1: 
								<div id="roomsWithToilets" className="roomsWithToilet">
									{self.getData().map(function(validRoom, idx){
										return <RoomsWithToilets key={idx} data={validRoom} />
									})}
								</div>,
								contentArea2: <h1>All toilet configurations will go here for selection</h1>,
								actionableQuestion: "Choose a toilet location that most matches your room",
								nextUrl: "placeOtherFixtures",
								data: self.getData()
								});
		
			});

			page('*', function (ctx) {
				
				self.setState({ contentArea1: 
									<h1> This page doesn't exist yet </h1>,
								contentArea2: <div />,
								actionableQuestion: ""
								});
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