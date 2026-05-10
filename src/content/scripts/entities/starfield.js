/**                              
 *  _____ _____ _     _           _ 
 * |  __ |     |_|___| |_ ___ ___| |
 * | |___| | | | |  _|   | .'| -_| |
 * |_____|_|_|_|_|___|_|_|__,|___|_|
 * @name starfield.js
 * @author Michael
 * @since May 10th, 2026
 * 
 * @description Oooh, look at those stars! This script provides a class responsible for
 * creating a starfield in the game - to make it seem more like space y'k?
 */
export default class Starfield {
  constructor() {
    this.stars = [];
  }

  createStar() {
    const star = document.createElement(`div`);
    star.className = `star`;
    star.x = Math.random() * window.innerWidth; star.y = -20;
    star.speed = 1 + (Math.random() * 2);
    star.blink = Math.random();
    document.body.appendChild(star);
    this.stars.push(star);
  }

  update() {
    if (Math.random() < 0.1) {
      this.createStar();
    }

    for (let i = this.stars.length - 1; i >= 0; i--) {
      const star = this.stars[i];
      star.y += star.speed;
      star.style.left = `${star.x}px`;
      star.style.top = `${star.y}px`;

      star.style.opacity = Math.abs(Math.sin((Date.now() * 0.002) + star.blink));
      if (star.y > window.innerHeight + 20) {
        star.remove();
        this.stars.splice(i, 1);
      }
    }
  }
}