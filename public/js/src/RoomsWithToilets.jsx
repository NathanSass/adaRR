(function() {
	var React = require('react');
	var Draw  = require('./Draw.jsx');

	module.exports = React.createClass({
		
		componentDidMount: function() {
			// var rect;
			// this.props.rect ? rect = this.props.rect : rect = { h: 158, w: 235 }; //BUGBUG for development purposes
			
			var params = {
				setData: this.props.setData,
				room: this.props.data
			};


			Draw.draw(params);

		},

		render: function() {
			return (
				<h1> Canvas {this.props.data.id} </h1>
			)
		}
	});
}());