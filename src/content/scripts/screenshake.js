/**                              
 *  _____ _____ _     _           _ 
 * |  __ |     |_|___| |_ ___ ___| |
 * | |___| | | | |  _|   | .'| -_| |
 * |_____|_|_|_|_|___|_|_|__,|___|_|
 * @name screenshake.js
 * @author Michael
 * @since May 10th, 2026
 * 
 * @description A helper class for creating a shaking screen effect.
 */
import { lerp } from './utility.js';

export class ScreenShake {
    static intensity = 0;
    static decay = 0.9;
    static offsetX = 0; static offsetY = 0;
    static targetX = 0; static targetY = 0;

    static shake(amount = 20) {
        ScreenShake.intensity = amount;
    }

    static update() {
        if (ScreenShake.intensity > 0.1) {

            ScreenShake.targetX = (Math.random() - 0.5) * ScreenShake.intensity * 3;
            ScreenShake.targetY = (Math.random() - 0.5) * ScreenShake.intensity * 3;
            ScreenShake.offsetX = lerp(ScreenShake.offsetX, ScreenShake.targetX, 0.35);
            ScreenShake.offsetY = lerp(ScreenShake.offsetY, ScreenShake.targetY, 0.35);
            document.body.style.transform = `translate(${ScreenShake.offsetX}px, ${ScreenShake.offsetY}px)`;
            ScreenShake.intensity *= ScreenShake.decay;
        } else {
            ScreenShake.intensity = 0;
            ScreenShake.offsetX = 0;
            ScreenShake.offsetY = 0;
            document.body.style.transform = "";
        }
    }
}
