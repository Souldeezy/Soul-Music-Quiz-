/* MAZE GAME AUDIO MANAGER ....................................................................................................*/
/* ............................................................................................................................*/
/* ............................................................................................................................*/

/* MUSIC KEYS .................................................................................................................*/

export const MUSIC = {
  FLOOR_1: "floor-1",
  FLOOR_2: "floor-2",
  FLOOR_3: "floor-3",
  FLOOR_4: "floor-4",
  FLOOR_5: "floor-5",
  RECEPTION: "reception",
  LOUNGE: "lounge",
  BAR: "bar",
  RESTAURANT: "restaurant",
  LAUNDRY: "laundry",
  ROOM: "room",
  GOOD_EVENT: "good-event",
  BAD_EVENT: "bad-event",
};

/* SFX KEYS ...................................................................................................................*/

export const SFX = {
  SOUL_MOTEL_BEGIN: "soul-motel-begin",
  FOOTSTEPS_CORRIDOR: "footsteps-corridor",
  FOOTSTEPS_STAIRS: "footsteps-stairs",
  DOOR_OPEN: "door-open",
  DOOR_CLOSED: "door-closed",
  PICKUP_KEY: "pickup-key",
  PICKUP_ITEM: "pickup-item",
  TRAP_DOG: "trap-dog",
  TRAP_RAT: "trap-rat",
  TRAP_HOLE: "trap-hole",
  GOOD_EVENT: "good-event",
  BAD_EVENT: "bad-event",
  VICTORY: "victory",
  GAME_OVER: "game-over",
  CORRECT_CODE: "correct-code",
  WRONG_CODE: "wrong-code",
  STAIRS_OPEN: "stairs-open",
  PAGE_TURN: "page-turn",
  BIP_CODE: "bip-code",
  LADDER_CLIMB: "ladder-climb",
  LAUGH: "laugh",
};

/* MUSIC PATHS ................................................................................................................*/

const MUSIC_PATHS = {
  [MUSIC.FLOOR_1]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/floor-1.mp3",

  [MUSIC.FLOOR_2]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/floor-2.mp3",

  [MUSIC.FLOOR_3]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/floor-3.mp3",

  [MUSIC.FLOOR_4]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/floor-4.mp3",

  [MUSIC.FLOOR_5]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/floor-5.mp3",

  [MUSIC.RECEPTION]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/reception.mp3",

  [MUSIC.LOUNGE]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/lounge.mp3",

  [MUSIC.BAR]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/bar.mp3",

  [MUSIC.RESTAURANT]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/restaurant.mp3",

  [MUSIC.LAUNDRY]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/laundry.mp3",

  [MUSIC.GOOD_EVENT]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/good-event-room.mp3",

  [MUSIC.BAD_EVENT]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/bad-event-room.mp3",
};

/* ROOM MUSIC PATHS ...........................................................................................................*/

const ROOM_MUSIC_PATHS = [
  "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/room-1.mp3",
  "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/room-2.mp3",
  "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/room-3.mp3",
  "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/room-4.mp3",
  "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/room-5.mp3",
  "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/room-6.mp3",
  "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/room-7.mp3",
  "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/room-8.mp3",
  "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/music/room-9.mp3",
];

/* SFX PATHS ..................................................................................................................*/

const SFX_PATHS = {
  [SFX.SOUL_MOTEL_BEGIN]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/soul-motel-begin.mp3",

  [SFX.FOOTSTEPS_CORRIDOR]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/footsteps-corridor.mp3",

  [SFX.FOOTSTEPS_STAIRS]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/footsteps-stairs.mp3",

  [SFX.DOOR_OPEN]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/door-open.mp3",

  [SFX.DOOR_CLOSED]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/door-closed.mp3",

  [SFX.PICKUP_KEY]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/pickup-key.mp3",

  [SFX.PICKUP_ITEM]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/pickup-item.mp3",

  [SFX.TRAP_DOG]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/trap-dog.mp3",

  [SFX.TRAP_RAT]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/trap-rat.mp3",

  [SFX.TRAP_HOLE]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/trap-hole.mp3",

  [SFX.GOOD_EVENT]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/good-event.mp3",

  [SFX.BAD_EVENT]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/bad-event.mp3",

  [SFX.VICTORY]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/victory.mp3",

  [SFX.GAME_OVER]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/game-over.mp3",

  [SFX.CORRECT_CODE]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/correct-code.mp3",

  [SFX.WRONG_CODE]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/wrong-code.mp3",

  [SFX.STAIRS_OPEN]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/stairs-open.mp3",

  [SFX.PAGE_TURN]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/page-turn.mp3",

  [SFX.BIP_CODE]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/bip-code.mp3",

  [SFX.LADDER_CLIMB]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/ladder-climb.mp3",

  [SFX.LAUGH]:
    "/sounds/legal/banner-bottom-nyc-games/coney/maze-game/sfx/laugh.mp3",
};

/* AUDIO SETTINGS .............................................................................................................*/
/* ............................................................................................................................*/
/* ............................................................................................................................*/

const MUSIC_VOLUME = {
  [MUSIC.FLOOR_1]: 0.25,
  [MUSIC.FLOOR_2]: 0.35,
  [MUSIC.FLOOR_3]: 1,
  [MUSIC.FLOOR_4]: 0.25,
  [MUSIC.FLOOR_5]: 0.25,

  [MUSIC.RECEPTION]: 0.25,
  [MUSIC.LOUNGE]: 0.55,
  [MUSIC.BAR]: 0.6,
  [MUSIC.RESTAURANT]: 0.55,
  [MUSIC.LAUNDRY]: 0.35,

  [MUSIC.GOOD_EVENT]: 0.2,
  [MUSIC.BAD_EVENT]: 0.2,

  ["room-1"]: 0.3,
  ["room-2"]: 0.3,
  ["room-3"]: 0.3,
  ["room-4"]: 0.3,
  ["room-5"]: 0.3,
  ["room-6"]: 0.3,
["room-7"]: 0.3,
["room-8"]: 0.3,
["room-9"]: 0.3,
};

const SFX_VOLUME = {
  [SFX.SOUL_MOTEL_BEGIN]: 0.05,

  [SFX.FOOTSTEPS_CORRIDOR]: 0.25,
  [SFX.FOOTSTEPS_STAIRS]: 0.4,

  [SFX.DOOR_OPEN]: 0.10,
  [SFX.DOOR_CLOSED]: 0.15,

  [SFX.PICKUP_KEY]: 0.45,
  [SFX.PICKUP_ITEM]: 0.45,

  [SFX.TRAP_DOG]: 0.20,
  [SFX.TRAP_RAT]: 0.3,
  [SFX.TRAP_HOLE]: 0.15,

  [SFX.GOOD_EVENT]: 0.3,
  [SFX.BAD_EVENT]: 0.1,

  [SFX.CORRECT_CODE]: 0.3,
  [SFX.WRONG_CODE]: 0.3,

  [SFX.VICTORY]: 0.5,
  [SFX.GAME_OVER]: 0.5,

  [SFX.STAIRS_OPEN]: 0.1,
  [SFX.PAGE_TURN]: 0.4,
  [SFX.BIP_CODE]: 0.2,
  [SFX.LADDER_CLIMB]: 0.15,
  [SFX.LAUGH]: 0.2,
};

let musicMuted = false;
let sfxMuted = false;

/* AUDIO STATE ................................................................................................................*/
/* ............................................................................................................................*/
/* ............................................................................................................................*/

let currentMusic = null;
let currentMusicKey = null;
let musicWasPlayingBeforePause = false;

let currentRoomMusicIndex = 0;

const activeSFX = new Set();
const pausedMazeSFX = new Set();

/* AUDIO AVAILABLE ............................................................................................................*/

function isAudioAvailable() {
  return typeof window !== "undefined" && typeof window.Audio !== "undefined";
}



/* SAFE PLAY ..................................................................................................................*/

function safePlay(audio, path, audioType) {
  if (!audio) return;

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      console.warn(
        `[MazeGameAudioManager] Lecture ${audioType} impossible : ${path}`,
        error,
      );
    });
  }
}

/* CREATE MUSIC AUDIO .........................................................................................................*/

function createMusicAudio(path, volume) {
  if (!isAudioAvailable()) return null;

  const audio = new Audio(path);

  audio.loop = true;
  audio.preload = "auto";

  audio.mazeVolume = volume;

  audio.volume = musicMuted ? 0 : volume;
  return audio;
}

/* CREATE SFX AUDIO ...........................................................................................................*/

function createSFXAudio(path, volume) {
  if (!isAudioAvailable()) return null;

  const audio = new Audio(path);

  audio.loop = false;
  audio.preload = "auto";
  audio.mazeVolume = volume;
  audio.volume = sfxMuted ? 0 : volume;

  return audio;
}

/* STOP CURRENT MUSIC .........................................................................................................*/

function stopCurrentMusic() {
  if (!currentMusic) return;

  const audio = currentMusic;

  currentMusic = null;
  currentMusicKey = null;

  const startVolume = audio.volume;

  const duration = 300;
  const step = 30;

  let elapsed = 0;

  const fade = setInterval(() => {
    elapsed += step;

    const progress = elapsed / duration;

    audio.volume = startVolume * (1 - progress);

    if (progress >= 1) {
      clearInterval(fade);

      audio.pause();

      audio.currentTime = 0;

      audio.volume = musicMuted ? 0 : (audio.mazeVolume ?? startVolume);
    }
  }, step);
}

/* GET NEXT ROOM MUSIC ........................................................................................................*/

function getNextRoomMusic() {
  const musicIndex = currentRoomMusicIndex;
  const musicPath = ROOM_MUSIC_PATHS[musicIndex];

  currentRoomMusicIndex = (currentRoomMusicIndex + 1) % ROOM_MUSIC_PATHS.length;

  return {
    key: `${MUSIC.ROOM}-${musicIndex + 1}`,
    path: musicPath,
  };
}

/* PLAY MUSIC PATH ............................................................................................................*/

function playMusicPath(musicKey, musicPath) {
  if (!isAudioAvailable()) return;

  if (!musicPath) {
    console.warn(
      `[MazeGameAudioManager] Chemin musical introuvable : ${musicKey}`,
    );

    return;
  }

  if (currentMusicKey === musicKey && currentMusic) {
    return;
  }

  stopCurrentMusic();

  const volume = MUSIC_VOLUME[musicKey] ?? 0.6;

  const audio = createMusicAudio(musicPath, volume);

  if (!audio) return;

  currentMusic = audio;
  currentMusicKey = musicKey;

  safePlay(audio, musicPath, "musicale");
}

/* PLAY MUSIC .................................................................................................................*/

function playMusic(musicKey) {
  if (musicKey === MUSIC.ROOM) {
    playRoomMusic();
    return;
  }

  const musicPath = MUSIC_PATHS[musicKey];

  if (!musicPath) {
    console.warn(`[MazeGameAudioManager] Musique inconnue : ${musicKey}`);

    return;
  }

  playMusicPath(musicKey, musicPath);
}

/* PLAY FLOOR MUSIC ...........................................................................................................*/

function playFloorMusic(floor) {
  const floorMusicMap = {
    1: MUSIC.FLOOR_1,
    2: MUSIC.FLOOR_2,
    3: MUSIC.FLOOR_3,
    4: MUSIC.FLOOR_4,
    5: MUSIC.FLOOR_5,
  };

  const musicKey = floorMusicMap[floor];

  if (!musicKey) {
    console.warn(
      `[MazeGameAudioManager] Aucun morceau associé au floor ${floor}`,
    );

    return;
  }

  playMusic(musicKey);
}

/* PLAY ROOM MUSIC ............................................................................................................*/

function playRoomMusic(eventType = null) {
  if (eventType === "good") {
    playMusic(MUSIC.GOOD_EVENT);
    return;
  }

  if (eventType === "bad") {
    playMusic(MUSIC.BAD_EVENT);
    return;
  }

  const roomMusic = getNextRoomMusic();

  playMusicPath(roomMusic.key, roomMusic.path);
}

/* PLAY RDC MUSIC .............................................................................................................*/

function playRdcMusic(roomId) {
  const rdcMusicMap = {
    reception: MUSIC.RECEPTION,
    lounge: MUSIC.LOUNGE,
    salon: MUSIC.LOUNGE,
    bar: MUSIC.BAR,
    restaurant: MUSIC.RESTAURANT,
    laundry: MUSIC.LAUNDRY,
    lingerie: MUSIC.LAUNDRY,
  };

  const musicKey = rdcMusicMap[roomId];

  if (!musicKey) {
    console.warn(
      `[MazeGameAudioManager] Aucune musique RDC associée à : ${roomId}`,
    );

    return;
  }

  playMusic(musicKey);
}

/* PLAY EVENT MUSIC ...........................................................................................................*/

function playEventMusic(eventType) {
  if (eventType === "good") {
    playMusic(MUSIC.GOOD_EVENT);
    return;
  }

  if (eventType === "bad") {
    playMusic(MUSIC.BAD_EVENT);
    return;
  }

  console.warn(
    `[MazeGameAudioManager] Type de musique événement inconnu : ${eventType}`,
  );
}

/* PLAY SFX ...................................................................................................................*/

function playSFX(sfxKey) {
  if (!isAudioAvailable()) return null;

  const sfxPath = SFX_PATHS[sfxKey];

  if (!sfxPath) {
    console.warn(`[MazeGameAudioManager] Sound effect inconnu : ${sfxKey}`);

    return null;
  }

  const volume = SFX_VOLUME[sfxKey] ?? 0.5;

  const audio = createSFXAudio(sfxPath, volume);

  if (!audio) return null;

  activeSFX.add(audio);

  const clearSFX = () => {
    activeSFX.delete(audio);

    audio.removeEventListener("ended", clearSFX);
    audio.removeEventListener("error", clearSFX);
  };

  audio.addEventListener("ended", clearSFX);
  audio.addEventListener("error", clearSFX);

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      clearSFX();

      console.warn(
        `[MazeGameAudioManager] Lecture SFX impossible : ${sfxPath}`,
        error,
      );
    });
  }

  return audio;
}

/* STOP SFX ...................................................................................................................*/

function stopSFX(audio) {
  if (!audio) return;

  audio.pause();
  audio.currentTime = 0;

  activeSFX.delete(audio);
}

/* STOP ALL SFX ...............................................................................................................*/

function stopAllSFX() {
  activeSFX.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });

  activeSFX.clear();
}

/* STOP ALL AUDIO .............................................................................................................*/

function stopAll() {
  stopCurrentMusic();
  stopAllSFX();
}


/* GET MUSIC VOLUMES ..........................................................................................................*/

function getMusicVolume() {
  return MUSIC_VOLUME;
}

/* GET SFX VOLUMES ............................................................................................................*/

function getSFXVolume() {
  return SFX_VOLUME;
}

/* MUTE MUSIC .................................................................................................................*/

function muteMusic() {
  musicMuted = true;

  if (currentMusic) {
    currentMusic.volume = 0;
  }
}

/* UNMUTE MUSIC ...............................................................................................................*/

function unmuteMusic() {
  musicMuted = false;

  if (currentMusic) {
    const volume = MUSIC_VOLUME[currentMusicKey] ?? 0.6;

    currentMusic.volume = volume;
  }
}

/* MUTE SFX ...................................................................................................................*/

function muteSFX() {
  sfxMuted = true;

  activeSFX.forEach((audio) => {
    audio.volume = 0;
  });
}

/* UNMUTE SFX .................................................................................................................*/

function unmuteSFX() {
  sfxMuted = false;

  activeSFX.forEach((audio) => {
    audio.volume = audio.mazeVolume ?? 0.5;
  });
}

/* MUTE ALL ...................................................................................................................*/

function muteAll() {
  muteMusic();
  muteSFX();
}

/* UNMUTE ALL .................................................................................................................*/

function unmuteAll() {
  unmuteMusic();
  unmuteSFX();
}

/* IS MUSIC MUTED .............................................................................................................*/

function isMusicMuted() {
  return musicMuted;
}

/* IS SFX MUTED ...............................................................................................................*/

function isSFXMuted() {
  return sfxMuted;
}

/* GET CURRENT MUSIC KEY .....................................................................................................*/

function getCurrentMusicKey() {
  return currentMusicKey;
}

/* RESET ROOM MUSIC ROTATION .................................................................................................*/

function resetRoomMusicRotation() {
  currentRoomMusicIndex = 0;
}

/* PAUSE / RESUME AUDIO .......................................................................................................*/

function pauseAudio() {
  musicWasPlayingBeforePause =
    Boolean(currentMusic) &&
    !currentMusic.paused;

  if (currentMusic) {
    currentMusic.pause();
  }

  activeSFX.forEach((audio) => {
    if (!audio.paused) {
      audio.pause();
      pausedMazeSFX.add(audio);
    }
  });
}

function resumeAudio() {
  pausedMazeSFX.forEach((audio) => {
    audio.play().catch(() => {
      activeSFX.delete(audio);
    });
  });

  pausedMazeSFX.clear();

  if (
    !musicWasPlayingBeforePause ||
    !currentMusic
  ) {
    return;
  }

  currentMusic.play().catch(() => {});

  musicWasPlayingBeforePause = false;
}

/* RESET AUDIO MANAGER ........................................................................................................*/

function reset() {
  musicWasPlayingBeforePause = false;

  stopAll();
  pausedMazeSFX.clear();

  resetRoomMusicRotation();

  musicMuted = false;
  sfxMuted = false;
}

/* MAZE GAME AUDIO MANAGER ....................................................................................................*/
/* ............................................................................................................................*/
/* ............................................................................................................................*/

const MazeGameAudioManager = {
  playMusic,
  playFloorMusic,
  playRoomMusic,
  playRdcMusic,
  playEventMusic,

  stopMusic: stopCurrentMusic,

  playSFX,
  stopSFX,
  stopAllSFX,

  stopAll,

  getMusicVolume,
  getSFXVolume,

  muteMusic,
  unmuteMusic,

  muteSFX,
  unmuteSFX,

  muteAll,
  unmuteAll,

  isMusicMuted,
  isSFXMuted,

  getCurrentMusicKey,

  resetRoomMusicRotation,

    pauseAudio,
  resumeAudio,

  reset,
};

/* EXPORT .....................................................................................................................*/

export default MazeGameAudioManager;
