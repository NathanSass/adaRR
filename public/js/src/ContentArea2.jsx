(function() {
	var React = require('react');

	module.exports = React.createClass({
		render: function() {

			return (
				<section className="contentArea2">
					<div className="actionableQuestion">
						What is the shape of your room?
					</div>
					<div className="roomCardContainer">
						<div className="roomCard">
							<div className="roomShapeContainer">
								<img src="/public/img/rectangular.svg" alt="logo"/>
								<div>Rectangular</div>
							</div>
						</div>
						<div className="roomCard">
							<div className="roomShapeContainer">
								<img src="/public/img/rectangular.svg" alt="logo"/>
								<div>Rectangular</div>
							</div>
						</div>
						<div className="roomCard">
							<div className="roomShapeContainer">
								<img src="/public/img/rectangular.svg" alt="logo"/>
								<div>Rectangular</div>
							</div>
						</div>
						<div className="roomCard">
							<div className="roomShapeContainer">
								<img src="/public/img/rectangular.svg" alt="logo"/>
								<div>Rectangular</div>
							</div>
						</div>
					</div>
				</section>
			)
		}
	});
}());