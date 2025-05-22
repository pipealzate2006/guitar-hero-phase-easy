import { noteScale, lanePositionsX, gameState } from "./gameState.js";

export function addNote(laneIndex, notes) {
  try {
    let noteKey;
    switch (laneIndex) {
      case 0:
        noteKey = "note-a";
        break;
      case 1:
        noteKey = "note-s";
        break;
      case 2:
        noteKey = "note-d";
        break;
      case 3:
        noteKey = "note-f";
        break;
      default:
        return;
    }
    const note = notes
      .create(lanePositionsX[laneIndex], -50, noteKey)
      .setOrigin(0, 0)
      .setScale(noteScale);

    note.setVelocityY(gameState.currentNoteSpeed);
  } catch (error) {
    console.log(error);
  }
}
