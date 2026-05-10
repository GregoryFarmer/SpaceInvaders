/**                              
 *  _____ _____ _     _           _ 
 * |  __ |     |_|___| |_ ___ ___| |
 * | |___| | | | |  _|   | .'| -_| |
 * |_____|_|_|_|_|___|_|_|__,|___|_|
 * @name soundManager.js
 * @author Michael
 * @since May 10th, 2026
 * 
 * @description A class providing method for playing sound effects and the game's background music. 
 */
export default class SoundManager {
  constructor(folder = `./`) {
    this.sounds = {
      shoot: new Audio(`${folder.sounds}/shoot.mp3`),
      invaderExplode: new Audio(`${folder.sounds}/invader_explode.mp3`),
      playerExplode: new Audio(`${folder.sounds}/player_explode.mp3`),
      enemyShoot: new Audio(`${folder.sounds}/enemy_shoot.mp3`),
      gameWin: new Audio(`${folder.sounds}/game_won.mp3`),
      backgroundMusic: new Audio(`${folder.sounds}/bgm.mp3`)
    };

    for (const key in this.sounds) {
      this.sounds[key].volume = 0.6;
      this.sounds[key].preload = `auto`;
    }
    this.sounds.backgroundMusic.loop = true;
    this.sounds.backgroundMusic.volume = 0.4;
  }

  play(name) {
    const sound = this.sounds[name];
    if (!sound) return;
    sound.currentTime = 0;
    sound.play();
  }

  bgmPlay() {
    this.sounds.backgroundMusic.play();
  }

  bgmStop() {
    this.sounds.backgroundMusic.pause();
    this.sounds.backgroundMusic.currentTime = 0;
  }
}