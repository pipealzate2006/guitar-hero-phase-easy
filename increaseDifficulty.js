import {
  gameState,
  noteSpeed,
  noteScale,
  lanePositionsX,
} from "./gameState.js";

export function increaseDifficulty(notes, scene) {
  if (
    gameState.score % 50 === 0 &&
    gameState.score !== 0 &&
    gameState.score !== gameState.lastSpeedUpdateScore
  ) {
    const levelsPassed = Math.floor(gameState.score / 50);
    gameState.currentNoteSpeed = noteSpeed + 30 * levelsPassed;
    gameState.lastSpeedUpdateScore = gameState.score;

    gameState.delayTimeCreateNote = 1500 - 80 * levelsPassed;

    if (gameState.delayTimeCreateNote < 600) {
      gameState.delayTimeCreateNote = 600;
    }

    notes.getChildren().forEach((note) => {
      note.setVelocityY(gameState.currentNoteSpeed);
    });

    scene.noteEvent.remove();
    scene.noteEvent = scene.time.addEvent({
      delay: gameState.delayTimeCreateNote,
      callback: () => {
        const randomLane = Phaser.Math.Between(0, 3);
        const notekey = ["note-a", "note-s", "note-d", "note-f"][randomLane];
        const note = notes
          .create(lanePositionsX[randomLane], -50, notekey)
          .setOrigin(0, 0)
          .setScale(noteScale);
        note.setVelocityY(gameState.currentNoteSpeed);
      },
      callbackScope: scene,
      loop: true,
    });
  }
}
