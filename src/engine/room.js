import { cmToFt } from './utilRR.js';

let ROOM;

export function formatForFindDoor(room) {
  return { room };
}

export function newRoom(urlObject) {
  const dirtyRR = urlObject;
  try {
    ROOM = {
      x: cmToFt(parseFloat(dirtyRR.x)),
      y: cmToFt(parseFloat(dirtyRR.y)),
      door: {
        pos1: { x: cmToFt(parseFloat(dirtyRR.doorpos1[0])), y: cmToFt(parseFloat(dirtyRR.doorpos1[1])) },
        pos2: { x: cmToFt(parseFloat(dirtyRR.doorpos2[0])), y: cmToFt(parseFloat(dirtyRR.doorpos2[1])) },
      }
    };
    return ROOM;
  } catch(err) {
    console.log("malformed url string", err);
    return null;
  }
}

export function get() {
  return ROOM;
}
