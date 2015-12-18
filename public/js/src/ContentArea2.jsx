(function() {
	var React = require('react');

	module.exports = React.createClass({
		render: function() {

			return (
				<section className="contentArea2">
					<div className="contentArea">
						<div className="actionableQuestion">
							What is the shape of your room?
						</div>
						<div className="roomCardContainer">
							<a href="#" className="roomCard">
								<div className="roomShapeContainer">
									<img src="/public/img/rectangular.svg" alt="logo"/>
									<div>Rectangular</div>
								</div>
							</a>
							<a href="#" className="roomCard">
								<div className="roomShapeContainer">
									<img src="/public/img/rectangular.svg" alt="logo"/>
									<div>Indent top right</div>
								</div>
							</a>
							<a href="#" className="roomCard">
								<div className="roomShapeContainer">
									<img src="/public/img/rectangular.svg" alt="logo"/>
									<div>Indent top left</div>
								</div>
							</a>
							<a href="#" className="roomCard">
								<div className="roomShapeContainer">
									<img src="/public/img/rectangular.svg" alt="logo"/>
									<div>Indent bottom right</div>
								</div>
							</a>
						</div>
						<button className="nextButton" type="button">Next</button>
					</div>
				</section>
			)
		}
	});
}());