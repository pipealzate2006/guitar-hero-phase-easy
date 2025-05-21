import { gameState } from "./gameState.js";

export function addScore() {
  gameState.score += 10;
  gameState.hasScored = true;
  gameState.scoreText.setText("Score: " + gameState.score);
}
