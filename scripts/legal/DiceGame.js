/* VARIABLES.................................................................... */

let ctx = null;

let isRolling = false;
let dicePaused = false;
let rollTimeouts = [];

const START_VALUES = [4, 2, 1];

/* INIT......................................................................... */

export function initDiceGame(context) {
  ctx = context;
}

/* HELPERS...................................................................... */

function startRollTimeout(task) {
  task.startedAt = performance.now();

  task.id = setTimeout(() => {
    task.id = null;

    rollTimeouts = rollTimeouts.filter(
      (currentTask) => currentTask !== task,
    );

    task.callback();
  }, task.remaining);
}

function clearRollTimeouts() {
  rollTimeouts.forEach((task) => {
    if (task.id !== null) {
      clearTimeout(task.id);
    }
  });

  rollTimeouts = [];
}

function addRollTimeout(callback, delay) {
  const task = {
    callback,
    remaining: delay,
    startedAt: 0,
    id: null,
  };

  rollTimeouts.push(task);
  startRollTimeout(task);
}

export function pauseDiceGame() {
  if (dicePaused) return;

  dicePaused = true;

  const pauseTime = performance.now();

  rollTimeouts.forEach((task) => {
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

export function resumeDiceGame() {
  if (!dicePaused) return;

  dicePaused = false;

  rollTimeouts.forEach((task) => {
    if (task.id === null) {
      startRollTimeout(task);
    }
  });
}

function getRandomDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function getDiceElements() {
  return [
    document.getElementById("dice-1"),
    document.getElementById("dice-2"),
    document.getElementById("dice-3"),
  ];
}

function setDieValue(die, value) {
  if (!die) return;

  die.src = `/images/legal/banner-bottom-nyc-games/casino/dice-game/die-${value}.png`;
  die.alt = `Dé ${value}`;
  die.dataset.value = value;
}

/* START NEW GAME............................................................... */

export function startDiceGame() {
  if (isRolling || dicePaused) return;

  clearRollTimeouts();

  const dice = getDiceElements();

  dice.forEach((die, index) => {
    if (!die) return;

    setDieValue(die, START_VALUES[index]);

    die.classList.remove("dice-hide");
    die.classList.remove("dice-show");
    die.classList.remove("visible");

    addRollTimeout(() => {
      die.classList.add("visible");
    }, index * 200);
  });

  const notif = document.querySelector(".casino-dice-notifications");

  if (notif) {
    notif.textContent = "Appuyez sur le bouton LANCER.";
  }
}

/* ROLL......................................................................... */

export function rollDice() {
  if (isRolling || dicePaused) return;

  const dice = getDiceElements();

  if (dice.some((die) => !die)) return;

  isRolling = true;

  clearRollTimeouts();

  const result1 = getRandomDie();
  const result2 = getRandomDie();
  const result3 = getRandomDie();

  const results = [result1, result2, result3];

  const notif = document.querySelector(".casino-dice-notifications");
  const newGameBtn = document.getElementById("dice-new-game-btn");
  const rollBtn = document.getElementById("dice-roll-btn");

  if (notif) {
    notif.textContent = "Les dés roulent...";
  }

  /* BLOCK BUTTONS.............................................................. */

  if (newGameBtn) {
    newGameBtn.disabled = true;
    newGameBtn.style.pointerEvents = "none";
    newGameBtn.style.animation = "none";
  }

  if (rollBtn) {
    rollBtn.disabled = true;
    rollBtn.style.pointerEvents = "none";
    rollBtn.style.animation = "none";
  }

  /* DICE DISAPPEAR............................................................ */

  addRollTimeout(() => {
    dice[0].classList.remove("visible");
    dice[0].classList.add("dice-hide");
  }, 0);

  addRollTimeout(() => {
    dice[1].classList.remove("visible");
    dice[1].classList.add("dice-hide");
  }, 200);

  addRollTimeout(() => {
    dice[2].classList.remove("visible");
    dice[2].classList.add("dice-hide");
  }, 400);

  /* DICE SOUND................................................................ */

  addRollTimeout(() => {
    ctx?.playDiceRollSfx?.();
  }, 600);

  /* DICE REAPPEAR............................................................. */

  addRollTimeout(() => {
    setDieValue(dice[0], result1);

    dice[0].classList.remove("dice-hide");
    dice[0].classList.remove("dice-show");

    void dice[0].offsetWidth;

    dice[0].classList.add("dice-show");
    dice[0].classList.add("visible");
  }, 6100);

  addRollTimeout(() => {
    setDieValue(dice[1], result2);

    dice[1].classList.remove("dice-hide");
    dice[1].classList.remove("dice-show");

    void dice[1].offsetWidth;

    dice[1].classList.add("dice-show");
    dice[1].classList.add("visible");
  }, 6350);

  addRollTimeout(() => {
    setDieValue(dice[2], result3);

    dice[2].classList.remove("dice-hide");
    dice[2].classList.remove("dice-show");

    void dice[2].offsetWidth;

    dice[2].classList.add("dice-show");
    dice[2].classList.add("visible");
  }, 6600);

  /* RESULT.................................................................... */

  addRollTimeout(() => {
    checkDiceResult(results);

    isRolling = false;

    if (newGameBtn) {
      newGameBtn.disabled = false;
      newGameBtn.style.pointerEvents = "auto";
      newGameBtn.style.opacity = "1";
      newGameBtn.style.animation = "diceNewGameBlink 2s infinite";
    }
  }, 6800);
}

/* CHECK RESULT................................................................ */

function checkDiceResult(results) {
  const sorted = [...results].sort((a, b) => a - b);

  let combo = "";
  let gain = 0;

  /* JACKPOT 6-6-6 */

  if (results.every((value) => value === 6)) {
    combo = "JACKPOT";
    gain = 500;
  } else if (sorted[0] === 1 && sorted[1] === 2 && sorted[2] === 4) {

  /* 4-2-1 */
    combo = "421";
    gain = 50;
  } else if (results[0] === results[1] && results[1] === results[2]) {

  /* OTHER TRIPLE */
    combo = "BRELAN";
    gain = 20;
  } else if (sorted[0] === 4 && sorted[1] === 5 && sorted[2] === 6) {

  /* 4-5-6 */
    combo = "GRANDE SUITE";
    gain = 10;
  } else if (sorted[0] === 1 && sorted[1] === 2 && sorted[2] === 3) {

  /* 1-2-3 */
    combo = "PETITE SUITE";
    gain = 5;
  } else if (

  /* PAIR */
    results[0] === results[1] ||
    results[0] === results[2] ||
    results[1] === results[2]
  ) {
    combo = "PAIRE";
    gain = 1;
  } else {

  /* LOSE */
    combo = "PERDU";
    gain = 0;
  }

  showDiceResult(combo, gain);
}

/* RESULT....................................................................... */

function showDiceResult(combo, gain) {
  const notif = document.querySelector(".casino-dice-notifications");

  /* RECORD */

  if (gain > 0) {
    ctx?.registerCasinoRecord?.("dice", gain);
  }

  /* JACKPOT */

  /* JACKPOT................................................................... */

  if (gain === 500) {
    ctx?.playDiceJackpotSfx?.();

    ctx?.creditPlayerMoney?.(gain);

    if (notif) {
      notif.innerHTML = `
        <span class="dice-notif-jackpot">JACKPOT !</span>
        Vous gagnez
        <span class="dice-notif-gain">${gain} $</span>
      `;
    }

    return;
  }

  /* WIN....................................................................... */

  if (gain > 0) {
    ctx?.playDiceWinSfx?.();

    ctx?.creditPlayerMoney?.(gain);

    if (notif) {
      notif.innerHTML = `
        <span class="dice-notif-win">${combo}</span>
        Vous gagnez
        <span class="dice-notif-gain">${gain} $</span>
      `;
    }

    return;
  }

  /* LOSE...................................................................... */

  ctx?.playDiceLoseSfx?.();

  if (notif) {
    notif.innerHTML = `
      <span class="dice-notif-lose">Perdu !</span>
      Aucun gain.
    `;
  }
}

/* RESET........................................................................ */

export function resetDiceGame() {
  dicePaused = false;
  clearRollTimeouts();

  isRolling = false;

  const dice = getDiceElements();

  dice.forEach((die, index) => {
    if (!die) return;

    setDieValue(die, START_VALUES[index]);

    die.classList.remove("visible");
    die.classList.remove("dice-hide");
    die.classList.remove("dice-show");

    die.style.animation = "none";
  });

  const notif = document.querySelector(".casino-dice-notifications");
  const newGameBtn = document.getElementById("dice-new-game-btn");
  const rollBtn = document.getElementById("dice-roll-btn");

  if (notif) {
    notif.innerHTML = "";
  }

  if (newGameBtn) {
    newGameBtn.disabled = true;
    newGameBtn.classList.remove("blink");
    newGameBtn.style.pointerEvents = "none";
    newGameBtn.style.animation = "none";
  }

  if (rollBtn) {
    rollBtn.disabled = true;
    rollBtn.style.pointerEvents = "none";
    rollBtn.style.animation = "none";
  }
}
