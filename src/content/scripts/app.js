/**                              
 *  _____ _____ _     _           _ 
 * |  __ |     |_|___| |_ ___ ___| |
 * | |___| | | | |  _|   | .'| -_| |
 * |_____|_|_|_|_|___|_|_|__,|___|_|
 * @name app.js
 * @author Michael
 * @since May 10th, 2026
 * 
 * @description This script creates and initalizes the Game. 
 */
import Game from './game.js';

const game = new Game();

const startBtn = document.getElementById(`startBtn`);
const retryBtn = document.getElementById(`retryBtn`);
const menuBtn = document.getElementById(`menuBtn`);

const winRetryBtn = document.getElementById(`winRetryBtn`);
const winMenuBtn = document.getElementById(`winMenuBtn`);

startBtn.addEventListener(`click`, () => {
  game.start();
});

retryBtn.addEventListener(`click`, () => {
  game.restart();
});

menuBtn.addEventListener(`click`, () => {
  game.showMainMenu();
});

winRetryBtn.addEventListener(`click`, () => {
  game.restart();
});

winMenuBtn.addEventListener(`click`, () => {
  game.showMainMenu();
});