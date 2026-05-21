# latrineMachine

A quest to automate the life of a junior architect - forever laying out restrooms.

Click [Here](https://young-dusk-3643.herokuapp.com/) to see the work in progress

![HI](http://i.imgur.com/ghuCaLz.gif)

##### Getting Started

Load dependencies
```
npm install
```

Start server
```
npm start
```

Start developing
```
gulp default
```

##### Notes:
I have separated the display and manipulation of restrooms from the validation of the fixture locations and the generating of possible restroom orientations. The backend receives frontend input, then crunches it and figures out all of the possible valid restroom orientations for that fixture configuration. It returns this data to the frontend which manages the drawing of the restrooms and user manipulation.

Each fixture is represented as a rectangle for its necessary clearances and then the fixture location within its bounded clearances.

The meat of the backend is a function which can place a fixture on every location in a given room. Then it validates these locations based upon door openings or other fixtures then returns all valid restroom configurations to the frontend.

Some issues:

 - My backend routes are mainly there to crunch data and then I do most of my visual routing on the frontend with react. It feels a little unbalanced or even useless to have the backend routes currently.

 - HTML5 canvas requires a lot of its own logic to manage and manipulate the canvas. React doesn't provide much support for this so I end up going outside of react to external scripts to manage this. In the future, it feels like it may cause an issue were react is clueless to the changes in the DOM.


