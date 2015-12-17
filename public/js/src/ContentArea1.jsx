(function() {
	var React = require('react');

	module.exports = React.createClass({
		render: function() {

			return (
				<section className="contentArea1">
					<div className="contentArea">
						<div className="miniHeading">
							What is an accessible bathroom? <br/>
							Click <a href="http://www.bobrick.com/documents/planningguide.pdf">here</a> to find out and see the full guidelines.
						</div>
						<div className="greeter">Welcome! Today we are going to design an accessible bathroom</div>
					</div>
				</section>
			)
		}
	});
}());