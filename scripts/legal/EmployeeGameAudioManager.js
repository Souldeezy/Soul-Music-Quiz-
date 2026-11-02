/* VOLUMES — VALEURS DE 0 A 1................................................................................................. */

export const EMPLOYEE_AUDIO_VOLUMES = {
  // MUSIQUES
  MUSIC_INTRO: 0.25,
  MUSIC_GAME: 0.15,

  // SFX
  BUTTON_NEW_GAME: 0.4,
  BUTTON_ENTER_AFTER_NAME: 0.4,
  WRITE_NAME: 0.2,
  CHOOSE_MENU: 0.3,
  LUNCH_MENU_VALIDATE: 0.2,
  LUNCH_PASS: 0.2,
  HUNGRY_LUNCH_BREAK: 0.1,
  LUNCH_BOY_ARRIVED: 0.35,
  LUNCH_DRUNK: 0.35,
  LUNCH_EAT: 0.2,
  LUNCH_GOOD: 0.1,
  CREDIT_MONEY: 0.5,
  PILE_DONE: 0.1,
  PILE_TAKEN: 0.1,
  RENDEMENT_BAD: 0.35,
  RENDEMENT_GOOD: 0.35,
  LEVEL_UP: 0.4,
  WARNING: 0.2,
  FIRED: 0.4,
  RETIREE: 0.1,
};


/* DELAIS — MILLISECONDES..................................................................................................... */

export const EMPLOYEE_AUDIO_TIMING = {
  SFX_GAP: 500,
  MUSIC_FADE_IN: 1200,
  MUSIC_FADE_OUT: 800,
};


/* CHEMINS MUSIQUES........................................................................................................... */

const MUSIC_PATHS = {
  MUSIC_INTRO:
    "/sounds/legal/banner-top-employee-game/employee-game/music/music-intro.mp3",

  MUSIC_GAME:
    "/sounds/legal/banner-top-employee-game/employee-game/music/music-game.mp3",
};


/* CHEMINS SFX................................................................................................................ */

const SFX_DIRECTORY =
  "/sounds/legal/banner-top-employee-game/employee-game/sfx/";

const SFX_PATHS = {
  BUTTON_NEW_GAME: `${SFX_DIRECTORY}button-new-game.mp3`,
  BUTTON_ENTER_AFTER_NAME: `${SFX_DIRECTORY}button-enter-after-name.mp3`,
  WRITE_NAME: `${SFX_DIRECTORY}write-name.mp3`,
  CHOOSE_MENU: `${SFX_DIRECTORY}choose-menu.mp3`,
  LUNCH_MENU_VALIDATE: `${SFX_DIRECTORY}lunch-menu-validate.mp3`,
  LUNCH_PASS: `${SFX_DIRECTORY}lunch-pass.mp3`,
  HUNGRY_LUNCH_BREAK: `${SFX_DIRECTORY}hungry-lunch-break.mp3`,
  LUNCH_BOY_ARRIVED: `${SFX_DIRECTORY}lunch-boy-arrived.mp3`,
  LUNCH_DRUNK: `${SFX_DIRECTORY}lunch-drunk.mp3`,
  LUNCH_EAT: `${SFX_DIRECTORY}lunch-eat.mp3`,
  LUNCH_GOOD: `${SFX_DIRECTORY}lunch-good.mp3`,
  CREDIT_MONEY: `${SFX_DIRECTORY}credit-money.mp3`,
  PILE_DONE: `${SFX_DIRECTORY}pile-done.mp3`,
  PILE_TAKEN: `${SFX_DIRECTORY}pile-taken.mp3`,
  RENDEMENT_BAD: `${SFX_DIRECTORY}rendement-bad.mp3`,
  RENDEMENT_GOOD: `${SFX_DIRECTORY}rendement-good.mp3`,
  LEVEL_UP: `${SFX_DIRECTORY}level-up.mp3`,
  WARNING: `${SFX_DIRECTORY}warning.mp3`,
  FIRED: `${SFX_DIRECTORY}fired.mp3`,
  RETIREE: `${SFX_DIRECTORY}retiree.mp3`,
};


/* SFX — ETAT................................................................................................................ */

const employeeSfxQueue = [];

let employeeSfxCurrent = null;
let employeeSfxPaused = false;
let employeeSfxGapTimer = null;
let employeeSfxGapRemaining = 0;
let employeeSfxGapStartedAt = 0;
let employeeSfxPlayVersion = 0;

function getEmployeeAudioVolume(key) {
  const volume = Number(EMPLOYEE_AUDIO_VOLUMES[key]);

  return Number.isFinite(volume)
    ? Math.min(1, Math.max(0, volume))
    : 0;
}


/* SFX — LECTURE ET ENCHAINEMENT.............................................................................................. */

function finishEmployeeSfx(audio) {
  if (employeeSfxCurrent !== audio) return;

  employeeSfxPlayVersion++;

  audio.onended = null;
  audio.onerror = null;
  audio.pause();

  employeeSfxCurrent = null;
  employeeSfxGapRemaining =
  audio.src.endsWith(SFX_PATHS.WRITE_NAME)
    ? 0
    : EMPLOYEE_AUDIO_TIMING.SFX_GAP;

  scheduleEmployeeSfxGap();
}

function playCurrentEmployeeSfx(audio) {
  const version = ++employeeSfxPlayVersion;

  audio.play().catch((error) => {
    if (
      employeeSfxCurrent !== audio ||
      employeeSfxPaused ||
      version !== employeeSfxPlayVersion
    ) {
      return;
    }

    console.warn(
      "Lecture SFX Employee Game impossible :",
      audio.src,
      error,
    );

    finishEmployeeSfx(audio);
  });
}

function processEmployeeSfxQueue() {
  if (
    employeeSfxPaused ||
    employeeSfxCurrent ||
    employeeSfxGapTimer !== null ||
    employeeSfxGapRemaining > 0 ||
    employeeSfxQueue.length === 0
  ) {
    return;
  }

  const key = employeeSfxQueue.shift();
  const audio = new Audio(SFX_PATHS[key]);

  audio.volume = getEmployeeAudioVolume(key);
  audio.loop = false;

  employeeSfxCurrent = audio;

  audio.onended = () => finishEmployeeSfx(audio);
  audio.onerror = () => finishEmployeeSfx(audio);

  playCurrentEmployeeSfx(audio);
}

function scheduleEmployeeSfxGap() {
  if (employeeSfxPaused || employeeSfxGapTimer !== null) {
    return;
  }

  if (employeeSfxGapRemaining <= 0) {
    processEmployeeSfxQueue();
    return;
  }

  employeeSfxGapStartedAt = performance.now();

  employeeSfxGapTimer = window.setTimeout(() => {
    employeeSfxGapTimer = null;
    employeeSfxGapRemaining = 0;

    processEmployeeSfxQueue();
  }, employeeSfxGapRemaining);
}

export function playEmployeeSfx(...keys) {
  if (typeof window === "undefined") return false;

  if (keys.length === 1 && keys[0] === "WRITE_NAME") {
    if (employeeSfxPaused) return false;

    const audio = employeeSfxCurrent;

    if (audio) {
      if (!audio.src.endsWith(SFX_PATHS.WRITE_NAME)) {
        return false;
      }

      employeeSfxPlayVersion++;
      audio.pause();
      audio.currentTime = 0;
      playCurrentEmployeeSfx(audio);

      return true;
    }

    // Une frappe ne doit jamais attendre dans la file.
    if (
      employeeSfxGapTimer !== null ||
      employeeSfxGapRemaining > 0 ||
      employeeSfxQueue.length > 0
    ) {
      return false;
    }

    employeeSfxQueue.push("WRITE_NAME");
    processEmployeeSfxQueue();

    return true;
  }

  const validKeys = keys.filter(
    (key) => typeof SFX_PATHS[key] === "string",
  );

  if (validKeys.length === 0) return false;

  employeeSfxQueue.push(...validKeys);
  processEmployeeSfxQueue();

  return true;
}


/* SFX — PAUSE ET REPRISE..................................................................................................... */

export function pauseEmployeeSfx() {
  if (employeeSfxPaused) return;

  employeeSfxPaused = true;
  employeeSfxPlayVersion++;

  if (employeeSfxGapTimer !== null) {
    window.clearTimeout(employeeSfxGapTimer);
    employeeSfxGapTimer = null;

    employeeSfxGapRemaining = Math.max(
      0,
      employeeSfxGapRemaining -
        (performance.now() - employeeSfxGapStartedAt),
    );
  }

  employeeSfxCurrent?.pause();
}

export function resumeEmployeeSfx() {
  if (!employeeSfxPaused) return;

  employeeSfxPaused = false;

  if (employeeSfxCurrent) {
    if (employeeSfxCurrent.ended) {
      finishEmployeeSfx(employeeSfxCurrent);
    } else {
      playCurrentEmployeeSfx(employeeSfxCurrent);
    }

    return;
  }

  scheduleEmployeeSfxGap();
}


/* SFX — RESET............................................................................................................... */

export function resetEmployeeSfx() {
  employeeSfxPlayVersion++;

  if (employeeSfxGapTimer !== null) {
    window.clearTimeout(employeeSfxGapTimer);
  }

  employeeSfxGapTimer = null;
  employeeSfxGapRemaining = 0;
  employeeSfxGapStartedAt = 0;
  employeeSfxQueue.length = 0;
  employeeSfxPaused = false;

  const audio = employeeSfxCurrent;
  employeeSfxCurrent = null;

  if (audio) {
    audio.onended = null;
    audio.onerror = null;
    audio.pause();

    try {
      audio.currentTime = 0;
    } catch {
      // Le fichier peut ne pas être encore chargé.
    }
  }
}

/* MUSIQUES — ETAT............................................................................................................ */

let employeeMusicCurrent = null;
let employeeMusicRequested = null;
let employeeMusicPaused = false;
let employeeMusicFrame = null;
let employeeMusicLastTime = null;
let employeeMusicPlayVersion = 0;

/* MUSIQUES — NETTOYAGE....................................................................................................... */

function cancelEmployeeMusicFrame() {
  if (employeeMusicFrame !== null) {
    window.cancelAnimationFrame(employeeMusicFrame);
  }

  employeeMusicFrame = null;
  employeeMusicLastTime = null;
}

function releaseEmployeeMusic() {
  cancelEmployeeMusicFrame();
  employeeMusicPlayVersion++;

  const current = employeeMusicCurrent;
  employeeMusicCurrent = null;

  if (!current) return;

  current.audio.onerror = null;
  current.audio.pause();

  try {
    current.audio.currentTime = 0;
  } catch {
    // Le fichier peut ne pas être encore chargé.
  }
}

/* MUSIQUES — FONDUS.......................................................................................................... */

function setEmployeeMusicFade(target, duration) {
  const current = employeeMusicCurrent;

  if (!current) return;

  current.fade = {
    from: current.audio.volume,
    to: target,
    elapsed: 0,
    duration: Math.max(0, Number(duration) || 0),
  };

  employeeMusicLastTime = null;
  scheduleEmployeeMusicFrame();
}

function scheduleEmployeeMusicFrame() {
  const current = employeeMusicCurrent;

  if (
    employeeMusicPaused ||
    !current ||
    !current.ready ||
    !current.fade ||
    employeeMusicFrame !== null
  ) {
    return;
  }

  employeeMusicFrame =
    window.requestAnimationFrame(updateEmployeeMusicFade);
}

function updateEmployeeMusicFade(now) {
  employeeMusicFrame = null;

  const current = employeeMusicCurrent;

  if (employeeMusicPaused || !current || !current.fade) {
    return;
  }

  const fade = current.fade;

  if (employeeMusicLastTime !== null) {
    fade.elapsed += now - employeeMusicLastTime;
  }

  employeeMusicLastTime = now;

  const progress =
    fade.duration === 0
      ? 1
      : Math.min(1, fade.elapsed / fade.duration);

  current.audio.volume =
    fade.from + (fade.to - fade.from) * progress;

  if (progress < 1) {
    scheduleEmployeeMusicFrame();
    return;
  }

  current.fade = null;
  employeeMusicLastTime = null;

  if (current.key !== employeeMusicRequested) {
    releaseEmployeeMusic();
    startRequestedEmployeeMusic();
  }
}

/* MUSIQUES — LECTURE......................................................................................................... */

function handleEmployeeMusicError(current, error) {
  if (employeeMusicCurrent !== current) return;

  console.warn(
    "Lecture musique Employee Game impossible :",
    current.audio.src,
    error,
  );

  if (employeeMusicRequested === current.key) {
    employeeMusicRequested = null;
  }

  releaseEmployeeMusic();
  startRequestedEmployeeMusic();
}

function playCurrentEmployeeMusic() {
  const current = employeeMusicCurrent;

  if (!current || employeeMusicPaused) return;

  const version = ++employeeMusicPlayVersion;

  current.ready = false;

  current.audio.play().then(() => {
    if (
      employeeMusicCurrent !== current ||
      employeeMusicPaused ||
      version !== employeeMusicPlayVersion
    ) {
      return;
    }

    current.ready = true;
    employeeMusicLastTime = null;
    scheduleEmployeeMusicFrame();
  }).catch((error) => {
    if (
      employeeMusicCurrent !== current ||
      employeeMusicPaused ||
      version !== employeeMusicPlayVersion
    ) {
      return;
    }

    handleEmployeeMusicError(current, error);
  });
}

function startRequestedEmployeeMusic() {
  if (
    employeeMusicPaused ||
    employeeMusicCurrent ||
    !employeeMusicRequested
  ) {
    return;
  }

  const key = employeeMusicRequested;
  const audio = new Audio(MUSIC_PATHS[key]);

  audio.loop = true;
  audio.volume = 0;

  const current = {
    key,
    audio,
    ready: false,
    fade: null,
  };

  employeeMusicCurrent = current;

  audio.onerror = () => {
    handleEmployeeMusicError(current, "Fichier audio inaccessible.");
  };

  setEmployeeMusicFade(
    getEmployeeAudioVolume(key),
    EMPLOYEE_AUDIO_TIMING.MUSIC_FADE_IN,
  );

  playCurrentEmployeeMusic();
}

/* MUSIQUES — CHANGEMENT...................................................................................................... */

export function playEmployeeMusic(key) {
  if (
    typeof window === "undefined" ||
    typeof MUSIC_PATHS[key] !== "string"
  ) {
    return false;
  }

  if (employeeMusicRequested === key) return true;

  employeeMusicRequested = key;

  const current = employeeMusicCurrent;

  if (!current) {
    startRequestedEmployeeMusic();
    return true;
  }

  if (current.key === key) {
    setEmployeeMusicFade(
      getEmployeeAudioVolume(key),
      EMPLOYEE_AUDIO_TIMING.MUSIC_FADE_IN,
    );
  } else {
    // La nouvelle musique attend la fin du fondu sortant.
    setEmployeeMusicFade(
      0,
      EMPLOYEE_AUDIO_TIMING.MUSIC_FADE_OUT,
    );
  }

  return true;
}

export function stopEmployeeMusic() {
  employeeMusicRequested = null;

  if (employeeMusicCurrent) {
    setEmployeeMusicFade(
      0,
      EMPLOYEE_AUDIO_TIMING.MUSIC_FADE_OUT,
    );
  }
}

/* MUSIQUES — PAUSE ET REPRISE................................................................................................. */

export function pauseEmployeeMusic() {
  if (employeeMusicPaused) return;

  employeeMusicPaused = true;
  employeeMusicPlayVersion++;

  cancelEmployeeMusicFrame();

  if (employeeMusicCurrent) {
    employeeMusicCurrent.ready = false;
    employeeMusicCurrent.audio.pause();
  }
}

export function resumeEmployeeMusic() {
  if (!employeeMusicPaused) return;

  employeeMusicPaused = false;

  if (employeeMusicCurrent) {
    playCurrentEmployeeMusic();
  } else {
    startRequestedEmployeeMusic();
  }
}

/* MUSIQUES — RESET........................................................................................................... */

export function resetEmployeeMusic() {
  employeeMusicRequested = null;
  employeeMusicPaused = false;

  releaseEmployeeMusic();
}

/* AUDIO COMPLET — PAUSE, REPRISE ET RESET.................................................................................... */

export function pauseEmployeeAudio() {
  pauseEmployeeSfx();
  pauseEmployeeMusic();
}

export function resumeEmployeeAudio() {
  resumeEmployeeSfx();
  resumeEmployeeMusic();
}

export function resetEmployeeAudio() {
  resetEmployeeSfx();
  resetEmployeeMusic();
}