/**                              
 *  _____ _____ _     _           _ 
 * |  __ |     |_|___| |_ ___ ___| |
 * | |___| | | | |  _|   | .'| -_| |
 * |_____|_|_|_|_|___|_|_|__,|___|_|
 * @name index.js
 * @author Michael
 * @since May 10th, 2026
 * 
 * @description Creates the main window when running "npm run start" and includes a webserver 
 * for saving leaderboard information. 
 */
const { app, BrowserWindow } = require(`electron`);
const path = require(`node:path`);
const fs = require(`node:fs`);
const express = require(`express`);
const web = express();

if (require(`electron-squirrel-startup`)) {
  app.quit();
}

web.use(express.json());
web.use(express.urlencoded({extended: false}));

let leaderboard = [];

async function loadLeaderboard() {
  try {
    const data = await fs.readFileSync(`./leaderboard.json`, `utf8`);
    leaderboard = JSON.parse(data);
  } catch (err) {
    console.log(`No leaderboard file found, starting fresh.`);
    leaderboard = [];
  }
}

async function saveLeaderboard() {
  await fs.writeFileSync(`./leaderboard.json`, JSON.stringify(leaderboard, null, 2));
}

web.post(`/`, async (req, res) => {
  console.log(`Received!`, req.body);

  const { name, time } = req.body;
  if (!name || !time) {
    return res.status(400).json({ error: `Missing name or time` });
  }

  leaderboard.push({ name, time: Number(time) });
  leaderboard.sort((a, b) => a.time - b.time);
  await saveLeaderboard();

  res.json({ success: true });
});

web.get(`/leaderboard`, async (req, res) => {
  await loadLeaderboard();
  res.json(leaderboard.slice(0, 10));
});

web.listen(8080);

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, `preload.js`),
    },
    icon: path.join(__dirname, `/content/assets/images/favicon.png`)
  });

  mainWindow.loadFile(path.join(__dirname, `/content/index.html`));
  return mainWindow;
};

app.whenReady().then(() => {
  let window = createWindow();
  window.removeMenu()

  app.on(`activate`, () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on(`window-all-closed`, () => {
  if (process.platform !== `darwin`) {
    app.quit();
  }
});

