import { gameState, noteScale, lanePositionsX } from "./gameState.js";

export function removeScore(scene, notes) {
  if (gameState.score === 0) return;

  gameState.score -= 10;
  gameState.hasScored = true;
  gameState.scoreText.setText("Score: " + gameState.score);

  if (gameState.score === 100) {
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

  if (
    gameState.score === 0 &&
    gameState.hasScored
  ) {
    gameState.timesEscIsPressed = 3;
    gameState.isModalGameOverOpen = true;
    Object.values(scene.noteSound).forEach((sound) => {
      if (sound) {
        sound.stop();
      }
      sound.destroy();
    });
    scene.gameOverModal = scene.add
      .image(480, 270, "game-over-modal")
      .setScale(0.7);
    scene.sound.play("gameover-sound");

    scene.physics.world.pause();
  }
}
