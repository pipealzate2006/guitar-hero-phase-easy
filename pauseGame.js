import { gameState } from "./gameState.js";

export function pauseGame(isEsc, scene) {
  try {
    if (isEsc) {
      gameState.timesEscIsPressed += 1;
      if (gameState.timesEscIsPressed === 1) {
        scene.noteEvent.paused = true;
        scene.physics.world.pause();
        Object.values(scene.noteSound).forEach((sound) => {
          sound.pause();
        });
        scene.pauseModal = scene.add
          .image(480, 270, "pause-modal")
          .setScale(0.7);
      } else if (gameState.timesEscIsPressed === 2) {
        scene.noteEvent.paused = false;
        scene.physics.world.resume();
        Object.values(scene.noteSound).forEach((sound) => {
          sound.resume();
        });
        gameState.timesEscIsPressed = 0;
        scene.pauseModal.destroy();
        scene.pauseModal = null;
      }
    }
  } catch (error) {
    console.log(error);
  }
}
