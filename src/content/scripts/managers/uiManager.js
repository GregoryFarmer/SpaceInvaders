/**                              
 *  _____ _____ _     _           _ 
 * |  __ |     |_|___| |_ ___ ___| |
 * | |___| | | | |  _|   | .'| -_| |
 * |_____|_|_|_|_|___|_|_|__,|___|_|
 * @name uiManager.js
 * @author Michael
 * @since May 10th, 2026
 * 
 * @description This class is primarily used to constantly update the player's score.
 */
import { lerp } from '../utility.js';

const timeForm = document.getElementById(`timeForm`);
const playerNameInput = document.getElementById(`playerName`);

export default class UIManager {
  constructor() {
    this.mainMenu = document.getElementById(`mainMenu`);
    this.gameOverMenu = document.getElementById(`gameOverMenu`);
    this.gameWonMenu = document.getElementById(`gameWonMenu`);

    this.scoreText = document.getElementById(`score`);

    this.score = 0;
    this.displayScore = 0;
    this.scoreLerp = 0.08;
  }

  setScore(score) {
    this.score = score;
  }

  update() {
    this.displayScore = lerp(
      this.displayScore,
      this.score,
      this.scoreLerp
    );

    this.scoreText.innerText = `Score: ${Math.round(this.displayScore)}`;
  }

  showMenu(menu) {
    this.mainMenu.style.display = `none`;
    this.gameOverMenu.style.display = `none`;
    this.gameWonMenu.style.display = `none`;
    menu.style.display = `flex`;
  }
}