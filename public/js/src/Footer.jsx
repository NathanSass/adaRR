(function() {
	var React = require('react');

	module.exports = React.createClass({
		render: function() {
			var resourceStyle = {
				display: 'none'
			}

			return (
				<footer>
					<div className="contentArea">
						Made by Nathan Sass
					</div>
					<div id="resources" style={resourceStyle}>
						<img id="toilet1" src="public/img/toilet_1.png" height="60px" width="60px"/>
						<img id="toilet2" src="public/img/toilet_2.png" height="60px" width="60px"/>
						<img id="toilet3" src="public/img/toilet_3.png" height="60px" width="60px"/>
						<img id="toilet4" src="public/img/toilet_4.png" height="60px" width="60px"/>
					</div>
				</footer>
			)
		}
	});
}());