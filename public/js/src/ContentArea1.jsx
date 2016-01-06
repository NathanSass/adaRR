(function() {
	var React = require('react');

	module.exports = React.createClass({
		render: function() {
			
			var contentAreaClasses = 'contentArea ';
			if (this.props.classesToPass) {
				contentAreaClasses += this.props.classesToPass;
			}

			return (
				<section className="contentArea1">
					<div className={contentAreaClasses}>
						{this.props.children}
					</div>
				</section>
			)
		}
	});
}());