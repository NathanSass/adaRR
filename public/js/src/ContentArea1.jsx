(function() {
	var React = require('react');

	module.exports = React.createClass({
		render: function() {
			
			var contentAreaClasses = 'contentArea ';
			var ca1Classes = 'contentArea1 ';
			if (this.props.classesToPass) {
				contentAreaClasses += this.props.classesToPass;
				ca1Classes += this.props.classesToPass;
			}

			return (
				<section className={ca1Classes}>
					<div className={contentAreaClasses}>
						{this.props.children}
					</div>
				</section>
			)
		}
	});
}());