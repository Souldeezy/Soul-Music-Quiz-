/* MONEY AUDIO PATHS............................................................................................................... */

const MONEY_SFX_PATHS = {
  CREDIT:
    "/sounds/legal/banner-bottom-nyc-games/common/credit-money.mp3",

  DEBIT:
    "/sounds/legal/banner-bottom-nyc-games/common/debit-money.mp3",
};

/* AUDIO STATE..................................................................................................................... */

const activeMoneySfx = new Set();

/* HELPERS......................................................................................................................... */

function playMoneySfx(path, volume = 0.4) {
  const audio = new Audio(path);

  audio.volume = volume;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  const audioContext = new AudioContextClass();

  const source = audioContext.createMediaElementSource(audio);

  const stereoPanner = audioContext.createStereoPanner();

  /* -1 = gauche / 0 = centre / 1 = droite */

  stereoPanner.pan.value = -0.5;

  source.connect(stereoPanner);
  stereoPanner.connect(audioContext.destination);

  activeMoneySfx.add(audio);

  function cleanupMoneySfx() {
    activeMoneySfx.delete(audio);

    source.disconnect();
    stereoPanner.disconnect();

    audioContext.close().catch(() => {});
  }

  audio.addEventListener("ended", cleanupMoneySfx, { once: true });

  audioContext
    .resume()
    .then(() => {
      return audio.play();
    })
    .catch(() => {
      cleanupMoneySfx();
    });
}

function normalizeAmount(amount) {
  const parsedAmount = Number(amount);

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return null;
  }

  return parsedAmount;
}

function roundMoney(amount) {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/* SAVE MONEY....................................................................................................................... */

function saveRetireesMoney() {
  if (!window.SMQ_RETRAITES) return;

  localStorage.setItem("smq_retirees", JSON.stringify(window.SMQ_RETRAITES));
}

export function addRetiree(name, money) {
  const nom = String(name ?? "").trim();
  const argent = Number(money);

  if (!nom || !Number.isFinite(argent) || argent < 0) {
    return false;
  }

  if (!Array.isArray(window.SMQ_RETRAITES)) {
    window.SMQ_RETRAITES = [];
  }

  const retireeAlreadyExists = window.SMQ_RETRAITES.some(
    (retiree) => retiree.nom === nom,
  );

  if (retireeAlreadyExists) {
    return false;
  }

  window.SMQ_RETRAITES.push({
    nom,
    argent: roundMoney(argent),
  });

  saveRetireesMoney();

  window.dispatchEvent(new CustomEvent("smq:retirees-updated"));

  return true;
}

/* CHECK MONEY..................................................................................................................... */

export function canAfford(player, amount) {
  const validAmount = normalizeAmount(amount);

  if (!player || validAmount === null) {
    return false;
  }

  return player.argent >= validAmount;
}

/* CREDIT.......................................................................................................................... */

export function creditPlayerMoney(player, amount, updatePlayer) {
  const validAmount = normalizeAmount(amount);

  if (!player || validAmount === null) {
    return false;
  }

  player.argent = roundMoney(player.argent + validAmount);

  saveRetireesMoney();

  if (typeof updatePlayer === "function") {
    updatePlayer();
  }

  playMoneySfx(MONEY_SFX_PATHS.CREDIT, 0.4);

  return true;
}

/* DEBIT........................................................................................................................... */

export function debitPlayerMoney(player, amount, updatePlayer) {
  const validAmount = normalizeAmount(amount);

  if (!player || validAmount === null) {
    return false;
  }

  if (!canAfford(player, validAmount)) {
    return false;
  }

  player.argent = roundMoney(player.argent - validAmount);

  saveRetireesMoney();

  if (typeof updatePlayer === "function") {
    updatePlayer();
  }

  playMoneySfx(MONEY_SFX_PATHS.DEBIT, 0.4);

  return true;
}

/* RESET AUDIO..................................................................................................................... */

export function resetMoneyAudio() {
  activeMoneySfx.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });

  activeMoneySfx.clear();
}
