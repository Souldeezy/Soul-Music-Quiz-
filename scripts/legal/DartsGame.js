import {
  fadeOutDartsMusic,
  playDartsThrowSfx,
  playDartsGoodShotSfx,
  playDartsBadShotSfx,
  playDartsWinSfx,
} from "./DartsGameAudioManager.js";

/* -------------------------------------------------------- */
/* CONFIG ZONES                                             */
/* -------------------------------------------------------- */

const DART_ZONES = [
  {
    name: "Bullseye",
    points: 50,
    diff: "veryhard",
    rMin: 0,
    rMax: 0.04,
  },

  {
    name: "Bull",
    points: 25,
    diff: "hard",
    rMin: 0.04,
    rMax: 0.095,
  },

  {
    name: "Simple inner",
    points: 0,
    diff: "easy",
    rMin: 0.095,
    rMax: 0.58,
  },

  {
    name: "Triple",
    points: 0,
    diff: "hard",
    rMin: 0.58,
    rMax: 0.63,
    isMultiplier: 3,
  },

  {
    name: "Simple outer",
    points: 0,
    diff: "medium",
    rMin: 0.63,
    rMax: 0.95,
  },

  {
    name: "Double",
    points: 0,
    diff: "hard",
    rMin: 0.95,
    rMax: 1,
    isMultiplier: 2,
  },
];

const DART_SECTIONS = [
  20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
];

const GAUGE_CONFIG = {
  easy: { greenPct: 0.55, speed: 0.8 },
  medium: { greenPct: 0.35, speed: 1.6 },
  hard: { greenPct: 0.2, speed: 2.8 },
  veryhard: { greenPct: 0.08, speed: 4.5 },
};

/* -------------------------------------------------------- */
/* ÉTAT DU JEU                                              */
/* -------------------------------------------------------- */

let dartsScore = 301;
let dartsTurn = 0;
let dartsThrow = 0;
let gaugeAnimId = null;
let currentZone = null;
let gaugeActive = false;
let isGameActive = false;
let dartsPaused = false;
let dartsTimeouts = [];

function startDartsTimeout(task) {
  task.startedAt = performance.now();

  task.id = setTimeout(() => {
    task.id = null;

    dartsTimeouts = dartsTimeouts.filter(
      (currentTask) => currentTask !== task,
    );

    task.callback();
  }, task.remaining);
}

function addDartsTimeout(callback, delay) {
  const task = {
    callback,
    remaining: delay,
    startedAt: 0,
    id: null,
  };

  dartsTimeouts.push(task);
  startDartsTimeout(task);
}

function clearDartsTimeouts() {
  dartsTimeouts.forEach((task) => {
    if (task.id !== null) {
      clearTimeout(task.id);
    }
  });

  dartsTimeouts = [];
}

export function pauseDartsGame() {
  if (dartsPaused) return;

  dartsPaused = true;

  const pauseTime = performance.now();

  dartsTimeouts.forEach((task) => {
    if (task.id === null) return;

    clearTimeout(task.id);

    task.remaining = Math.max(
      0,
      task.remaining -
        (pauseTime - task.startedAt),
    );

    task.id = null;
  });
}

export function resumeDartsGame() {
  if (!dartsPaused) return;

  dartsPaused = false;

  dartsTimeouts.forEach((task) => {
    if (task.id === null) {
      startDartsTimeout(task);
    }
  });
}

/* -------------------------------------------------------- */
/* HELPERS DOM                                              */
/* -------------------------------------------------------- */

function getDartsOverlay() {
  return document.getElementById("darts-overlay");
}
function getDartsGauge() {
  return document.getElementById("darts-gauge-container");
}
function getDartsNotif() {
  return document.getElementById("darts-notif");
}
function getDartsCursor() {
  return document.getElementById("darts-cursor");
}

function showDartsNotif(msg, color = "white", isScore = false) {
  const el = getDartsNotif();
  if (!el) return;

  if (isScore) {
    el.innerHTML = msg;
  } else {
    el.textContent = msg;
  }

  el.style.color = color;
  el.classList.add("visible");
}

function updateScoreDisplay() {
  const pts = document.getElementById("score-points");
  const trns = document.getElementById("score-turns");
  if (pts) pts.textContent = dartsScore;
  if (trns) trns.textContent = dartsTurn;
}

/* -------------------------------------------------------- */
/* RESET                                                    */
/* -------------------------------------------------------- */

export function resetDartsGame() {
  dartsPaused = false;
clearDartsTimeouts();
  dartsScore = 301;
  dartsTurn = 0;
  dartsThrow = 0;
  gaugeActive = false;
  isGameActive = false;
  currentZone = null;

  stopGaugeAnim();

  const overlay = getDartsOverlay();
  if (overlay) {
    overlay.classList.remove("active");
    overlay.removeEventListener("click", onDartsClick);
    overlay.removeEventListener("click", validateShot);
  }

  const gauge = getDartsGauge();
  if (gauge) gauge.classList.remove("visible");

  const cursor = getDartsCursor();
  if (cursor) cursor.style.top = "0px";

  const stabbed = document.querySelector(".effet-dart-stabbed");
  if (stabbed) stabbed.style.opacity = "0";

  const notif = getDartsNotif();
  if (notif) notif.classList.remove("visible");

  const winMsg = document.getElementById("darts-win-message");
  if (winMsg) winMsg.classList.remove("show");

  const dartsImage = document.querySelector(".darts-image");
  if (dartsImage) dartsImage.style.opacity = "1";

  const timer = document.getElementById("timer-value");

if (timer) {
  timer.textContent = "00:00";
}

  updateScoreDisplay();
}

/* -------------------------------------------------------- */
/* DÉTECTION ZONE                                           */
/* -------------------------------------------------------- */

function detectDartZone(e) {
  const overlay = getDartsOverlay();
  if (!overlay) return null;

  const rect = overlay.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const radius = rect.width / 2;
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;
  const rNorm = Math.sqrt(dx * dx + dy * dy) / radius;

  if (rNorm > 1) return null;

  let ring = null;
  for (const z of DART_ZONES) {
    if (rNorm >= z.rMin && rNorm < z.rMax) {
      ring = z;
      break;
    }
  }
  if (!ring) return null;

  const angle = ((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360;
  const sectionIdx = Math.floor(((angle + 9) % 360) / 18);
  const sectionVal = DART_SECTIONS[sectionIdx] || 20;

  let points = ring.points;
  if (ring.isMultiplier) points = sectionVal * ring.isMultiplier;
  else if (!ring.points) points = sectionVal;

  return {
    points,
    diff: ring.diff,
    name: ring.name,
    section: sectionVal,
    multiplier: ring.isMultiplier || 1,
  };
}

/* -------------------------------------------------------- */
/* JAUGE                                                    */
/* -------------------------------------------------------- */

export function stopGaugeAnim() {
  if (gaugeAnimId) {
    cancelAnimationFrame(gaugeAnimId);
    gaugeAnimId = null;
  }
}

function buildGauge(diff) {
  const cfg = GAUGE_CONFIG[diff] || GAUGE_CONFIG.easy;
  const gEl = document.getElementById("darts-gauge");
  if (!gEl) return;

  const total = 140;
  const green = Math.round(total * cfg.greenPct);
  const remain = total - green;
  const orange = Math.round(remain * 0.45);
  const red = remain - orange;
  const half = Math.round(red / 2);

  document.getElementById("darts-gauge-red-top").style.height = half + "px";
  document.getElementById("darts-gauge-orange-top").style.height =
    Math.round(orange / 2) + "px";
  document.getElementById("darts-gauge-green").style.height = green + "px";
  document.getElementById("darts-gauge-orange-bottom").style.height =
    Math.round(orange / 2) + "px";
  document.getElementById("darts-gauge-red-bottom").style.height =
    red - half + "px";
}

function startGaugeAnim(diff) {
  stopGaugeAnim();
  const cfg = GAUGE_CONFIG[diff] || GAUGE_CONFIG.easy;
  const cursor = getDartsCursor();
  if (!cursor) return;

  let pos = 0,
    dir = 1;
  const speed = cfg.speed;

  function loop() {
    if (dartsPaused) {
  gaugeAnimId = requestAnimationFrame(loop);
  return;
}
    pos += dir * speed;
    if (pos >= 136) {
      pos = 136;
      dir = -1;
    }
    if (pos <= 0) {
      pos = 0;
      dir = 1;
    }
    cursor.style.top = pos + "px";
    gaugeAnimId = requestAnimationFrame(loop);
  }
  loop();
}

function getGaugeResult(diff) {
  const cursor = getDartsCursor();
  if (!cursor) return "green";

  const cursorTop = parseFloat(cursor.style.top) || 0;
  const cfg = GAUGE_CONFIG[diff] || GAUGE_CONFIG.easy;
  const total = 140;
  const green = total * cfg.greenPct;
  const remain = total - green;
  const orange = remain * 0.45;
  const red = remain - orange;
  const halfRed = red / 2;

  const z1 = halfRed;
  const z2 = halfRed + orange / 2;
  const z3 = halfRed + orange / 2 + green;
  const z4 = halfRed + orange / 2 + green + orange / 2;

  if (cursorTop < z1) return "red";
  if (cursorTop < z2) return "orange";
  if (cursorTop < z3) return "green";
  if (cursorTop < z4) return "orange";
  return "red";
}

/* -------------------------------------------------------- */
/* VICTOIRE                                                 */
/* -------------------------------------------------------- */

export function dartsWin(ctx) {
  isGameActive = false;
  ctx.stopTimer();

  const overlay = getDartsOverlay();
  if (overlay) {
    overlay.classList.remove("active");
    overlay.removeEventListener("click", onDartsClick);
    overlay.removeEventListener("click", validateShot);
  }

  const dartsImage = document.querySelector(".darts-image");
  if (dartsImage) dartsImage.style.opacity = "0";

  const timerVal = document.getElementById("timer-value");
  const winTime = document.getElementById("win-time");
  const winTurns = document.getElementById("win-turns");
  const winPlayer = document.getElementById("win-player");
  const recordEl = document.getElementById("win-record");
  const player = window.SMQ_RETRAITES[ctx.getCurrentIndex()];

  if (winPlayer && player) winPlayer.textContent = player.nom;
  if (timerVal && winTime) winTime.textContent = timerVal.textContent;
  if (winTurns) winTurns.textContent = dartsTurn;

  document
    .querySelectorAll(".win-title, .win-label, .win-value")
    .forEach((el) => el.classList.remove("show"));
  if (recordEl) {
    recordEl.classList.remove("show", "blink");
    recordEl.style.animation = "";
  }

  const currentTime = timerVal ? timerVal.textContent : null;
  let isNewRecord = false;

  function timeToSeconds(t) {
    if (!t) return 999999;
    const parts = t.split(":");
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  if (currentTime) {
    const oldTime = localStorage.getItem("darts_best_time");
    const currentSec = timeToSeconds(currentTime);
    const oldSec = timeToSeconds(oldTime);

    if (!oldTime || currentSec < oldSec) {
      if (player) localStorage.setItem("darts_best_player", player.nom);
      localStorage.setItem("darts_best_time", currentTime);
      isNewRecord = true;
    }
  }

  const winMsg = document.getElementById("darts-win-message");
  if (winMsg) winMsg.classList.add("show");

  const title = document.querySelector(".win-title");
  const labels = document.querySelectorAll(".win-label");

  addDartsTimeout(() => {
    if (title) title.classList.add("show");
  }, 1000);
  addDartsTimeout(() => {
    if (title) title.style.animation = "winTitleFade 1.5s forwards";
  }, 4000);
  addDartsTimeout(() => {
    labels.forEach((l) => l.classList.add("show"));
  }, 4000);
  addDartsTimeout(() => {
    if (winPlayer) winPlayer.classList.add("show");
  }, 4500);
  addDartsTimeout(() => {
    if (winTime) winTime.classList.add("show");
  }, 4600);
  addDartsTimeout(() => {
    if (winTurns) winTurns.classList.add("show");
  }, 4700);

  addDartsTimeout(() => {
    if (isNewRecord && recordEl) {
      recordEl.textContent = "Nouveau Record !";
      recordEl.classList.remove("show", "blink");
      recordEl.style.opacity = "0";
      recordEl.style.transform = "translateX(40px)";
      void recordEl.offsetWidth;
      recordEl.classList.add("show");
      addDartsTimeout(() => recordEl.classList.add("blink"), 500);
    }
  }, 4000);
}

/* -------------------------------------------------------- */
/* LANCER                                                   */
/* -------------------------------------------------------- */

function throwDart(zone, ctx) {

  const gaugeResult = getGaugeResult(zone.diff);
  stopGaugeAnim();

  const gauge = getDartsGauge();
  const overlay = getDartsOverlay();
  if (gauge) gauge.classList.remove("visible");
  if (overlay) overlay.classList.remove("active");

  const notif = getDartsNotif();
  if (notif) notif.classList.remove("visible");

  let pts = 0,
    msg = "",
    color = "#00f9a6";

  if (gaugeResult === "green") {
    pts = zone.points;

    msg = `
  <span class="darts-notif-score">${pts} pts</span>
  <span class="darts-notif-separator">&nbsp;</span>
  <span class="darts-notif-result">
    ${zone.name}${zone.multiplier > 1 ? " x" + zone.multiplier : ""}
  </span>
`;

    color = "white";
  } else if (gaugeResult === "orange") {
    pts = Math.floor(zone.points / 2);

    msg = `
    <span class="darts-notif-score">${pts} pts</span>
    <span class="darts-notif-separator"></span>
    <span class="darts-notif-negative">Raté de peu...</span>
  `;

    color = "white";
  } else {
    pts = 0;

    msg = `
    <span class="darts-notif-score">0 pts</span>
    <span class="darts-notif-separator"></span>
    <span class="darts-notif-negative darts-notif-normal">
  Complètement raté
</span>
  `;

    color = "white";
  }

  const newScore = dartsScore - pts;

if (newScore === 0) {
  fadeOutDartsMusic();

  addDartsTimeout(() => {
    playDartsWinSfx();
  }, 500);

} else if (newScore < 0) {

  addDartsTimeout(() => {
    playDartsBadShotSfx();
  }, 500);

} else if (gaugeResult === "green") {

  addDartsTimeout(() => {
    playDartsGoodShotSfx();
  }, 500);

} else {

  addDartsTimeout(() => {
    playDartsBadShotSfx();
  }, 500);
}

  if (newScore < 0) {
    showDartsNotif("BUST / Tour annulé", "#ff2222");
  } else if (newScore === 0) {
    dartsScore = 0;
    dartsTurn++;

    updateScoreDisplay();

    ctx.stopTimer();

    const timerVal = document.getElementById("timer-value");

    const finalTime = timerVal ? timerVal.textContent : "00:00";

    const player = window.SMQ_RETRAITES?.[ctx.getCurrentIndex()];
    const oldRecord = localStorage.getItem("darts_best_time");

    function timeToSeconds(time) {
      if (!time) return Infinity;

      const [minutes, seconds] = time.split(":").map(Number);

      return minutes * 60 + seconds;
    }

    const isNewRecord =
      !oldRecord || timeToSeconds(finalTime) < timeToSeconds(oldRecord);

    showDartsNotif(
      `
    <span class="darts-notif-win-label">Retraité :</span>

    <span class="darts-notif-win-player">
      ${player?.nom || ""}
    </span>

    <span class="darts-notif-win-separator">/</span>

    <span class="darts-notif-win-label">Temps :</span>

    <span class="darts-notif-win-time">
      ${finalTime}
    </span>

${isNewRecord ? '<span class="darts-notif-record">Nouveau Record !</span>' : ""}
  `,
      "white",
      true,
    );

    isGameActive = false;

    addDartsTimeout(() => {
      dartsWin(ctx);
    }, 1000);

    return;
  } else {
    dartsScore = newScore;
    showDartsNotif(msg, color, true);
  }

  dartsThrow++;
  if (dartsThrow >= 3) {
    dartsThrow = 0;
    dartsTurn++;
  }
  updateScoreDisplay();

  addDartsTimeout(() => {
    if (isGameActive && overlay) overlay.classList.add("active");
  }, 1000);
}

/* -------------------------------------------------------- */
/* CLICS CIBLE                                              */
/* -------------------------------------------------------- */

export function onDartsClick(e, ctx) {
  if (dartsPaused) return;
  const notif = getDartsNotif();
  if (notif) notif.classList.remove("visible");
  if (!isGameActive) return;
  if (gaugeActive) return;

  const zone = detectDartZone(e);
  const overlay = getDartsOverlay();

  if (!zone) {
    playDartsBadShotSfx();
    showDartsNotif("Hors cible !", "#ff2222");
    dartsThrow++;
    if (dartsThrow >= 3) {
      dartsThrow = 0;
      dartsTurn++;
    }
    updateScoreDisplay();
    return;
  }

  if (overlay)
    overlay.removeEventListener("click", (e) => onDartsClick(e, ctx));

  currentZone = zone;
  buildGauge(zone.diff);
  startGaugeAnim(zone.diff);
  const gauge = getDartsGauge();
  if (gauge) gauge.classList.add("visible");

  addDartsTimeout(() => {
    gaugeActive = true;
    if (overlay) {
      overlay.addEventListener("click", (e) => validateShot(e, ctx), {
        once: true,
      });
    }
  }, 200);
}

export function validateShot(e, ctx) {
  if (dartsPaused) return;
  if (!gaugeActive) return;
  gaugeActive = false;
  playDartsThrowSfx();
  throwDart(currentZone, ctx);

  const overlay = getDartsOverlay();
  addDartsTimeout(() => {
    if (isGameActive && overlay) {
      overlay.addEventListener("click", (e) => onDartsClick(e, ctx));
    }
  }, 1000);
}

/* -------------------------------------------------------- */
/* START DARTS (appelé depuis MallSystem startGame)        */
/* -------------------------------------------------------- */

export function startDartsGame(ctx) {
  resetDartsGame();
  updateScoreDisplay();

  const dartsImage = document.querySelector(".darts-image");

  if (dartsImage) {
    dartsImage.style.opacity = "1";
  }

  ctx.startTimer();

  isGameActive = true;

  const overlay = getDartsOverlay();

  if (overlay) {
    overlay.classList.add("active");

    overlay.addEventListener("click", (e) => onDartsClick(e, ctx));
  }

  showDartsNotif("Ciblez et cliquez pour lancer votre flèche.", "white");
}
