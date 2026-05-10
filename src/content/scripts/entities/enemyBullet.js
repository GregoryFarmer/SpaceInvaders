/**                              
 *  _____ _____ _     _           _ 
 * |  __ |     |_|___| |_ ___ ___| |
 * | |___| | | | |  _|   | .'| -_| |
 * |_____|_|_|_|_|___|_|_|__,|___|_|
 * @name enemyBullet.js
 * @author Michael
 * @since May 10th, 2026
 * 
 * @description Enemy bullets are not regular bullets.
 */
import { lerp } from '../utility.js';

export default class EnemyBullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.element = document.createElement(`div`);
    this.element.className = `enemyBullet`;
    document.body.appendChild(this.element);
  }

  update() {
    this.y = lerp(this.y, this.y + 5, 0.3);
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  destroy() {
    this.element.remove();
  }
}