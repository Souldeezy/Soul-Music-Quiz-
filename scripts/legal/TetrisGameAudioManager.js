/* TETRIS AUDIO PATHS.............................................................................................................. */

const TETRIS_MUSIC_PATH =
  "/sounds/legal/banner-bottom-nyc-games/coney/tetris-game/music/tetris-music.mp3";

const TETRIS_SFX_PATHS = {
  NEW_GAME:
    "/sounds/legal/banner-bottom-nyc-games/coney/tetris-game/sfx/button-new-game.mp3",

  MOVE_ROTATE:
    "/sounds/legal/banner-bottom-nyc-games/coney/tetris-game/sfx/move-rotate.mp3",

  DROP: "/sounds/legal/banner-bottom-nyc-games/coney/tetris-game/sfx/drop.mp3",

  PIECE_LOCK:
    "/sounds/legal/banner-bottom-nyc-games/coney/tetris-game/sfx/piece-lock.mp3",

  LINE_CLEAR:
    "/sounds/legal/banner-bottom-nyc-games/coney/tetris-game/sfx/line-clear.mp3",

  TETRIS_CLEAR:
    "/sounds/legal/banner-bottom-nyc-games/coney/tetris-game/sfx/tetris-clear.mp3",

  LEVEL_UP:
    "/sounds/legal/banner-bottom-nyc-games/coney/tetris-game/sfx/level-up.mp3",

  GAME_OVER:
    "/sounds/legal/banner-bottom-nyc-games/coney/tetris-game/sfx/game-over.mp3",
};

/* AUDIO STATE..................................................................................................................... */

let tetrisMusic = null;
let tetrisMusicFadeInterval = null;
let tetrisMusicWasPlaying = false;

const activeSfx = new Set();
const pausedTetrisSfx = new Set();

/* MUSIC........................................................................................................................... */

function getTetrisMusic() {
  if (!tetrisMusic) {
    tetrisMusic = new Audio(TETRIS_MUSIC_PATH);
    tetrisMusic.loop = true;
    tetrisMusic.volume = 0;
  }

  return tetrisMusic;
}

function clearTetrisMusicFade() {
  if (tetrisMusicFadeInterval) {
    clearInterval(tetrisMusicFadeInterval);
    tetrisMusicFadeInterval = null;
  }
}

export function fadeInTetrisMusic(targetVolume = 0.1, duration = 1200) {
  const music = getTetrisMusic();

  clearTetrisMusicFade();

  music.pause();
  music.currentTime = 0;
  music.volume = 0;

  music.play().catch(() => {});

  const steps = 25;
  const stepTime = duration / steps;

  let step = 0;

  tetrisMusicFadeInterval = setInterval(() => {
    step++;

    music.volume = Math.min(targetVolume, targetVolume * (step / steps));

    if (step >= steps) {
      clearTetrisMusicFade();
      music.volume = targetVolume;
    }
  }, stepTime);
}

export function fadeOutTetrisMusic(duration = 700) {
  if (!tetrisMusic || tetrisMusic.paused) return;

  clearTetrisMusicFade();

  const music = tetrisMusic;
  const startVolume = music.volume;

  const steps = 20;
  const stepTime = duration / steps;

  let step = 0;

  tetrisMusicFadeInterval = setInterval(() => {
    step++;

    music.volume = Math.max(0, startVolume * (1 - step / steps));

    if (step >= steps) {
      clearTetrisMusicFade();

      music.pause();
      music.currentTime = 0;
      music.volume = 0;
    }
  }, stepTime);
}

/* SFX............................................................................................................................. */

function playTetrisSfx(path, volume = 0.5) {
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

export function playTetrisNewGameSfx() {
  playTetrisSfx(TETRIS_SFX_PATHS.NEW_GAME, 0.4);
}

export function playTetrisMoveRotateSfx() {
  playTetrisSfx(TETRIS_SFX_PATHS.MOVE_ROTATE, 0.1);
}

export function playTetrisDropSfx() {
  playTetrisSfx(TETRIS_SFX_PATHS.DROP, 0.15);
}

export function playTetrisPieceLockSfx() {
  playTetrisSfx(TETRIS_SFX_PATHS.PIECE_LOCK, 0.3);
}

export function playTetrisLineClearSfx() {
  playTetrisSfx(TETRIS_SFX_PATHS.LINE_CLEAR, 0.45);
}

export function playTetrisClearSfx() {
  playTetrisSfx(TETRIS_SFX_PATHS.TETRIS_CLEAR, 0.5);
}

export function playTetrisLevelUpSfx() {
  playTetrisSfx(TETRIS_SFX_PATHS.LEVEL_UP, 0.35);
}

export function playTetrisGameOverSfx() {
  playTetrisSfx(TETRIS_SFX_PATHS.GAME_OVER, 0.5);
}

/* PAUSE / RESUME................................................................................................................... */

export function pauseTetrisAudio() {
  tetrisMusicWasPlaying = Boolean(tetrisMusic) && !tetrisMusic.paused;

  clearTetrisMusicFade();

  if (tetrisMusic) {
    tetrisMusic.pause();
  }

  activeSfx.forEach((audio) => {
    if (!audio.paused) {
      audio.pause();
      pausedTetrisSfx.add(audio);
    }
  });
}

export function resumeTetrisAudio() {
  pausedTetrisSfx.forEach((audio) => {
    audio.play().catch(() => {
      activeSfx.delete(audio);
    });
  });

  pausedTetrisSfx.clear();
  if (!tetrisMusicWasPlaying || !tetrisMusic) {
    return;
  }

  tetrisMusic.play().catch(() => {});

  tetrisMusicWasPlaying = false;
}

/* RESET........................................................................................................................... */

export function resetTetrisAudio() {
  tetrisMusicWasPlaying = false;

  clearTetrisMusicFade();

  if (tetrisMusic) {
    tetrisMusic.pause();
    tetrisMusic.currentTime = 0;
    tetrisMusic.volume = 0;
  }

  activeSfx.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });

  activeSfx.clear();
  pausedTetrisSfx.clear();
}
