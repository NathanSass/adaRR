var React      = require('react');
var ReactDOM   = require('react-dom');

var Room = require('./Room.jsx');
var Header = require('./Header.jsx');


var FormAndCanvas = React.createClass({
	
	getInitialState: function() {
	    return { data: [] };
	},

	handleServerData: function(data) {
		var rooms = JSON.parse(data);
		
		this.setState( {data: rooms } );
	},

	sendDataToServer: function() {
		var Success = false;
		$.ajax({
			// url: 'x=8&y=5&doorpos1=5.75&doorpos1=5&doorpos2=8&doorpos2=5',
			url: 'x=10&y=10&doorpos1=0.5&doorpos1=0&doorpos2=2.25&doorpos2=0',
			crossDomain: true,
			type: 'POST',
			success: function(data) { this.handleServerData(data) }.bind(this),
			error: function(er) {
				console.log('got error')
			}
		})

	},
	
	render: function () {
		var data = this.state.data;
		return (
			<div>
				<Header />
				<button type="button" onClick={this.sendDataToServer}>NEW BUTTON</button>
				{this.state.data.map(function(validRoom, idx){
					return <Room key={idx} data={validRoom} />
				})}
			</div>
		)
	}
})



ReactDOM.render(
    <FormAndCanvas/>,
    document.getElementById('app')
);