(function() {

	var React      = require('react');
	var ReactDOM   = require('react-dom');
	var page       = require('page');

	var Page1 = require('./Page1.jsx');
	var Page2 = require('./Page2.jsx');


	var Router = React.createClass({
		
		getInitialState: function () {
			return { component: <div />};
		},
		
		componentDidMount: function () {

			var self = this;

			page('/', function (ctx) {
				
				self.setState({ component: <Page1 /> });
			
			});

			page('/configureRoom', function (ctx) {
				
				self.setState({ component: <Page2 /> });
			
			});

			page('*', function (ctx) {
				// console.log("React Router: visited random");
			});

			page.start();

		},

		render: function () {
			return this.state.component;
		};
	});

	ReactDOM.render(<Router />, document.getElementById('app'));
}());