(function() {
	var React = require('react');

	module.exports = React.createClass({
		render: function() {

			return (
				<section className="contentArea1">
					<div className="contentArea">
						{this.props.children}
					</div>
				</section>
			)
		}
	});
}());