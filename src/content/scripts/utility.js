/**                              
 *  _____ _____ _     _           _ 
 * |  __ |     |_|___| |_ ___ ___| |
 * | |___| | | | |  _|   | .'| -_| |
 * |_____|_|_|_|_|___|_|_|__,|___|_|
 * @name utility.js
 * @author Michael
 * @since May 10th, 2026
 * 
 * @description Exports functions needed for "smooth operata."
 */
export function lerp(start, end, time) {
  return start + ((end - start) * time);
}

export function angleTo(x1, x2, y1, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}