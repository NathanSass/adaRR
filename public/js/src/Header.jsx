(function() {
	var React = require('react');

	module.exports = React.createClass({
		render: function() {

			return (
				<header>
					<div className="contentArea">
						<div className="logo">
							<img src="/public/img/logo.svg" alt="logo"/><span className="logo-text">LatrineMachine</span>
						</div>
						<div className="greeter">{this.props.headerGreet}</div>
					</div>
				</header>
			)
		}
	});
}());