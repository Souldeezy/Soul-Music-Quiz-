/* VARIABLES.................................................................... */

let ctx = null;
let slotMachinePaused = false;
let slotMachineTimeouts = [];

const SYMBOLS = [
  "cherry",
  "lemon",
  "orange",
  "bell",
  "bar",
  "seven",
  "diamond",
];



const SYMBOL_HEIGHT = 130;

function goToSymbol(reel, index) {
  const strip = document.getElementById(`sm-strip-${reel}`);

  if (!strip) return;

  strip.style.transition = "transform 0.4s ease";
  strip.style.transform = `translateY(-${index * SYMBOL_HEIGHT}px)`;
}

/* TIMEOUTS....................................................................... */

function startSlotMachineTimeout(task) {
  task.startedAt = performance.now();

  task.id = setTimeout(() => {
    task.id = null;

    slotMachineTimeouts =
      slotMachineTimeouts.filter(
        (currentTask) => currentTask !== task,
      );

    task.callback();
  }, task.remaining);
}

function addSlotMachineTimeout(callback, delay) {
  const task = {
    callback,
    remaining: delay,
    startedAt: 0,
    id: null,
  };

  slotMachineTimeouts.push(task);
  startSlotMachineTimeout(task);
}

function clearSlotMachineTimeouts() {
  slotMachineTimeouts.forEach((task) => {
    if (task.id !== null) {
      clearTimeout(task.id);
    }
  });

  slotMachineTimeouts = [];
}

export function pauseSlotMachine() {
  if (slotMachinePaused) return;

  slotMachinePaused = true;

  const pauseTime = performance.now();

  slotMachineTimeouts.forEach((task) => {
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

export function resumeSlotMachine() {
  if (!slotMachinePaused) return;

  slotMachinePaused = false;

  slotMachineTimeouts.forEach((task) => {
    if (task.id === null) {
      startSlotMachineTimeout(task);
    }
  });
}

/* START GAME................................................................... */

function startNewGame() {
  goToSymbol(1, 0);
  goToSymbol(2, 0);
  goToSymbol(3, 0);
}



/* SPIN......................................................................... */

export function spinReels() {
  if (slotMachinePaused) return;
  const result1 = Math.floor(Math.random() * 7);
  const result2 = Math.floor(Math.random() * 7);
  const result3 = Math.floor(Math.random() * 7);

  goToSymbol(1, result1 + 7);

addSlotMachineTimeout(() => {
    goToSymbol(2, result2 + 7);
  }, 300);

addSlotMachineTimeout(() => {
    goToSymbol(3, result3 + 7);
  }, 600);

addSlotMachineTimeout(() => {
    const symbol1 = SYMBOLS[result1];
    const symbol2 = SYMBOLS[result2];
    const symbol3 = SYMBOLS[result3];

    checkResult(symbol1, symbol2, symbol3);
  }, 1200);
}


/* CHECK RESULT................................................................ */

function checkResult(result1, result2, result3) {
  const results = [result1, result2, result3];

  let combo = null;
  let gain = 0;

  if (results.every((symbol) => symbol === "diamond")) {
    combo = "3 Diamants";
    gain = 1000;
  } else if (results.every((symbol) => symbol === "seven")) {
    combo = "3 Sevens";
    gain = 500;
  } else if (results.every((symbol) => symbol === "bar")) {
    combo = "3 BAR";
    gain = 250;
  } else if (results.every((symbol) => symbol === "bell")) {
    combo = "3 Cloches";
    gain = 100;
  } else if (results.every((symbol) => symbol === "orange")) {
    combo = "3 Oranges";
    gain = 75;
  } else if (results.every((symbol) => symbol === "lemon")) {
    combo = "3 Citrons";
    gain = 50;
  } else if (results.every((symbol) => symbol === "cherry")) {
    combo = "3 Cerises";
    gain = 30;
  } else if (results.filter((symbol) => symbol === "diamond").length === 2) {
    combo = "2 Diamants";
    gain = 20;
  } else if (results.filter((symbol) => symbol === "seven").length === 2) {
    combo = "2 Sevens";
    gain = 10;
  }

  if (gain > 0) {
    showWin(combo, gain);
  } else {
    showLose();
  }
}

/* NOTIFICATIONS............................................................... */

function showWin(combo, gain) {
  ctx?.playSmWinSfx?.();

  ctx?.creditPlayerMoney?.(gain);

  ctx?.registerCasinoRecord?.("slotMachine", gain);

  const notif = document.querySelector(".casino-sm-notifications");

  if (!notif) return;

  notif.innerHTML = `
    <span class="sm-notif-combo">
      ${combo} !
    </span>

    Vous gagnez

    <span class="sm-notif-gain">
      ${gain} $
    </span>
  `;
}

function showLose() {
  ctx?.playSmLoseSfx?.();
  const notif = document.querySelector(".casino-sm-notifications");

  if (!notif) return;

  notif.innerHTML = `
    <span class="sm-notif-lose">Perdu !</span>
    Aucun combo gagnant.
  `;
}

/* INIT......................................................................... */

export function initSlotMachine(context) {
  ctx = context;
  startNewGame();
}

/* RESET........................................................................ */

export function resetSlotMachine() {
  slotMachinePaused = false;
  clearSlotMachineTimeouts();
}
