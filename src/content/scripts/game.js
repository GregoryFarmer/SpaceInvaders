/**                              
 *  _____ _____ _     _           _ 
 * |  __ |     |_|___| |_ ___ ___| |
 * | |___| | | | |  _|   | .'| -_| |
 * |_____|_|_|_|_|___|_|_|__,|___|_|
 * @name game.js
 * @author Michael
 * @since May 10th, 2026
 * 
 * @description This class is the heart of the engine; it handles everything, 
 * from the creation of players, invaders, and bullets to loops.
 */
import Player from './entities/player.js';
import Invader from './entities/invader.js';
import EnemyBullet from './entities/enemyBullet.js';
import Starfield from './entities/starfield.js';
import SoundManager from './managers/soundManager.js';
import UIManager from './managers/uiManager.js';
import { ScreenShake } from './screenshake.js';

const timeForm = document.getElementById(`timeForm`);
const playerNameInput = document.getElementById(`playerName`);

async function loadLeaderboard() {
  try {
    const res = await fetch(`http://localhost:8080/leaderboard`);
    const data = await res.json();

    const list = document.getElementById(`leaderboardList`);
    list.innerHTML = ``;

    data.forEach(entry => {
      const li = document.createElement(`li`);
      li.textContent = `${entry.name} - ${entry.time}s`;
      list.appendChild(li);
    });

  } catch (err) {
    console.error(`Failed to load leaderboard:`, err);
  }
}

export default class Game {
  #gameStart;

  constructor() {
    this.folders = {
      images: `./assets/images`,
      sounds: `./assets/sounds`
    };

    this.sound = new SoundManager(this.folders);
    this.ui = new UIManager();
    this.starfield = new Starfield();

    this.player = new Player(
      document.getElementById(`player`),
      this.sound
    );

    this.invaders = [];
    this.bullets = [];
    this.enemyBullets = [];

    this.score = 0;
    this.gameRunning = false;

    this.mouseX = window.innerWidth / 2; this.mouseY = window.innerHeight / 2;
    this.invaderDirection = 1;
    this.invaderSpeed = 3;

    this.loopStarted = false;

    this.keys = {
      ArrowLeft: false,
      ArrowRight: false,
      KeyA: false,
      KeyD: false
    };

    this.mainMenu = document.getElementById(`mainMenu`);
    this.gameOverMenu = document.getElementById(`gameOverMenu`);
    this.gameWonMenu = document.getElementById(`gameWonMenu`);

    this.setupEvents();
    this.showMainMenu();
  }

  setupEvents() {
    document.addEventListener(`mousemove`, e => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    document.addEventListener(`keydown`, input => {
      if (input.code in this.keys) {
        this.keys[input.code] = true;
      }

      if (input.code === `Space`) {
        if (!this.gameRunning) return;
        this.bullets.push(
          this.player.shoot(this.mouseX, this.mouseY)
        );
      }

      if ([`ArrowLeft`, `ArrowRight`, `KeyA`, `KeyD`, `Space`].includes(input.code)) {
        e.preventDefault();
      }
    });

    document.addEventListener(`click`, () => {
      if (!this.gameRunning) return;
        this.bullets.push(
        this.player.shoot(this.mouseX, this.mouseY)
      );
    })

    document.addEventListener(`keyup`, input => {
      if (input.code in this.keys) {
        this.keys[input.code] = false;
      }
    });
  }

  createInvaders() {
    const rows = 4;
    const cols = 8;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.invaders.push(
          new Invader(
            100 + c * 70,
            80 + r * 60,
            `${this.folders.images}/alien.png`
          )
        );
      }
    }
  }

  start() {
    this.cleanup();
    this.score = 0;
    this.ui.setScore(0);
    this.gameRunning = true;
    this.invaderDirection = 1;
    this.invaderSpeed = 2;
    this.createInvaders();
    this.sound.bgmPlay();
    this.hideMenus();
    this.setGameplayVisible(true);
    this.#gameStart = new Date();

    timeForm.style.display = `flex`;
    timeForm.classList.remove(`timeForm-hide`);

    playerNameInput.value = ``;
    playerNameInput.disabled = false;

    if (!this.loopStarted) {
      this.loopStarted = true;
      requestAnimationFrame(() => this.loop());
    }
    clearInterval(this.enemyShootInterval);
    this.enemyShootInterval = setInterval(() => {
      this.enemyShoot();
    }, 1000);
  }

  restart() {
    this.start();
  }

  showMainMenu() {
    this.gameRunning = false;
    this.cleanup();
    this.sound.bgmStop();
    this.hideMenus();
    this.mainMenu.style.display = `flex`;
    loadLeaderboard();

    requestAnimationFrame(() => {
      this.mainMenu.classList.add(`menu-show`);
    });

    this.setGameplayVisible(false);
  }

  hideMenus() {
    this.mainMenu.style.display = `none`;
    this.gameOverMenu.style.display = `none`;
    this.gameWonMenu.style.display = `none`;

    this.mainMenu.classList.remove(`menu-show`);
    this.gameOverMenu.classList.remove(`menu-show`);
    this.gameWonMenu.classList.remove(`menu-show`);
  }

  setGameplayVisible(visible) {
    const display = visible ? `block` : `none`;

    this.player.element.style.display = display;

    this.invaders.forEach(i => {
      i.element.style.display = display;
    });

    this.bullets.forEach(b => {
      b.element.style.display = display;
    });

    this.enemyBullets.forEach(b => {
      b.element.style.display = display;
    });
  }

  enemyShoot() {
    if (!this.gameRunning) return;
    if (this.invaders.length === 0) return;

    this.sound.play(`enemyShoot`);

    const shooter =
      this.invaders[
        Math.floor(Math.random() * this.invaders.length)
      ];

    const bullet = new EnemyBullet(
      shooter.x + 20,
      shooter.y + 40
    );

    this.enemyBullets.push(bullet);
  }

  updateInvaders() {
    let hitEdge = false;

    for (const inv of this.invaders) {
      inv.update(
        this.invaderDirection,
        this.invaderSpeed,
        this.player.x,
        this.player.y
      );

      if (
        inv.x <= 0 ||
        inv.x >= window.innerWidth - 40
      ) {
        hitEdge = true;
      }
    }

    if (hitEdge) {
      this.invaderDirection *= -1;
      for (const inv of this.invaders) {
        inv.moveDown(30);
        if (inv.y + 40 >= this.player.y) {
          this.endGame(false);
        }
      }
    }

    if (this.invaders.length === 0) {
      this.endGame(true);
    }
  }

  updateBullets() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];

      b.update();
      if (b.offscreen()) {
        b.destroy();
        this.bullets.splice(i, 1);
        continue;
      }

      for (let j = this.invaders.length - 1; j >= 0; j--) {
        const inv = this.invaders[j];

        if (
          b.x < inv.x + 40 &&
          b.x + 4 > inv.x &&
          b.y < inv.y + 40 &&
          b.y + 12 > inv.y
        ) {
          this.sound.play(`invaderExplode`);
          inv.destroy();
          this.invaders.splice(j, 1);
          b.destroy();
          this.bullets.splice(i, 1);
          this.score += 10;
          this.invaderSpeed += 0.1;
          break;
        }
      }
    }
  }

  updateEnemyBullets() {
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const b = this.enemyBullets[i];

      b.update();

      if (
        b.x < this.player.x + this.player.width &&
        b.x + 4 > this.player.x &&
        b.y < this.player.y + this.player.height &&
        b.y + 12 > this.player.y
      ) {
        this.endGame(false);
      }

      if (b.y > window.innerHeight) {
        b.destroy();
        this.enemyBullets.splice(i, 1);
      }
    }
  }

  endGame(won = false) {
    this.gameRunning = false;
    clearInterval(this.enemyShootInterval);

    if (won) {
      this.sound.play(`gameWin`);
      this.hideMenus();
      const finalTime = ((new Date() - this.#gameStart) / 1000).toFixed(2);
      document.getElementById(`timeDisplay`).innerText = `Time: ${finalTime}s`;

      this.gameWonMenu.style.display = `flex`;
      const submitHandler = (e) => {
        e.preventDefault();
        const name = playerNameInput.value.trim();
        const time = finalTime;

        if (!name) return;

        fetch(`http://localhost:8080`, {
          method: `POST`,
          headers: {
            'Content-Type': `application/json`
          },
          body: JSON.stringify({ name, time })
        }).then(res => res.json()).then(data => {
          console.log(`Server response:`, data);
        }).catch(err => {
          console.error(`Error submitting time:`, err);
        });

        console.log(`Submitting time:`, { name, time });
        playerNameInput.disabled = true;
        timeForm.style.animation = `none`;
        void timeForm.offsetWidth;
        timeForm.classList.add(`timeForm-hide`);

        setTimeout(() => {
          timeForm.style.display = `none`;
        }, 400);

        timeForm.removeEventListener(`submit`, submitHandler);
      };
    
      timeForm.addEventListener(`submit`, submitHandler);
      requestAnimationFrame(() => {
        this.gameWonMenu.classList.add(`menu-show`);
      });

      return;
    }

    this.sound.play(`playerExplode`);
    this.player.element.classList.add(`player-death`);

    setTimeout(() => {
      this.player.element.classList.remove(`player-death`);
      this.hideMenus();
      this.gameOverMenu.style.display = `flex`;

      requestAnimationFrame(() => {
        this.gameOverMenu.classList.add(`menu-show`);
      });
    }, 600);
  }

  cleanup() {
    this.bullets.forEach(b => b.destroy());
    this.enemyBullets.forEach(b => b.destroy());
    this.invaders.forEach(i => i.destroy());

    this.bullets = [];
    this.enemyBullets = [];
    this.invaders = [];
  }

  loop() {
    this.starfield.update();

    if (this.gameRunning) {
      this.player.update(this.keys, this.mouseX, this.mouseY);
      this.updateBullets();
      this.updateInvaders();
      this.updateEnemyBullets();
    }

    ScreenShake.update();
    this.ui.setScore(this.score);
    this.ui.update();
    requestAnimationFrame(() => this.loop());
  }
}