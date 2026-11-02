/* MEMORY AUDIO PATHS.............................................................................................................. */

/* MEMORY AUDIO PATHS.............................................................................................................. */

const MEMORY_MUSIC_PATH =
  "/sounds/legal/banner-bottom-nyc-games/coney/memory-game/music/memory-game.mp3";

const MEMORY_SFX_PATHS = {
  NEW_GAME:
    "/sounds/legal/banner-bottom-nyc-games/coney/memory-game/sfx/button-new-game.mp3",

  TURN_CARDS:
    "/sounds/legal/banner-bottom-nyc-games/coney/memory-game/sfx/turn-cards.mp3",

  PAIR_FOUND:
    "/sounds/legal/banner-bottom-nyc-games/coney/memory-game/sfx/pair-found.mp3",

  PAIR_WRONG:
    "/sounds/legal/banner-bottom-nyc-games/coney/memory-game/sfx/pair-wrong.mp3",

  WIN_GAME:
    "/sounds/legal/banner-bottom-nyc-games/coney/memory-game/sfx/win-game.mp3",

  GAME_OVER:
    "/sounds/legal/banner-bottom-nyc-games/coney/memory-game/sfx/game-over.mp3",
};

/* AUDIO STATE..................................................................................................................... */

let memoryMusic = null;
let memoryMusicFadeInterval = null;
let memoryMusicWasPlaying = false;

const activeSfx = new Set();
const pausedMemorySfx = new Set();

/* MUSIC........................................................................................................................... */

function getMemoryMusic() {
  if (!memoryMusic) {
    memoryMusic = new Audio(MEMORY_MUSIC_PATH);
    memoryMusic.loop = true;
    memoryMusic.volume = 0;
  }

  return memoryMusic;
}

function clearMemoryMusicFade() {
  if (memoryMusicFadeInterval) {
    clearInterval(memoryMusicFadeInterval);
    memoryMusicFadeInterval = null;
  }
}

export function fadeInMemoryMusic(targetVolume = 0.18, duration = 1200) {
  const music = getMemoryMusic();

  clearMemoryMusicFade();

  music.pause();
  music.currentTime = 0;
  music.volume = 0;

  music.play().catch(() => {});

  const steps = 25;
  const stepTime = duration / steps;

  let step = 0;

  memoryMusicFadeInterval = setInterval(() => {
    step++;

    music.volume = Math.min(targetVolume, targetVolume * (step / steps));

    if (step >= steps) {
      clearMemoryMusicFade();
      music.volume = targetVolume;
    }
  }, stepTime);
}

export function fadeOutMemoryMusic(duration = 700) {
  if (!memoryMusic || memoryMusic.paused) return;

  clearMemoryMusicFade();

  const music = memoryMusic;
  const startVolume = music.volume;

  const steps = 20;
  const stepTime = duration / steps;

  let step = 0;

  memoryMusicFadeInterval = setInterval(() => {
    step++;

    music.volume = Math.max(0, startVolume * (1 - step / steps));

    if (step >= steps) {
      clearMemoryMusicFade();

      music.pause();
      music.currentTime = 0;
      music.volume = 0;
    }
  }, stepTime);
}

/* SFX............................................................................................................................. */

function playMemorySfx(path, volume = 0.5) {
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

export function playMemoryNewGameSfx() {
  playMemorySfx(MEMORY_SFX_PATHS.NEW_GAME, 0.45);
}

export function playMemoryTurnCardsSfx() {
  playMemorySfx(MEMORY_SFX_PATHS.TURN_CARDS, 0.3);
}

export function playMemoryPairFoundSfx() {
  playMemorySfx(MEMORY_SFX_PATHS.PAIR_FOUND, 0.5);
}

export function playMemoryPairWrongSfx() {
  playMemorySfx(MEMORY_SFX_PATHS.PAIR_WRONG, 0.4);
}

export function playMemoryWinGameSfx() {
  playMemorySfx(MEMORY_SFX_PATHS.WIN_GAME, 0.6);
}

export function playMemoryGameOverSfx() {
  playMemorySfx(MEMORY_SFX_PATHS.GAME_OVER, 0.6);
}

/* PAUSE / RESUME................................................................................................................... */

export function pauseMemoryAudio() {
  memoryMusicWasPlaying = Boolean(memoryMusic) && !memoryMusic.paused;

  clearMemoryMusicFade();

  if (memoryMusic) {
    memoryMusic.pause();
  }

  activeSfx.forEach((audio) => {
    if (!audio.paused) {
      audio.pause();
      pausedMemorySfx.add(audio);
    }
  });
}

export function resumeMemoryAudio() {
  pausedMemorySfx.forEach((audio) => {
    audio.play().catch(() => {
      activeSfx.delete(audio);
    });
  });

  pausedMemorySfx.clear();
  if (!memoryMusicWasPlaying || !memoryMusic) {
    return;
  }

  memoryMusic.play().catch(() => {});

  memoryMusicWasPlaying = false;
}

/* RESET........................................................................................................................... */

export function resetMemoryAudio() {
  memoryMusicWasPlaying = false;

  clearMemoryMusicFade();

  if (memoryMusic) {
    memoryMusic.pause();
    memoryMusic.currentTime = 0;
    memoryMusic.volume = 0;
  }

  activeSfx.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });

  activeSfx.clear();
  pausedMemorySfx.clear();
}
