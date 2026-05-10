/**                              
 *  _____ _____ _     _           _ 
 * |  __ |     |_|___| |_ ___ ___| |
 * | |___| | | | |  _|   | .'| -_| |
 * |_____|_|_|_|_|___|_|_|__,|___|_|
 * @name bullet.js
 * @author Michael
 * @since May 10th, 2026
 * 
 * @description Bullets are not regular enemy bullets (what?). Bullets are the shooty 
 * coming from the player that obliterates the enemies.
 */
export default class Bullet {
  constructor(x, y, vx, vy) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.element = document.createElement(`div`);
    this.element.className = `bullet`;
    document.body.appendChild(this.element);
  }

  update() {
    this.x += this.vx; this.y += this.vy;
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  destroy() {
    this.element.remove();
  }

  offscreen() {
    return (
      this.x < -50 || this.x > window.innerWidth + 50 || this.y < -50 || this.y > window.innerHeight + 50
    );
  }
}