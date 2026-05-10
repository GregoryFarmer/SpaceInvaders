/**                              
 *  _____ _____ _     _           _ 
 * |  __ |     |_|___| |_ ___ ___| |
 * | |___| | | | |  _|   | .'| -_| |
 * |_____|_|_|_|_|___|_|_|__,|___|_|
 * @name invader.js
 * @author Michael
 * @since May 10th, 2026
 * 
 * @description What even are invaders? I mean, they are supposedly aliens but take one look 
 * at the original game and you'll be confused at what they are.
 */
import { lerp, angleTo } from '../utility.js';
import { ScreenShake } from '../screenshake.js';

export default class Invader {
  constructor(x, y, imagePath) {
    this.x = x; this.y = y;
    this.rotation = 0;

    this.element = document.createElement(`img`);
    this.element.src = imagePath;
    this.element.className = `invader`;
    document.body.appendChild(this.element);
  }

  update(direction, speed, playerX, playerY) {
    this.x = lerp(this.x, this.x + direction * speed, 0.3);

    const angle = angleTo(this.x + 20, playerX + 30, this.y + 20, playerY + 30);
    this.rotation = lerp(this.rotation, angle, 0.15);
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.transform = `rotate(${this.rotation}rad)`;
  }

  createExplosion() {
    const explosion = document.createElement(`div`);
    explosion.className = `explosion`;
    explosion.style.left = `${this.x - 20}px`;
    explosion.style.top = `${this.y - 20}px`;
    document.body.appendChild(explosion);

    setTimeout(() => {
      explosion.remove();
    }, 500);
  }
  
  moveDown(amount) {
    this.y += amount;
  }

  destroy() {
    this.createExplosion();
    this.element.remove();
    ScreenShake.shake(30);
  }
}