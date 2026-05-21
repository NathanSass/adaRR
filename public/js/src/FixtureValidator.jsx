(function() {
	var React = require('react');
	var drawFixtures = require('./draw/drawAddThings.jsx');

	module.exports = React.createClass({
		
		componentDidMount: function() {
			
			var params = {
				containerId: 'fixtureValidator',
				canvasId: 'addFixtureCanvas',
				setData: this.props.setData,
				mode: 'locateFixtures',
				room: this.props.data.data
			};

			drawFixtures.init( params );

		},

		render: function() {

			return (
				<div>
					<div id="fixtureValidator" className="fixtureValidator" />
					<h1> FixtureMenu </h1>
				</div>

			)
		}
	});
}());