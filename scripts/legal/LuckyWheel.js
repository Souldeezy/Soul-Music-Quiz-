/* VARIABLES.................................................................... */

let ctx = null;

let isSpinning = false;

let currentRotation = 0;
let spinTimeout = null;
let luckyWheelPaused = false;

const SECTOR_COUNT = 32;
const SECTOR_ANGLE = 360 / SECTOR_COUNT;

const SECTORS = [
  2, 0, 5, 10, 2, 0, 20, 5, 50, 0, 2, 10, 5, 2, 20, 0, 500, 0, 5, 2, 10, 0, 50,
  5, 2, 0, 20, 2, 5, 0, 2, 10,
];

/* TIMEOUT........................................................................ */

function startLuckyWheelTimeout(
  callback,
  delay,
) {
  spinTimeout = {
    callback,
    remaining: delay,
    startedAt: performance.now(),
    id: null,
  };

  spinTimeout.id = setTimeout(() => {
    const task = spinTimeout;

    spinTimeout = null;
    task?.callback();
  }, delay);
}

export function pauseLuckyWheel() {
  if (luckyWheelPaused) return;

  luckyWheelPaused = true;

  if (!spinTimeout || spinTimeout.id === null) {
    return;
  }

  clearTimeout(spinTimeout.id);

  spinTimeout.remaining = Math.max(
    0,
    spinTimeout.remaining -
      (performance.now() -
        spinTimeout.startedAt),
  );

  spinTimeout.id = null;
}

export function resumeLuckyWheel() {
  if (!luckyWheelPaused) return;

  luckyWheelPaused = false;

  if (!spinTimeout || spinTimeout.id !== null) {
    return;
  }

  const task = spinTimeout;

  task.startedAt = performance.now();

  task.id = setTimeout(() => {
    spinTimeout = null;
    task.callback();
  }, task.remaining);
}

/* INIT......................................................................... */

export function initLuckyWheel(context) {
  ctx = context;
}

/* SPIN......................................................................... */

export function spinLuckyWheel() {
  if (isSpinning || luckyWheelPaused) return;

  const wheel = document.getElementById("lw-wheel");

  if (!wheel) return;

  isSpinning = true;

  const targetIndex = Math.floor(Math.random() * SECTOR_COUNT);

  const sectorCenter = targetIndex * SECTOR_ANGLE + SECTOR_ANGLE / 2;

  const targetPosition = (360 - sectorCenter) % 360;

  const currentPosition = ((currentRotation % 360) + 360) % 360;

  let delta = targetPosition - currentPosition;

  if (delta < 0) {
    delta += 360;
  }

  const extraTurns = 12;

  const finalRotation = currentRotation + extraTurns * 360 + delta;

  wheel.style.transition = "transform 15s cubic-bezier(0.15, 0.7, 0.15, 1)";

  wheel.style.transform = `rotate(${finalRotation}deg)`;

  startLuckyWheelTimeout(() => {
    currentRotation = finalRotation;
    isSpinning = false;

    const gain = SECTORS[targetIndex];

    
    const notif = document.querySelector(".casino-lw-notifications");
    const newGameBtn = document.getElementById("lw-new-game-btn");

    /* RECORD */

if (gain > 0) {
  ctx?.registerCasinoRecord?.(
    "luckyWheel",
    gain,
  );
}

    /* JACKPOT................................................................... */

    if (gain === 500) {
      ctx?.playLwJackpotSfx?.();

ctx?.creditPlayerMoney?.(gain);

      if (notif) {
notif.innerHTML = `
  <span style="
    color: rgb(0, 249, 166);
    font-weight: bold;
  ">JACKPOT !</span>

  <span style="margin-left: 12px;">
    Vous gagnez
  </span>

<span style="
  font-family: 'Rock Salt', sans-serif;
  margin-left: 8px;
  color: rgb(0, 249, 166);
  font-size: 12px;
">${gain} $</span>
`;
      }
    } else if (gain > 0) {

    /* WIN....................................................................... */
      ctx?.playLwWinSfx?.();

ctx?.creditPlayerMoney?.(gain);

      if (notif) {
        notif.innerHTML = `
          Vous gagnez
          <span class="lw-notif-gain">${gain} $</span>
        `;
      }
    } else {

    /* LOSE...................................................................... */
      ctx?.playLwLoseSfx?.();

      if (notif) {
        notif.innerHTML = `
          <span class="lw-notif-lose">Perdu !</span>
          Aucun gain.
        `;
      }
    }

    /* NEW GAME.................................................................. */

    if (newGameBtn) {
      newGameBtn.disabled = false;
      newGameBtn.style.pointerEvents = "auto";
      newGameBtn.style.opacity = "1";
      newGameBtn.style.animation = "lwNewGameBlink 2s infinite";
    }
  }, 15000);
}

/* RESET........................................................................ */

export function resetLuckyWheel() {
if (spinTimeout?.id != null) {
  clearTimeout(spinTimeout.id);
}

spinTimeout = null;

spinTimeout = null;
luckyWheelPaused = false;
isSpinning = false;
  currentRotation = 0;

  const wheel = document.getElementById("lw-wheel");
  const notif = document.querySelector(".casino-lw-notifications");
  const newGameBtn = document.getElementById("lw-new-game-btn");
  const spinBtn = document.getElementById("lw-spin-btn");

  /* RESET WHEEL */

  if (wheel) {
    wheel.style.transition = "none";
    wheel.style.transform = "rotate(0deg)";

    void wheel.offsetWidth;

    wheel.style.transition = "";
  }

  /* RESET NOTIFICATION */

  if (notif) {
    notif.innerHTML = "";
  }

  /* RESET NEW GAME BUTTON */

  if (newGameBtn) {
    newGameBtn.classList.remove("blink");
    newGameBtn.style.pointerEvents = "none";
    newGameBtn.style.animation = "none";
  }

  /* RESET SPIN BUTTON */

  if (spinBtn) {
    spinBtn.disabled = true;
    spinBtn.style.pointerEvents = "none";
    spinBtn.style.animation = "none";
  }
}
