(function() {
	var React = require('react');
	var drawCanvas = require('./draw/drawAddDoor.jsx');

	module.exports = React.createClass({
		
		componentDidMount: function() {
			
			var params = {
				setData: this.props.setData,
				room: this.props.data,
				id: 'fixtureValidator'
			};


			// drawCanvas.initFixtureValidator(params);

		},

		render: function() {

			return (
				<div id="fixtureValidator" className="fixtureValidator">
					<h1> fixtureValidator </h1>
					<h1> FixtureMenu </h1>
				</div>

			)
		}
	});
}());