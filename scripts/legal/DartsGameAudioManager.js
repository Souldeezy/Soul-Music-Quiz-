/* DARTS AUDIO PATHS............................................................................................................... */

const DARTS_MUSIC_PATH =
  "/sounds/legal/banner-bottom-nyc-games/coney/darts-game/music/darts-music.mp3";

const DARTS_SFX_PATHS = {
  NEW_GAME:
    "/sounds/legal/banner-bottom-nyc-games/coney/darts-game/sfx/button-new-game.mp3",

  THROW:
    "/sounds/legal/banner-bottom-nyc-games/coney/darts-game/sfx/throw-darts.mp3",

  GOOD_SHOT:
    "/sounds/legal/banner-bottom-nyc-games/coney/darts-game/sfx/good-shot-darts.mp3",

  BAD_SHOT:
    "/sounds/legal/banner-bottom-nyc-games/coney/darts-game/sfx/bad-shot-darts.mp3",

  WIN:
    "/sounds/legal/banner-bottom-nyc-games/coney/darts-game/sfx/win-game.mp3",
};

/* AUDIO STATE..................................................................................................................... */

let dartsMusic = null;
let dartsMusicWasPlaying = false;
let dartsAudioPaused = false;
let dartsMusicPendingStart = false;
let dartsPendingTargetVolume = 0.18;

const activeSfx = new Set();
const pausedDartsSfx = new Set();

/* MUSIC........................................................................................................................... */

function getDartsMusic() {
  if (!dartsMusic) {
    dartsMusic = new Audio(DARTS_MUSIC_PATH);
    dartsMusic.loop = true;
    dartsMusic.volume = 0;
  }

  return dartsMusic;
}

export function fadeInDartsMusic(
  targetVolume = 0.18,
  duration = 1200,
) {
  const music = getDartsMusic();
  if (dartsAudioPaused) {
  dartsMusicPendingStart = true;
  dartsPendingTargetVolume = targetVolume;
  return;
}

  music.pause();
  music.currentTime = 0;
  music.volume = 0;

  music.play().catch(() => {});

  const steps = 25;
  const stepTime = duration / steps;

  let step = 0;

  const interval = setInterval(() => {
    step++;

    music.volume =
      targetVolume * (step / steps);

    if (step >= steps) {
      clearInterval(interval);
      music.volume = targetVolume;
    }
  }, stepTime);
}

export function fadeOutDartsMusic(duration = 700) {
  if (!dartsMusic || dartsMusic.paused) return;

  const music = dartsMusic;
  const startVolume = music.volume;

  const steps = 20;
  const stepTime = duration / steps;

  let step = 0;

  const interval = setInterval(() => {
    step++;

    music.volume =
      Math.max(0, startVolume * (1 - step / steps));

    if (step >= steps) {
      clearInterval(interval);

      music.pause();
      music.currentTime = 0;
      music.volume = 0;
    }
  }, stepTime);
}

/* SFX............................................................................................................................. */

function playDartsSfx(path, volume = 0.5) {
  const audio = new Audio(path);

  audio.volume = volume;

  activeSfx.add(audio);

  audio.addEventListener(
    "ended",
    () => {
      activeSfx.delete(audio);
    },
    { once: true },
  );

  audio.play().catch(() => {
    activeSfx.delete(audio);
  });
}

export function playDartsNewGameSfx() {
  playDartsSfx(DARTS_SFX_PATHS.NEW_GAME, 0.45);
}

export function playDartsThrowSfx() {
  playDartsSfx(DARTS_SFX_PATHS.THROW, 0.7);
}

export function playDartsGoodShotSfx() {
  playDartsSfx(DARTS_SFX_PATHS.GOOD_SHOT, 0.5);
}

export function playDartsBadShotSfx() {
  playDartsSfx(DARTS_SFX_PATHS.BAD_SHOT, 0.25);
}

export function playDartsWinSfx() {
  playDartsSfx(DARTS_SFX_PATHS.WIN, 0.6);
}

/* PAUSE / RESUME................................................................................................................... */

export function pauseDartsAudio() {
  if (dartsAudioPaused) return;

  dartsAudioPaused = true;

  dartsMusicWasPlaying =
    Boolean(dartsMusic) &&
    !dartsMusic.paused;

  if (dartsMusic) {
    dartsMusic.pause();
  }

activeSfx.forEach((audio) => {
  if (!audio.paused) {
    audio.pause();
    pausedDartsSfx.add(audio);
  }
});
}

export function resumeDartsAudio() {
  if (!dartsAudioPaused) return;

  dartsAudioPaused = false;
  pausedDartsSfx.forEach((audio) => {
  audio.play().catch(() => {
    activeSfx.delete(audio);
  });
});

pausedDartsSfx.clear();

  if (dartsMusicPendingStart) {
    const targetVolume =
      dartsPendingTargetVolume;

    dartsMusicPendingStart = false;
    fadeInDartsMusic(targetVolume);
    return;
  }

  if (!dartsMusicWasPlaying || !dartsMusic) {
    return;
  }

  dartsMusic.play().catch(() => {});

  dartsMusicWasPlaying = false;
}

/* RESET........................................................................................................................... */

export function resetDartsAudio() {
  dartsMusicWasPlaying = false;
dartsAudioPaused = false;
dartsMusicPendingStart = false;
dartsPendingTargetVolume = 0.18;
  if (dartsMusic) {
    dartsMusic.pause();
    dartsMusic.currentTime = 0;
    dartsMusic.volume = 0;
  }

  activeSfx.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });

  activeSfx.clear();
  pausedDartsSfx.clear();
}