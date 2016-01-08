(function() {

	var ReactDOM   = require('react-dom');
	var React      = require('react');
	var page       = require('page');

	var Header         = require('./Header.jsx');
	var ContentArea1   = require('./ContentArea1.jsx');
	var ContentArea2   = require('./ContentArea2.jsx');
	var Footer         = require('./Footer.jsx');
	
	var AddDoor           = require('./AddDoor.jsx');
	var RoomCards         = require('./RoomCards.jsx');
	var ResizeableRoom    = require('./ResizeableRoom.jsx');
	var RoomsWithToilets  = require('./RoomsWithToilets.jsx');
	var FixtureValidator  = require('./FixtureValidator.jsx');


	var Router = React.createClass({
		
		dataModel: '',
		
		getInitialState: function () {
			return { contentArea1: <div />,
					 contentArea2: <div />,
					};
		},
		
		///////////////////
		
		handleServerData: function(data) {
			console.log("data ", data);
			if ( this.state.hasOwnProperty('nextUrl') ) {
				data = JSON.parse(data);
				this.setData(data);
				page("/" + this.state.nextUrl);
			}
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
			
			if (this.state.hasOwnProperty('directRoute')) { // Currently no support for other room shapes so no point in http call
				page(this.state.directRoute);
			} else {
				this.postRoute();
			}
			
		},

		//////////////////////
		
		componentDidMount: function () {

			var self = this;

			page('/', function (ctx) {
				
				self.replaceState({ contentArea1: 
										<div className="greeter">Welcome! Today we are going to design an accessible bathroom</div>,
									contentArea2:
										<RoomCards />,
									ca1Classes: 'flexwrapper ',
									headerGreet: 'You are going to design the greatest bathroom',
									actionableQuestion: "What is the shape of your room?",
									directRoute: '/configureRoom'
									});
			
			});

			page('/configureRoom', function (ctx) {

				self.replaceState({ contentArea1: 
										<ResizeableRoom setData={self.setData} />,
									contentArea2: <div />,
									actionableQuestion: "Grab the room corners and drag them until they match your room.",
									nextUrl: "finddoor",
									data: {}
									});
		
			});

			page('/finddoor', function (ctx) {
				
				self.replaceState({ contentArea1: 
										<AddDoor setData={self.setData} rect={self.getData().rect}/>,
									contentArea2: <div />,
									actionableQuestion: "Adjust the door until it is in the correct location.",
									nextUrl: "chooseToiletLocation",
									data: self.getData()
									});
			
			});

			page('/chooseToiletLocation', function (ctx) {
				var roomsData;
				
				if ( self.getData().length === 0) {
					roomsData = [{"id":"canvas1","maxX":252,"maxY":196,"canvasOffset":60.96,"door":{"pos1":{"x":112.96000000000001,"y":60.96},"pos2":{"x":182.96,"y":60.96}},"rotation":90,"toilet":{"depth":71.12,"width":58.42,"loc":{"x":252,"y":150.28}},"note":"firstVert, 2nd","canvasSize":373.92},{"id":"canvas2","maxX":252,"maxY":196,"canvasOffset":60.96,"door":{"pos1":{"x":112.96000000000001,"y":60.96},"pos2":{"x":182.96,"y":60.96}},"rotation":180,"toilet":{"depth":71.12,"width":58.42,"loc":{"x":206.28,"y":196}},"note":"secondHorz, 1st","canvasSize":373.92},{"id":"canvas3","maxX":252,"maxY":196,"canvasOffset":60.96,"door":{"pos1":{"x":112.96000000000001,"y":60.96},"pos2":{"x":182.96,"y":60.96}},"rotation":180,"toilet":{"depth":71.12,"width":58.42,"loc":{"x":45.72,"y":196}},"note":"secondHorz, 2nd","canvasSize":373.92},{"id":"canvas4","maxX":252,"maxY":196,"canvasOffset":60.96,"door":{"pos1":{"x":112.96000000000001,"y":60.96},"pos2":{"x":182.96,"y":60.96}},"rotation":270,"toilet":{"depth":71.12,"width":58.42,"loc":{"x":0,"y":150.28}},"note":"secondVert, 1st","canvasSize":373.92}]
					console.log("chooseToiletLocation: Mock Data used.");
				} else {
					roomsData = self.getData();
				}
				
				self.replaceState({ contentArea1: 
										<RoomsWithToilets setData={self.setData} data={roomsData} />,
									contentArea2: <span></span>,
									actionableQuestion: "Choose the toilet configuration that you want.",
									directRoute: "/addValidFixtures"
									});
		
			});

			page('/addValidFixtures', function (ctx) {

				var roomData;
				if (self.getData().length === 0) {
					roomData = JSON.parse('{"data":{"id":"canvas1","maxX":252,"maxY":196,"canvasOffset":60.96,"door":{"pos1":{"x":112.96000000000001,"y":60.96},"pos2":{"x":182.96,"y":60.96}},"rotation":90,"toilet":{"depth":71.12,"width":58.42,"loc":{"x":252,"y":150.28}},"note":"firstVert, 2nd","canvasSize":373.92}}' );
					console.log("addValidFixtures: Mock Data used.");
				} else {
					roomData = self.getData();
				}

				
				self.replaceState({ contentArea1: 
										<FixtureValidator setData={self.setData} data={roomData}/>,
									contentArea2: <span></span>,
									actionableQuestion: "Add the fixtures you want for your bathroom and drag them into place."
									});
		
			});

			page('*', function (ctx) {
				
				self.replaceState({ contentArea1: 
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
					<Header headerGreet={this.state.headerGreet} />
					
					<ContentArea1 classesToPass={this.state.ca1Classes}>
						{this.state.contentArea1}
					</ContentArea1>
					
					<ContentArea2  setData={this.setData} newHttp={this.newHttp} actionableQuestion={this.state.actionableQuestion}>
						{this.state.contentArea2}
					</ContentArea2>
					
					<Footer />
				</div>
			)
		}
	});

	ReactDOM.render(<Router />, document.getElementById('app'));
}());