(function() {
	var React = require('react');
	var drawFixtures = require('./draw/drawAddThings.jsx');

	module.exports = React.createClass({

		canvasState: null,
		
		componentDidMount: function() {
			
			var params = {
				containerId: 'fixtureValidator',
				canvasId: 'addFixtureCanvas',
				setData: this.props.setData,
				mode: 'locateFixtures',
				room: this.props.data.data
			};

			this.canvasState = drawFixtures.init( params );

		},

		addSink: function() {
			drawFixtures.addSink(this.canvasState);
		},

		render: function() {

			return (
				<div>
					<div id="fixtureValidator" className="fixtureValidator" />
					<div className="fixtureMenuContainer"> 
						<h1> FixtureMenu </h1>
						<button type="button" onClick={this.addSink}> Add a sink </button>
					</div>

				</div>

			)
		}
	});
}());