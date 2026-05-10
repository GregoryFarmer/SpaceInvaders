/**                              
 *  _____ _____ _     _           _ 
 * |  __ |     |_|___| |_ ___ ___| |
 * | |___| | | | |  _|   | .'| -_| |
 * |_____|_|_|_|_|___|_|_|__,|___|_|
 * @name player.js
 * @author Michael
 * @since May 10th, 2026
 * 
 * @description Provides the Player class, which is used for controlling player movement.
 */
import { lerp, angleTo } from '../utility.js';
import Bullet from './bullet.js';

export default class Player {
  constructor(element, soundManager) {
    this.element = element;
    this.soundManager = soundManager;
    this.width = 60;
    this.height = 60;
    this.x = window.innerWidth / 2;
    this.targetX = this.x;
    this.y = window.innerHeight - 100;
    this.rot = 0;
    this.moveSpeed = 5;
    this.lerpAmount = 0.01;
  }

  update(keys, mouseX, mouseY) {
    if (keys.ArrowLeft || keys.KeyA) this.targetX -= this.moveSpeed;
    if (keys.ArrowRight || keys.KeyD) this.targetX += this.moveSpeed;

    this.targetX = Math.max(0, Math.min(window.innerWidth - this.width, this.targetX));
    this.x = lerp(this.x, this.targetX, this.lerpAmount);
    const angle = angleTo(this.x + this.width / 2, mouseX, this.y + this.height / 2,mouseY);
    this.rot = lerp(this.rot, angle, 0.2);

    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.transform = `rotate(${this.rot}rad)`;
  }

  shoot(mouseX, mouseY) {
    this.soundManager.play(`shoot`);
    const speed = 10;
    const offset = 35;
    const ox = Math.cos(this.rot) * offset;
    const oy = Math.sin(this.rot) * offset;

    const startX = this.x + (this.width / 2) + ox;
    const startY = this.y + (this.height / 2) + oy;
    const dx = mouseX - startX; const dy = mouseY - startY;

    const len = Math.hypot(dx, dy);
    return new Bullet(startX, startY, (dx / len) * speed, (dy / len) * speed);
  }
}