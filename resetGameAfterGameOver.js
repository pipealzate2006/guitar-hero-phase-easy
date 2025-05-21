import { gameState } from "./gameState.js";

export function resetGameAfterGameOver(isEnter, scene) {
  if (gameState.score === 0 && gameState.hasScored) {
    if (gameState.isModalGameOverOpen && isEnter) {
      gameState.timesEscIsPressed = 0;
      scene.gameOverModal.destroy();
      scene.noteEvent.remove();
      scene.scene.restart();
      gameState.score = 0;
      gameState.hasScored = false;
      gameState.isModalGameOverOpen = false;
    }
  }
}
