/* MALL AUDIO PATHS............................................................................................................... */

const MALL_MUSIC_PATHS = {
  HUB: "/sounds/legal/banner-bottom-nyc-games/mall/common/music/mall-music.mp3",

  VINYLS:
    "/sounds/legal/banner-bottom-nyc-games/mall/vinyls/music/vinyls-music.mp3",

  BOOKS:
    "/sounds/legal/banner-bottom-nyc-games/mall/books/music/books-music.mp3",

  AUDIO:
    "/sounds/legal/banner-bottom-nyc-games/mall/audio-equipment/music/audio-equipment-music.mp3",

  FASHION:
    "/sounds/legal/banner-bottom-nyc-games/mall/fashion/music/fashion-music.mp3",
};

const MALL_SFX_PATHS = {
  ENTER_SHOP:
    "/sounds/legal/banner-bottom-nyc-games/mall/common/sfx/enter-mall-game.mp3",

  NEXT_PAGE:
    "/sounds/legal/banner-bottom-nyc-games/mall/common/sfx/next-page.mp3",

  RETURN_HUB:
    "/sounds/legal/banner-bottom-nyc-games/mall/common/sfx/return-mall-hub.mp3",

  SELECT_ITEM:
    "/sounds/legal/banner-bottom-nyc-games/mall/common/sfx/select-item.mp3",
};

/* VOLUMES......................................................................................................................... */

const MALL_MUSIC_VOLUMES = {
  HUB: 0.2,
  VINYLS: 0.1,
  BOOKS: 0.1,
  AUDIO: 0.1,
  FASHION: 0.1,
};

const MALL_SFX_VOLUMES = {
  ENTER_SHOP: 0.05,
  NEXT_PAGE: 0.1,
  RETURN_HUB: 0.3,
  SELECT_ITEM: 0.25,
};

/* AUDIO STATE..................................................................................................................... */

const musicTracks = new Map();
const activeSfx = new Set();
const pausedSfx = new Set();

let currentMusic = null;
let currentMusicKey = null;
let musicFadeInterval = null;
let musicWasPlaying = false;
let mallAudioPaused = false;

/* MUSIC HELPERS.................................................................................................................. */

function getMusic(musicKey) {
  if (musicTracks.has(musicKey)) {
    return musicTracks.get(musicKey);
  }

  const path = MALL_MUSIC_PATHS[musicKey];

  if (!path) return null;

  const audio = new Audio(path);

  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0;

  musicTracks.set(musicKey, audio);

  return audio;
}

function clearMusicFade() {
  if (musicFadeInterval) {
    clearInterval(musicFadeInterval);
    musicFadeInterval = null;
  }
}

function fadeMusic(audio, targetVolume, duration, onComplete) {
  clearMusicFade();

  const startVolume = audio.volume;
  const steps = 25;
  const stepTime = duration / steps;
  let currentStep = 0;

  musicFadeInterval = setInterval(() => {
    if (mallAudioPaused) return;

    currentStep++;

    const progress = currentStep / steps;

    audio.volume = startVolume + (targetVolume - startVolume) * progress;

    if (currentStep >= steps) {
      clearMusicFade();
      audio.volume = targetVolume;

      if (onComplete) {
        onComplete();
      }
    }
  }, stepTime);
}

/* MUSIC........................................................................................................................... */

function playMusic(musicKey, fadeInDuration = 1200) {
  const nextMusic = getMusic(musicKey);

  if (!nextMusic) return;

  if (currentMusic === nextMusic && currentMusicKey === musicKey) {
    if (!mallAudioPaused && nextMusic.paused) {
      nextMusic.play().catch(() => {});
    }

    return;
  }

  const startNextMusic = () => {
    currentMusic = nextMusic;
    currentMusicKey = musicKey;

    nextMusic.pause();
    nextMusic.currentTime = 0;
    nextMusic.volume = 0;

    if (mallAudioPaused) {
      musicWasPlaying = true;
      return;
    }

    nextMusic.play().catch(() => {});

    fadeMusic(nextMusic, MALL_MUSIC_VOLUMES[musicKey] ?? 0.2, fadeInDuration);
  };

  if (currentMusic && !currentMusic.paused) {
    const previousMusic = currentMusic;

    fadeMusic(previousMusic, 0, 700, () => {
      previousMusic.pause();
      previousMusic.currentTime = 0;
      startNextMusic();
    });

    return;
  }

  startNextMusic();
}

function stopMusic(duration = 700) {
  if (!currentMusic) return;

  const musicToStop = currentMusic;

  fadeMusic(musicToStop, 0, duration, () => {
    musicToStop.pause();
    musicToStop.currentTime = 0;
    musicToStop.volume = 0;

    if (currentMusic === musicToStop) {
      currentMusic = null;
      currentMusicKey = null;
    }
  });
}

/* SFX............................................................................................................................. */

function playSfx(sfxKey) {
  const path = MALL_SFX_PATHS[sfxKey];

  if (!path || mallAudioPaused) return;

  const audio = new Audio(path);

  audio.preload = "auto";
  audio.volume = MALL_SFX_VOLUMES[sfxKey] ?? 0.4;

  activeSfx.add(audio);

  const clearSfx = () => {
    activeSfx.delete(audio);
    pausedSfx.delete(audio);
  };

  audio.addEventListener("ended", clearSfx, { once: true });

  audio.play().catch(clearSfx);
}

/* PAUSE / RESUME................................................................................................................. */

function pauseAudio() {
  if (mallAudioPaused) return;

  mallAudioPaused = true;

  musicWasPlaying = Boolean(currentMusic) && !currentMusic.paused;

  if (currentMusic) {
    currentMusic.pause();
  }

  activeSfx.forEach((audio) => {
    if (!audio.paused) {
      audio.pause();
      pausedSfx.add(audio);
    }
  });
}

function resumeAudio() {
  if (!mallAudioPaused) return;

  mallAudioPaused = false;

  if (musicWasPlaying && currentMusic) {
    currentMusic.play().catch(() => {});
  }

  musicWasPlaying = false;

  pausedSfx.forEach((audio) => {
    audio.play().catch(() => {
      activeSfx.delete(audio);
    });
  });

  pausedSfx.clear();
}

/* RESET........................................................................................................................... */

function reset() {
  clearMusicFade();

  musicTracks.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 0;
  });

  activeSfx.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });

  activeSfx.clear();
  pausedSfx.clear();

  currentMusic = null;
  currentMusicKey = null;
  musicWasPlaying = false;
  mallAudioPaused = false;
}

/* EXPORT.......................................................................................................................... */

const MallAudioManager = {
  playHubMusic: () => playMusic("HUB"),
  playVinylsMusic: () => playMusic("VINYLS"),
  playBooksMusic: () => playMusic("BOOKS"),
  playAudioEquipmentMusic: () => playMusic("AUDIO"),
  playFashionMusic: () => playMusic("FASHION"),

  stopMusic,

  playEnterShopSfx: () => playSfx("ENTER_SHOP"),
  playNextPageSfx: () => playSfx("NEXT_PAGE"),
  playReturnHubSfx: () => playSfx("RETURN_HUB"),
  playSelectItemSfx: () => playSfx("SELECT_ITEM"),

  pauseAudio,
  resumeAudio,
  reset,
};

export default MallAudioManager;
