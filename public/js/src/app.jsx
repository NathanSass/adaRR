var React      = require('react');
var ReactDOM   = require('react-dom');

var Room = require('./Room.jsx');


var room = {
				id: 'firstCanvas',
				maxX: 10,
				maxY: 10,
				door: {
					pos1: { x: 0.4, y: 0 },
					pos2: { x: 3.1, y: 0 }
				}
			};

ReactDOM.render(
    <Room data={room}/>,
    document.getElementById('canvasContainer')
);