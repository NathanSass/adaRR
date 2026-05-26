import { ftToCmAndRound, inchToCm } from './utilRR.js';

let ROOM;
let startingCoordinate;
let roomCorners = [];

const TOILET = { w: 6, d: 4, loc: 1.5 };

export function findAccessible(roomModel) {
  startingCoordinate = { x: 0, y: 0 };
  roomCorners = [];
  ROOM = roomModel;
  findRoomCorners();
  const usefulToilets = findPossibleToiletLocations();
  return formatDataForPackaging(usefulToilets);
}

function formatDataForPackaging(validToiletArr) {
  const doorLocation = ROOM.door;
  const formattedRestrooms = [];
  const canvasOffset = ftToCmAndRound(2);

  validToiletArr.forEach((validRR, i) => {
    const idx = i + 1;
    const newRoom = {
      id: 'canvas' + idx,
      maxX: ftToCmAndRound(ROOM.x),
      maxY: ftToCmAndRound(ROOM.y),
      canvasOffset,
      door: {
        pos1: { x: ftToCmAndRound(doorLocation.pos1.x) + canvasOffset, y: ftToCmAndRound(doorLocation.pos1.y) + canvasOffset },
        pos2: { x: ftToCmAndRound(doorLocation.pos2.x) + canvasOffset, y: ftToCmAndRound(doorLocation.pos2.y) + canvasOffset }
      },
      rotation: validRR.rotation,
      toilet: {
        depth: inchToCm(28),
        width: inchToCm(23),
        bound: { h: ftToCmAndRound(TOILET.d), w: ftToCmAndRound(TOILET.w) },
        loc: { distFromWall: ftToCmAndRound(TOILET.loc), x: ftToCmAndRound(validRR.loc.x), y: ftToCmAndRound(validRR.loc.y) }
      },
      note: validRR.note
    };
    const canvasSize = getCanvasSize(newRoom);
    newRoom.canvasSize = canvasSize;
    formattedRestrooms.push(newRoom);
  });
  return formattedRestrooms;
}

function getCanvasSize(roomData) {
  const { canvasOffset, maxY: height, maxX: width } = roomData;
  let canvasSize = height >= width ? height : width;
  canvasSize += canvasOffset * 2;
  return canvasSize;
}

function isPointPerimetorInsideRectangle(pt, fixture) {
  const allX = [], allY = [];
  for (const coord in fixture) {
    if (fixture.hasOwnProperty(coord) && coord !== 'note' && coord !== 'rotation' && coord !== 'loc') {
      if (fixture[coord] && typeof fixture[coord].x === 'number') {
        allX.push(fixture[coord].x);
        allY.push(fixture[coord].y);
      }
    }
  }
  allX.sort((a, b) => a - b);
  allY.sort((a, b) => a - b);
  return pt.y >= allY[0] && pt.y <= allY[allY.length-1] && pt.x <= allX[allX.length-1] && pt.x >= allX[0];
}

function fixtureFirstHorizontal(fixture, startPoint) {
  const sPoint = startPoint ? { x: startPoint.x - fixture.w, y: startPoint.y } : { ...startingCoordinate };
  const newFixture = { w1: sPoint, rotation: 0 };
  newFixture.w2 = { x: sPoint.x + fixture.w, y: sPoint.y };
  newFixture.d1 = { x: sPoint.x, y: sPoint.y + fixture.d };
  newFixture.d2 = { x: sPoint.x + fixture.w, y: sPoint.y + fixture.d };
  newFixture.loc = startPoint
    ? { x: sPoint.x + fixture.w - fixture.loc, y: sPoint.y }
    : { x: sPoint.x + fixture.loc, y: sPoint.y };
  newFixture.note = startPoint ? "firstHorz, 2nd" : "firstHorz, 1st";
  return newFixture;
}

function fixtureSecondVertical(fixture, startPoint) {
  const sPoint = startPoint ? { x: startPoint.x, y: startPoint.y + fixture.w } : { ...startingCoordinate };
  const newFixture = { w1: sPoint, rotation: 270 };
  newFixture.w2 = { x: sPoint.x, y: sPoint.y - fixture.w };
  newFixture.d1 = { x: sPoint.x + fixture.d, y: sPoint.y };
  newFixture.d2 = { x: sPoint.x + fixture.d, y: sPoint.y - fixture.w };
  newFixture.loc = startPoint
    ? { x: sPoint.x, y: sPoint.y - fixture.w + fixture.loc }
    : { x: sPoint.x, y: sPoint.y - fixture.loc };
  newFixture.note = startPoint ? "secondVert, 2nd" : "secondVert, 1st";
  return newFixture;
}

function fixtureFirstVertical(fixture, startPoint) {
  const sPoint = startPoint ? { x: startPoint.x, y: startPoint.y - fixture.w } : { ...startingCoordinate };
  const newFixture = { w1: sPoint, rotation: 90 };
  newFixture.w2 = { x: sPoint.x, y: sPoint.y + fixture.w };
  newFixture.d1 = { x: sPoint.x - fixture.d, y: sPoint.y };
  newFixture.d2 = { x: sPoint.x - fixture.d, y: sPoint.y + fixture.w };
  newFixture.loc = startPoint
    ? { x: sPoint.x, y: sPoint.y + fixture.w - fixture.loc }
    : { x: sPoint.x, y: sPoint.y + fixture.loc };
  newFixture.note = startPoint ? "firstVert, 2nd" : "firstVert, 1st";
  return newFixture;
}

function fixtureSecondHorizontal(fixture, startPoint) {
  const sPoint = startPoint ? { x: startPoint.x + fixture.w, y: startPoint.y } : { ...startingCoordinate };
  const newFixture = { w1: sPoint, rotation: 180 };
  newFixture.w2 = { x: sPoint.x - fixture.w, y: sPoint.y };
  newFixture.d1 = { x: sPoint.x, y: sPoint.y - fixture.d };
  newFixture.d2 = { x: sPoint.x - fixture.w, y: sPoint.y - fixture.d };
  newFixture.loc = startPoint
    ? { x: sPoint.x - fixture.w + fixture.loc, y: sPoint.y }
    : { x: sPoint.x - fixture.loc, y: sPoint.y };
  newFixture.note = startPoint ? "secondHorz, 2nd" : "secondHorz, 1st";
  return newFixture;
}

function findRoomCorners() {
  roomCorners.push(startingCoordinate);
  roomCorners.push({ x: ROOM.x, y: 0 });
  roomCorners.push({ x: ROOM.x, y: ROOM.y });
  roomCorners.push({ x: 0, y: ROOM.y });
}

function advanceStartingCoordinate() {
  const currentCoordI = roomCorners.indexOf(startingCoordinate);
  const nextI = currentCoordI + 1;
  if (roomCorners[nextI]) {
    startingCoordinate = roomCorners[nextI];
    return true;
  }
  return false;
}

function buildToilet() {
  const newToilets = [];
  if (startingCoordinate.x === 0 && startingCoordinate.y === 0) {
    newToilets.push(fixtureFirstHorizontal(TOILET));
    newToilets.push(fixtureFirstHorizontal(TOILET, { x: ROOM.x, y: 0 }));
  }
  if (startingCoordinate.x === ROOM.x && startingCoordinate.y === 0) {
    newToilets.push(fixtureFirstVertical(TOILET));
    newToilets.push(fixtureFirstVertical(TOILET, { x: ROOM.x, y: ROOM.y }));
  }
  if (startingCoordinate.x === ROOM.x && startingCoordinate.y === ROOM.y) {
    newToilets.push(fixtureSecondHorizontal(TOILET));
    newToilets.push(fixtureSecondHorizontal(TOILET, { x: 0, y: ROOM.y }));
  }
  if (startingCoordinate.x === 0 && startingCoordinate.y === ROOM.y) {
    newToilets.push(fixtureSecondVertical(TOILET));
    newToilets.push(fixtureSecondVertical(TOILET, { x: 0, y: 0 }));
  }
  return newToilets;
}

function buildFixtureAroundRoom(fixtureBuilderFunc) {
  const allPossibleFixtures = [];
  do {
    const fixtures = fixtureBuilderFunc();
    allPossibleFixtures.push(fixtures[0]);
    allPossibleFixtures.push(fixtures[1]);
  } while (advanceStartingCoordinate());
  return allPossibleFixtures;
}

function findPossibleToiletLocations() {
  const allPossibleToiletsArr = buildFixtureAroundRoom(buildToilet);
  const validToiletArr = [];
  allPossibleToiletsArr.forEach(toilet => {
    if (!isPointPerimetorInsideRectangle(ROOM.door.pos1, toilet) &&
        !isPointPerimetorInsideRectangle(ROOM.door.pos2, toilet)) {
      validToiletArr.push(toilet);
    }
  });
  return validToiletArr;
}
