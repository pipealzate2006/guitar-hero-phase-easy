import { gameState } from "./gameState.js";

export function addScore() {
  try {
    gameState.score += 10;
    gameState.hasScored = true;
    gameState.scoreText.setText("Score: " + gameState.score);
  } catch (error) {
    console.log(error);
  }
}
