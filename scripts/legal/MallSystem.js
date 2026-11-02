import {
  resetDartsGame,
  startDartsGame,
  pauseDartsGame,
  resumeDartsGame,
} from "./DartsGame.js";
import {
  fadeInDartsMusic,
  resetDartsAudio,
  playDartsNewGameSfx,
  pauseDartsAudio,
  resumeDartsAudio,
} from "./DartsGameAudioManager.js";
import {
  initTetrisGame,
  resetTetrisGame,
  pauseTetrisGame,
  resumeTetrisGame,
} from "./TetrisGame.js";
import {
  fadeInTetrisMusic,
  fadeOutTetrisMusic,
  resetTetrisAudio,
  playTetrisNewGameSfx,
  pauseTetrisAudio,
  resumeTetrisAudio,
} from "./TetrisGameAudioManager.js";
import {
  initMemoryGame,
  resetMemoryGame,
  pauseMemoryGame,
  resumeMemoryGame,
} from "./MemoryGame.js";
import {
  fadeInMemoryMusic,
  fadeOutMemoryMusic,
  resetMemoryAudio,
  playMemoryNewGameSfx,
  pauseMemoryAudio,
  resumeMemoryAudio,
} from "./MemoryGameAudioManager.js";
import {
  initMazeGame,
  resetMazeGame,
  pauseMazeGame,
  resumeMazeGame,
} from "./MazeGame.js";
import MazeGameAudioManager from "./MazeGameAudioManager.js";
import {
  initVideoPoker,
  resetVideoPoker,
  pauseVideoPoker,
  resumeVideoPoker,
} from "./VideoPoker.js";
import {
  initSlotMachine,
  resetSlotMachine,
  spinReels,
  pauseSlotMachine,
  resumeSlotMachine,
} from "./SlotMachine.js";
import {
  initLuckyWheel,
  resetLuckyWheel,
  spinLuckyWheel,
  pauseLuckyWheel,
  resumeLuckyWheel,
} from "./LuckyWheel.js";
import {
  initDiceGame,
  resetDiceGame,
  startDiceGame,
  rollDice,
  pauseDiceGame,
  resumeDiceGame,
} from "./DiceGame.js";
import { creditPlayerMoney, debitPlayerMoney } from "./MoneyManager.js";

import MallAudioManager from "./MallAudioManager.js";

function createDeferredAudio(source) {
  const audio = new Audio();
  audio.preload = "none";
  audio.src = source;
  return audio;
}

export default function initMallSystem() {
  const secondBanner = document.getElementById("second-banner");
  if (!secondBanner) return;

  // React Strict Mode peut invoquer l’effet d’initialisation deux fois en
  // développement. Un seul système doit posséder les écouteurs du jeu.
  if (secondBanner.dataset.mallSystemInitialized === "true") return;
  secondBanner.dataset.mallSystemInitialized = "true";

  const casinoLobbyMusic = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/common/casino-background-ambiance.mp3",
  );

  const destinationHubMusic = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/common/destination-hub-music.mp3",
  );

  const destinationHubHoverSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/common/destination-hub-hover.mp3",
  );

  const destinationHubMetroSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/common/destination-hub-metro.mp3",
  );

  const destinationHubSelectPlayerSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/common/destination-hub-select-player.mp3",
  );

  /* START GAME BUTTON SFX............................................................................................................. */

  const startGameButtonAudio = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/common/start-game-button.mp3",
  );

  startGameButtonAudio.volume = 0.4;

  function playStartGameButtonSfx() {
    startGameButtonAudio.pause();
    startGameButtonAudio.currentTime = 0;

    startGameButtonAudio.play().catch(() => {});
  }

  /* CONEY AUDIO.................................................................................................................... */

  const coneyMusic = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/coney/common/coney-music.mp3",
  );

  coneyMusic.loop = true;
  coneyMusic.volume = 0;

  const coneySelectGameSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/coney/common/select-game.mp3",
  );

  coneySelectGameSfx.volume = 0.3;

  let coneyMusicFadeInterval = null;

  destinationHubSelectPlayerSfx.volume = 0.1;

  destinationHubMusic.loop = true;
  destinationHubMusic.volume = 0;

  destinationHubHoverSfx.volume = 0.25;
  destinationHubMetroSfx.volume = 0.25;

  casinoLobbyMusic.loop = true;
  casinoLobbyMusic.volume = 0.35;

  const videoPokerMusic = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/video-poker/music/video-poker-jazz.mp3",
  );

  const vpNewGameSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/video-poker/sfx/button-new-game.mp3",
  );

  const vpDealCardsSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/video-poker/sfx/dealing-and-replace-cards.mp3",
  );

  const vpReplaceSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/video-poker/sfx/button-replace.mp3",
  );

  const vpWinSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/video-poker/sfx/win-game.mp3",
  );

  const vpLoseSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/video-poker/sfx/lose-game.mp3",
  );

  const smNewGameSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/slot-machine/sfx/button-new-game.mp3",
  );

  const smSpinSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/slot-machine/sfx/button-replace.mp3",
  );

  const smReelTurnSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/slot-machine/sfx/reel-turn.mp3",
  );

  const smWinSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/slot-machine/sfx/win-game.mp3",
  );

  const smLoseSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/slot-machine/sfx/lose-game.mp3",
  );

  const slotMachineMusic = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/slot-machine/music/slot-machine-music.mp3",
  );

  slotMachineMusic.loop = true;
  slotMachineMusic.volume = 0;

  const luckyWheelMusic = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/lucky-wheel/music/lucky-wheel-music.mp3",
  );

  const lwNewGameSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/lucky-wheel/sfx/button-new-game.mp3",
  );

  const lwSpinSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/lucky-wheel/sfx/button-replace.mp3",
  );

  const lwWheelTurnSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/lucky-wheel/sfx/wheel-turn.mp3",
  );

  const lwWinSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/lucky-wheel/sfx/win-game.mp3",
  );

  const lwLoseSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/lucky-wheel/sfx/lose-game.mp3",
  );

  const lwJackpotSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/lucky-wheel/sfx/jackpot.mp3",
  );

  const diceGameMusic = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/dice-game/music/dice-game-music.mp3",
  );

  const diceNewGameSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/dice-game/sfx/button-new-game.mp3",
  );

  const diceRollBtnSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/dice-game/sfx/button-replace.mp3",
  );

  const diceRollSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/dice-game/sfx/dice-sounds.mp3",
  );

  const diceWinSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/dice-game/sfx/win-game.mp3",
  );

  const diceLoseSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/dice-game/sfx/lose-game.mp3",
  );

  const diceJackpotSfx = createDeferredAudio(
    "/sounds/legal/banner-bottom-nyc-games/casino/dice-game/sfx/jackpot.mp3",
  );

  diceGameMusic.loop = true;
  diceGameMusic.volume = 0;

  diceNewGameSfx.volume = 0.4;
  diceRollBtnSfx.volume = 0.35;
  diceRollSfx.volume = 0.4;
  diceWinSfx.volume = 0.3;
  diceLoseSfx.volume = 0.55;
  diceJackpotSfx.volume = 0.5;

  luckyWheelMusic.loop = true;
  luckyWheelMusic.volume = 0;
  lwJackpotSfx.volume = 0.5;

  lwNewGameSfx.volume = 0.4;
  lwSpinSfx.volume = 0.35;
  lwWheelTurnSfx.volume = 0.2;
  lwWinSfx.volume = 0.25;
  lwLoseSfx.volume = 0.3;

  vpNewGameSfx.volume = 0.4;
  vpDealCardsSfx.volume = 0.25;
  vpReplaceSfx.volume = 0.35;
  vpWinSfx.volume = 0.3;
  vpLoseSfx.volume = 0.55;
  videoPokerMusic.loop = true;
  videoPokerMusic.volume = 0;

  smNewGameSfx.volume = 0.4;
  smSpinSfx.volume = 0.35;
  smReelTurnSfx.volume = 0.3;
  smWinSfx.volume = 0.3;
  smLoseSfx.volume = 0.55;

  /* NYC GAMES AUDIO PAUSE............................................................................................................ */

  const nycMusicTracks = [
    coneyMusic,
    casinoLobbyMusic,
    videoPokerMusic,
    slotMachineMusic,
    luckyWheelMusic,
    diceGameMusic,
  ];

  const nycSfxTracks = [
    destinationHubHoverSfx,
    destinationHubMetroSfx,
    destinationHubSelectPlayerSfx,
    startGameButtonAudio,
    coneySelectGameSfx,

    vpNewGameSfx,
    vpDealCardsSfx,
    vpReplaceSfx,
    vpWinSfx,
    vpLoseSfx,

    smNewGameSfx,
    smSpinSfx,
    smReelTurnSfx,
    smWinSfx,
    smLoseSfx,

    lwNewGameSfx,
    lwSpinSfx,
    lwWheelTurnSfx,
    lwWinSfx,
    lwLoseSfx,
    lwJackpotSfx,

    diceNewGameSfx,
    diceRollBtnSfx,
    diceRollSfx,
    diceWinSfx,
    diceLoseSfx,
    diceJackpotSfx,
  ];

  const pausedNycMusicTracks = new Set();
  const pausedNycSfxTracks = new Set();

  function pauseDirectNycAudio() {
    nycMusicTracks.forEach((audio) => {
      if (!audio.paused) {
        audio.pause();
        pausedNycMusicTracks.add(audio);
      }
    });

    nycSfxTracks.forEach((audio) => {
      if (!audio.paused) {
        audio.pause();
        pausedNycSfxTracks.add(audio);
      }
    });
  }

  function resumeDirectNycAudio() {
    pausedNycMusicTracks.forEach((audio) => {
      audio.play().catch(() => {});
    });

    pausedNycSfxTracks.forEach((audio) => {
      audio.play().catch(() => {});
    });

    pausedNycMusicTracks.clear();
    pausedNycSfxTracks.clear();
  }

  function fadeOutCasinoLobbyMusic(duration = 800) {
    const startVolume = casinoLobbyMusic.volume;
    const steps = 20;
    const stepTime = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      casinoLobbyMusic.volume = startVolume * (1 - currentStep / steps);

      if (currentStep >= steps) {
        clearInterval(interval);
        casinoLobbyMusic.pause();
        casinoLobbyMusic.currentTime = 0;
        casinoLobbyMusic.volume = startVolume;
      }
    }, stepTime);
  }

  function fadeInVideoPokerMusic(targetVolume = 0.05, duration = 1200) {
    videoPokerMusic.volume = 0;
    videoPokerMusic.currentTime = 0;
    videoPokerMusic.play().catch(() => {});

    const steps = 20;
    const stepTime = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      videoPokerMusic.volume = targetVolume * (currentStep / steps);

      if (currentStep >= steps) {
        clearInterval(interval);
        videoPokerMusic.volume = targetVolume;
      }
    }, stepTime);
  }

  function fadeOutVideoPokerMusic(duration = 800) {
    const startVolume = videoPokerMusic.volume;
    const steps = 20;
    const stepTime = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      videoPokerMusic.volume = startVolume * (1 - currentStep / steps);

      if (currentStep >= steps) {
        clearInterval(interval);
        videoPokerMusic.pause();
        videoPokerMusic.currentTime = 0;
        videoPokerMusic.volume = startVolume;
      }
    }, stepTime);
  }

  function fadeInSlotMachineMusic(targetVolume = 0.05, duration = 1200) {
    slotMachineMusic.volume = 0;
    slotMachineMusic.currentTime = 0;
    slotMachineMusic.play().catch(() => {});

    const steps = 20;
    const stepTime = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      slotMachineMusic.volume = targetVolume * (currentStep / steps);

      if (currentStep >= steps) {
        clearInterval(interval);
        slotMachineMusic.volume = targetVolume;
      }
    }, stepTime);
  }

  function fadeOutSlotMachineMusic(duration = 800) {
    const startVolume = slotMachineMusic.volume;
    const steps = 20;
    const stepTime = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      slotMachineMusic.volume = startVolume * (1 - currentStep / steps);

      if (currentStep >= steps) {
        clearInterval(interval);
        slotMachineMusic.pause();
        slotMachineMusic.currentTime = 0;
        slotMachineMusic.volume = startVolume;
      }
    }, stepTime);
  }

  function fadeInLuckyWheelMusic(targetVolume = 0.05, duration = 1200) {
    luckyWheelMusic.volume = 0;
    luckyWheelMusic.currentTime = 0;
    luckyWheelMusic.play().catch(() => {});

    const steps = 20;
    const stepTime = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      luckyWheelMusic.volume = targetVolume * (currentStep / steps);

      if (currentStep >= steps) {
        clearInterval(interval);
        luckyWheelMusic.volume = targetVolume;
      }
    }, stepTime);
  }

  function fadeOutLuckyWheelMusic(duration = 800) {
    const startVolume = luckyWheelMusic.volume;
    const steps = 20;
    const stepTime = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      luckyWheelMusic.volume = startVolume * (1 - currentStep / steps);

      if (currentStep >= steps) {
        clearInterval(interval);
        luckyWheelMusic.pause();
        luckyWheelMusic.currentTime = 0;
        luckyWheelMusic.volume = startVolume;
      }
    }, stepTime);
  }

  function fadeInDiceGameMusic(targetVolume = 0.6, duration = 1200) {
    diceGameMusic.volume = 0;
    diceGameMusic.currentTime = 0;

    diceGameMusic.play().catch(() => {});

    const steps = 20;
    const stepTime = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      diceGameMusic.volume = targetVolume * (currentStep / steps);

      if (currentStep >= steps) {
        clearInterval(interval);
        diceGameMusic.volume = targetVolume;
      }
    }, stepTime);
  }

  function fadeOutDiceGameMusic(duration = 800) {
    const startVolume = diceGameMusic.volume;
    const steps = 20;
    const stepTime = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      diceGameMusic.volume = startVolume * (1 - currentStep / steps);

      if (currentStep >= steps) {
        clearInterval(interval);

        diceGameMusic.pause();
        diceGameMusic.currentTime = 0;
        diceGameMusic.volume = startVolume;
      }
    }, stepTime);
  }

  function fadeInDestinationHubMusic(targetVolume = 0.5, duration = 1200) {
    destinationHubMusic.volume = 0;
    destinationHubMusic.currentTime = 0;
    destinationHubMusic.play().catch(() => {});

    const steps = 20;
    const stepTime = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      destinationHubMusic.volume = targetVolume * (currentStep / steps);

      if (currentStep >= steps) {
        clearInterval(interval);
        destinationHubMusic.volume = targetVolume;
      }
    }, stepTime);
  }

  function fadeOutDestinationHubMusic(duration = 800) {
    const startVolume = destinationHubMusic.volume;
    const steps = 20;
    const stepTime = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      destinationHubMusic.volume = startVolume * (1 - currentStep / steps);

      if (currentStep >= steps) {
        clearInterval(interval);
        destinationHubMusic.pause();
        destinationHubMusic.currentTime = 0;
        destinationHubMusic.volume = startVolume;
      }
    }, stepTime);
  }

  /* CONEY MUSIC.................................................................... */

  function fadeInConeyMusic(targetVolume = 0.3, duration = 1200) {
    if (coneyMusicFadeInterval) {
      clearInterval(coneyMusicFadeInterval);
    }

    coneyMusic.play().catch(() => {});

    const startVolume = coneyMusic.volume;
    const steps = 30;
    const stepTime = duration / steps;
    const volumeStep = (targetVolume - startVolume) / steps;

    let step = 0;

    coneyMusicFadeInterval = setInterval(() => {
      step++;

      coneyMusic.volume = Math.min(
        targetVolume,
        Math.max(0, startVolume + volumeStep * step),
      );

      if (step >= steps) {
        clearInterval(coneyMusicFadeInterval);
        coneyMusicFadeInterval = null;
        coneyMusic.volume = targetVolume;
      }
    }, stepTime);
  }

  function fadeOutConeyMusic(duration = 800) {
    if (coneyMusicFadeInterval) {
      clearInterval(coneyMusicFadeInterval);
      coneyMusicFadeInterval = null;
    }

    if (coneyMusic.paused) return;

    const startVolume = coneyMusic.volume;
    const steps = 30;
    const stepTime = duration / steps;

    let step = 0;

    coneyMusicFadeInterval = setInterval(() => {
      step++;

      coneyMusic.volume = Math.max(0, startVolume * (1 - step / steps));

      if (step >= steps) {
        clearInterval(coneyMusicFadeInterval);
        coneyMusicFadeInterval = null;

        coneyMusic.pause();
        coneyMusic.currentTime = 0;
        coneyMusic.volume = 0;
      }
    }, stepTime);
  }

  function resetDiceGameSfx() {
    const sounds = [
      diceNewGameSfx,
      diceRollBtnSfx,
      diceRollSfx,
      diceWinSfx,
      diceLoseSfx,
      diceJackpotSfx,
    ];

    sounds.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  function resetLuckyWheelSfx() {
    const sounds = [
      lwNewGameSfx,
      lwSpinSfx,
      lwWheelTurnSfx,
      lwWinSfx,
      lwLoseSfx,
      lwJackpotSfx,
    ];

    sounds.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  const mallCurrentNom = document.getElementById("mall-current-nom");
  const mallCurrentArgent = document.getElementById("mall-current-argent");
  const mallCurrentRetiree = mallCurrentNom?.parentElement;

  if (mallCurrentRetiree) {
    mallCurrentRetiree.style.cursor = "pointer";

    /* HOVER → COMPTEUR ARGENT */

    mallCurrentRetiree.addEventListener("mouseenter", () => {
      const retiree = window.SMQ_RETRAITES[currentIndex];

      if (!retiree) return;
      if (animatedRetirees.has(currentIndex)) return;

      animatedRetirees.add(currentIndex);

      retireeMoneyCounting = true;

      animateRetireeMoney(retiree.argent, 1500);
    });

    /* CLICK → SELECTION + SFX + MUSIQUE */

    mallCurrentRetiree.addEventListener("click", () => {
      if (!window.SMQ_RETRAITES?.[currentIndex]) return;
      // Un retraité est déjà sélectionné → aucun nouveau choix possible
      if (selectedRetireeIndex !== null) return;
      if (retireeMoneyCounting) return;

      // On verrouille le retraité actuel pour la session
      selectedRetireeIndex = currentIndex;
      mallCurrentRetiree.classList.add("retiree-selected");
      hideRetireeCarouselArrows();
      const destinationHub = document.getElementById("mall-seq1");

      if (destinationHub) {
        destinationHub.classList.add("hub-unlocked");
      }

      // SFX sélection
      destinationHubSelectPlayerSfx.currentTime = 0;
      destinationHubSelectPlayerSfx.play().catch(() => {});

      // Musique Destination Hub
      if (destinationHubInView && currentMode === "seq1") {
        fadeInDestinationHubMusic();
      }
    });
  }

  const btnPrev = document.getElementById("mall-prev");
  const btnNext = document.getElementById("mall-next");

  const gameHoverLinks = document.querySelectorAll(
    ".effet-coney-game-darts, \
   .effet-coney-game-tetris, \
   .effet-coney-game-memory, \
   .effet-coney-game-maze, \
   .effet-mall-shop-vinyls, \
   .effet-mall-shop-books-movies, \
   .effet-mall-shop-audio, \
   .effet-mall-shop-fashion, \
   .effet-casino-game-videoPoker, \
   .effet-casino-game-slotMachine, \
   .effet-casino-game-luckyWheel, \
   .effet-casino-game-dice",
  );

  gameHoverLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      coneySelectGameSfx.currentTime = 0;
      coneySelectGameSfx.play().catch(() => {});
    });
  });

  /* MALL SHOP SFX................................................................................................................... */

  const mallCarouselArrowSelector = [
    ".vinyls-btn-prev",
    ".vinyls-btn-next",
    ".books-btn-prev",
    ".books-btn-next",
    ".audio-btn-prev",
    ".audio-btn-next",
    ".fashion-btn-prev",
    ".fashion-btn-next",
  ].join(", ");

  secondBanner.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    if (target.closest(mallCarouselArrowSelector)) {
      MallAudioManager.playNextPageSfx();
    }
  });

  secondBanner.addEventListener("mouseover", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const card = target.closest(".mall-card");

    if (!card) return;

    const previousElement = event.relatedTarget;

    if (previousElement instanceof Node && card.contains(previousElement)) {
      return;
    }

    MallAudioManager.playSelectItemSfx();
  });

  const seq1 = document.getElementById("mall-seq1");
  const seq2 = document.getElementById("mall-seq2");
  const destinationMetro = document.getElementById("destination-metro");

  if (destinationMetro) {
    secondBanner.appendChild(destinationMetro);
  }

  const seq2Nom = document.getElementById("mall-seq2-nom");
  const seq2Bg = document.getElementById("seq2-bg");

  const sortir = document.getElementById("mall-sortir");

  const playerName = document.getElementById("player-name-container");
  const playerMoney = document.getElementById("player-money-container");

  const startGame = document.getElementById("start-game");

  /* CASINO RECORDS................................................................................................................... */

  const CASINO_RECORDS = {
    videoPoker: {
      gainKey: "casino_videoPoker_best_gain",
      playerKey: "casino_videoPoker_best_player",
      elementId: "best-score-videoPoker",
    },

    slotMachine: {
      gainKey: "casino_slotMachine_best_gain",
      playerKey: "casino_slotMachine_best_player",
      elementId: "best-score-slotMachine",
    },

    luckyWheel: {
      gainKey: "casino_luckyWheel_best_gain",
      playerKey: "casino_luckyWheel_best_player",
      elementId: "best-score-luckyWheel",
    },

    dice: {
      gainKey: "casino_dice_best_gain",
      playerKey: "casino_dice_best_player",
      elementId: "best-score-dice",
    },
  };

  function registerCasinoRecord(gameKey, gain) {
    const record = CASINO_RECORDS[gameKey];
    const player = window.SMQ_RETRAITES?.[currentIndex];
    const validGain = Number(gain);

    if (!record || !player) return false;
    if (!Number.isFinite(validGain) || validGain <= 0) {
      return false;
    }

    const previousGain = Number(localStorage.getItem(record.gainKey)) || 0;

    if (validGain <= previousGain) {
      return false;
    }

    localStorage.setItem(record.gainKey, String(validGain));

    localStorage.setItem(record.playerKey, player.nom);

    return true;
  }

  function updateCasinoBestScoresUI() {
    const container = document.getElementById("seq2-casino");

    if (!container) return;

    Object.values(CASINO_RECORDS).forEach((record) => {
      const element = container.querySelector(`#${record.elementId}`);

      if (!element) return;

      const gain = localStorage.getItem(record.gainKey);
      const player = localStorage.getItem(record.playerKey);

      if (!gain || !player) {
        element.innerHTML = "";
        element.style.opacity = "0";
        element.dataset.visible = "false";

        return;
      }

      element.innerHTML = `
      Meilleur gain :
      <span class="best-name">${player}</span>
      <span class="best-time">${gain} $</span>
    `;

      element.dataset.visible = "true";
      element.style.transition = "all 0.6s ease";
      element.style.transform = "translateY(0)";
      element.style.opacity = "1";
    });
  }

  /* -------------------------------------------------------- */
  /* DISPLAY RECORDS (SEQ2)                                  */
  /* -------------------------------------------------------- */

  function updateBestScoresUI() {
    const container = document.getElementById(`seq2-${currentLieu}`);
    if (!container) return;

    const dartsEl = container.querySelector("#best-score-darts");

    /* -------------------------
     RESET GLOBAL
  ------------------------- */
    container
      .querySelectorAll(
        "#best-score-darts, #best-score-tetris, #best-score-memory, #best-score-maze",
      )
      .forEach((el) => {
        el.classList.remove("best-score-show");
        el.style.opacity = "0";
        el.style.transform = "translateY(-60px)";
        el.dataset.visible = "false";
      });

    /* -------------------------
     DARTS RECORD
  ------------------------- */

    const bestTime = localStorage.getItem("darts_best_time");
    const bestPlayer = localStorage.getItem("darts_best_player");

    if (dartsEl && bestTime && bestPlayer) {
      dartsEl.innerHTML = `
      Meilleur temps : 
      <span class="best-player">${bestPlayer}</span> 
      <span class="best-time">${bestTime}</span>
    `;

      // Marqueur pour animation (IMPORTANT)
      dartsEl.dataset.visible = "true";
    }

    updateTetrisBestScoreUI();
    updateMemoryBestScoreUI();
    updateMazeBestScoreUI();
    updateCasinoBestScoresUI();
  }

  function updateTetrisBestScoreUI() {
    const container = document.getElementById(`seq2-${currentLieu}`);
    if (!container) return;

    const el = container.querySelector("#best-score-tetris");
    if (!el) return;

    const score = localStorage.getItem("tetris_best_score");
    const player = localStorage.getItem("tetris_best_player");

    if (score && player) {
      el.innerHTML = `Meilleur score : <span class="best-name">${player}</span> <span class="best-time">${score} pts</span>`;
      el.dataset.visible = "true";
    }
  }

  function updateMemoryBestScoreUI() {
    const container = document.getElementById(`seq2-${currentLieu}`);
    if (!container) return;

    const el = container.querySelector("#best-score-memory");

    if (!el) return;

    const bestTime = localStorage.getItem("memory_best_time");

    const bestPlayer = localStorage.getItem("memory_best_player");

    if (bestTime && bestPlayer) {
      el.innerHTML = `
      Meilleur temps :
      <span class="best-name">
        ${bestPlayer}
      </span>

      <span class="best-time">
        ${bestTime}
      </span>
    `;

      el.dataset.visible = "true";
    }
  }

  function updateMazeBestScoreUI() {
    const container = document.getElementById(`seq2-${currentLieu}`);
    if (!container) return;

    const el = container.querySelector("#best-score-maze");

    if (!el) return;

    const bestScore = localStorage.getItem("maze_best_score");

    const bestPlayer = localStorage.getItem("maze_best_player");

    if (bestScore && bestPlayer) {
      el.innerHTML = `
      Meilleur score :
      <span class="best-name">
        ${bestPlayer}
      </span>

      <span class="best-time">
        ${bestScore} pts
      </span>
    `;

      el.dataset.visible = "true";
    }
  }

  /* -------------------------------------------------------- */
  /* ANIMATE BEST SCORE                                 */
  /* -------------------------------------------------------- */

  function animateBestScore(gameKey) {
    const map = {
      darts: "best-score-darts",
      tetris: "best-score-tetris",
      memory: "best-score-memory",
      maze: "best-score-maze",
    };

    const id = map[gameKey];
    if (!id) return;

    const container = document.getElementById(`seq2-${currentLieu}`);
    if (!container) return;

    const el = container.querySelector(`#${id}`);

    if (!el) return;

    if (el.dataset.visible !== "true") return;

    el.style.transition = "all .6s ease";
    el.style.transform = "translateY(0)";
    el.style.opacity = "1";
  }

  // --- CRÉATION DYNAMIQUE DE LA POP-UP "CLIQUEZ !" (CONFINÉE À LA BANNIÈRE) ---
  let clickPopup = document.getElementById("darts-click-popup");
  if (!clickPopup) {
    clickPopup = document.createElement("div");
    clickPopup.id = "darts-click-popup";
    clickPopup.textContent = "Ciblez et cliquez pour lancer votre flèche";
    secondBanner.appendChild(clickPopup);
  }

  let rulesBox = null;
  let currentGameKey = null;

  let timerInterval = null;
  let timerElapsed = 0;
  let timerWasRunningBeforePause = false;

  let currentIndex = 0;
  let currentLieu = null;
  let currentMode = "seq1";

  const animatedRetirees = new Set();

  let selectedRetireeIndex = null;
  let destinationHubInView = false;
  let nycGamesPaused = false;
  let destinationHubPausedByTab = false;

  const pausedBannerAnimations = new Set();
  let retireeMoneyCounting = false;

  try {
    const savedRetirees = JSON.parse(localStorage.getItem("smq_retirees"));

    const retireesSource = Array.isArray(window.SMQ_RETRAITES)
      ? window.SMQ_RETRAITES
      : savedRetirees;

    window.SMQ_RETRAITES = Array.isArray(retireesSource)
      ? retireesSource.filter(
          (retiree) =>
            typeof retiree?.nom === "string" &&
            retiree.nom.trim() !== "" &&
            retiree.nom !== "Bill" &&
            retiree.nom !== "Phil" &&
            Number.isFinite(retiree?.argent) &&
            retiree.argent >= 0,
        )
      : [];
  } catch {
    window.SMQ_RETRAITES = [];
  }

  localStorage.setItem("smq_retirees", JSON.stringify(window.SMQ_RETRAITES));

  const LABELS = {
    coney: "Coney Island",
    mall: "SMQ Mall",
    casino: "SMQ Casino",
  };

  const BACKGROUNDS = {
    coney: "url(/svg/legal/banner-bottom-nyc-games/coney/common/coney-hub.png)",
    mall: "url(/svg/legal/banner-bottom-nyc-games/mall/common/mall-hub.png)",
    casino:
      "url(/svg/legal/banner-bottom-nyc-games/casino/common/casino-hub.png)",
  };

  const GAMES = {
    /* ======================================================
     CONEY ISLAND
  ====================================================== */

    darts: {
      zone: "coney",
      label: "Darts",
      rules: [
        "1 - Lancer 3 flèches par tour",
        "2 - Marquer des points selon la cible",
        "3 - Atteindre exactement 301 points",
        "4 - Vous gagnez lorsque vous êtes à 0",
      ],
      init: startDartsGame,
      reset: resetDartsGame,
    },

    tetris: {
      zone: "coney",
      label: "Tetris Game",
      rules: [
        "1 - Utilisez <arrow>←</arrow> <arrow>→</arrow> pour déplacer les pièces",
        "2 - <arrow>↑</arrow> pour pivoter, <arrow>↓</arrow> pour accélérer",
        "3 - <arrow>ESPACE</arrow> pour drop instantané",
        "4 - Complétez des lignes pour marquer des points",
        "5 - Ne laissez pas les blocs atteindre le haut !",
      ],
      init: initTetrisGame,
      reset: resetTetrisGame,
    },

    memory: {
      zone: "coney",
      label: "Memory Game",
      rules: [
        "1 - Retourner deux cartes",
        "2 - Trouver les paires",
        "3 - Mémoriser les positions",
        "4 - Terminer le tableau",
      ],
      init: initMemoryGame,
      reset: resetMemoryGame,
    },

    maze: {
      zone: "coney",
      label: "Soul Motel",
      rules: [
        "1 - Trouver la sortie",
        "2 - Éviter les pièges",
        "3 - Obtenir les clés de chaque étage",
        "4 - Trouver les chiffres du digicode",
      ],
      init: initMazeGame,
      reset: resetMazeGame,
    },

    /* ======================================================
     SMQ MALL
  ====================================================== */

    vinyls: {
      zone: "mall",
      label: "Vinyles",
      rules: [],
      init: null,
      reset: null,
    },

    books: {
      zone: "mall",
      label: "Livres",
      rules: [],
      init: null,
      reset: null,
    },

    audio: {
      zone: "mall",
      label: "Matériel Audio",
      rules: [],
      init: null,
      reset: null,
    },

    fashion: {
      zone: "mall",
      label: "Fashion",
      rules: [],
      init: null,
      reset: null,
    },

    /* ======================================================
     SMQ CASINO
  ====================================================== */

    videoPoker: {
      zone: "casino",
      label: "Video Poker",
      rules: [
        "1 - Choisissez votre mise",
        "2 - Recevez cinq cartes",
        "3 - Conservez les cartes souhaitées",
        "4 - Remplacez les autres cartes",
        "5 - Réalisez la meilleure combinaison",
      ],
      init: null,
      reset: resetVideoPoker,
    },

    slotMachine: {
      zone: "casino",
      label: "Slot Machine",
      rules: [
        "1 - Choisissez votre mise",
        "2 - Lancez les rouleaux",
        "3 - Alignez les symboles",
        "4 - Les combinaisons rapportent des gains",
        "5 - Évitez de perdre toute votre mise",
      ],
      init: initSlotMachine,
      reset: resetSlotMachine,
    },

    luckyWheel: {
      zone: "casino",
      label: "Lucky Wheel",
      rules: [
        "1 - Commencez une nouvelle partie",
        "2 - Lancez la roue",
        "3 - Attendez que la roue s'arrête",
        "4 - Le gain dépend de la case indiquée par l'aiguille",
        "5 - Les gains sont ajoutés à votre argent",
      ],
      init: initLuckyWheel,
      reset: resetLuckyWheel,
    },

    dice: {
      zone: "casino",
      label: "Dice Game",
      rules: [
        "1 - Commencez une nouvelle partie",
        "2 - Lancez les trois dés",
        "3 - Réalisez une combinaison gagnante",
        "4 - Le Triple 6 déclenche le Jackpot",
        "5 - Les gains sont ajoutés à votre argent",
      ],
      init: initDiceGame,
      reset: resetDiceGame,
    },
  };

  /* GAME ENTRY PRICES............................................................................................................... */

  const GAME_ENTRY_PRICES = {
    darts: 5,
    tetris: 5,
    memory: 5,
    maze: 5,
    videoPoker: 5,
    slotMachine: 5,
    luckyWheel: 5,
    dice: 5,
  };

  /* GAME ENTRY MODAL................................................................................................................ */

  const gameEntryModal = document.getElementById("game-entry-modal");

  const gameEntryModalQuestion = document.querySelector(
    ".game-entry-modal-question",
  );

  const gameEntryModalPrice = document.getElementById("game-entry-modal-price");

  const gameEntryModalError = document.getElementById("game-entry-modal-error");

  const gameEntryModalConfirm = document.getElementById(
    "game-entry-modal-confirm",
  );

  const gameEntryModalCancel = document.getElementById(
    "game-entry-modal-cancel",
  );

  let pendingGameKey = null;
  let gameEntryModalLocked = false;
  let gameEntryModalMode = null;
  let exitConfirmationBypass = false;

  function openGameEntryModal(gameKey) {
    const game = GAMES[gameKey];
    const price = GAME_ENTRY_PRICES[gameKey];

    if (!game || typeof price !== "number") {
      return;
    }

    pendingGameKey = gameKey;
    gameEntryModalMode = "entry";
    gameEntryModalLocked = false;

    if (gameEntryModalQuestion) {
      gameEntryModalQuestion.innerHTML = `
      Voulez-vous faire une partie de
      <span id="game-entry-modal-name">
        ${game.label}
      </span>
      ?
    `;
    }

    if (gameEntryModalPrice) {
      gameEntryModalPrice.textContent = `${price} $`;
    }

    if (gameEntryModalError) {
      gameEntryModalError.textContent = "";
      gameEntryModalError.classList.remove("show");
    }

    if (gameEntryModal) {
      gameEntryModal.classList.add("show");
      gameEntryModal.setAttribute("aria-hidden", "false");
    }
  }

  function openGameExitModal() {
    pendingGameKey = currentGameKey;
    gameEntryModalMode = "exit";
    gameEntryModalLocked = false;

    if (gameEntryModalQuestion) {
      gameEntryModalQuestion.textContent =
        "Êtes-vous sûr de vouloir sortir du jeu ?";
    }

    if (gameEntryModalPrice) {
      gameEntryModalPrice.textContent = "Votre progression sera effacée.";
    }

    if (gameEntryModalError) {
      gameEntryModalError.textContent = "";
      gameEntryModalError.classList.remove("show");
    }

    if (gameEntryModal) {
      gameEntryModal.classList.add("show");
      gameEntryModal.setAttribute("aria-hidden", "false");
    }
  }

  function closeGameEntryModal() {
    if (gameEntryModal) {
      gameEntryModal.classList.remove("show");
      gameEntryModal.setAttribute("aria-hidden", "true");
    }

    if (gameEntryModalError) {
      gameEntryModalError.textContent = "";
      gameEntryModalError.classList.remove("show");
    }

    pendingGameKey = null;
    gameEntryModalLocked = false;
    gameEntryModalMode = null;
  }

  if (gameEntryModalCancel) {
    gameEntryModalCancel.addEventListener("click", () => {
      if (gameEntryModalLocked) return;

      closeGameEntryModal();
    });
  }

  if (gameEntryModalConfirm) {
    gameEntryModalConfirm.addEventListener("click", () => {
      if (gameEntryModalLocked) return;

      /* CONFIRMATION DE SORTIE */
      if (gameEntryModalMode === "exit") {
        gameEntryModalLocked = true;
        exitConfirmationBypass = true;

        playStartGameButtonSfx();

        closeGameEntryModal();

        sortir.dataset.exitConfirmed = "true";

        sortir.click();

        exitConfirmationBypass = false;

        return;
      }

      /* CONFIRMATION D’ENTRÉE */

      if (gameEntryModalMode !== "entry") return;
      if (!pendingGameKey) return;

      const gameKey = pendingGameKey;
      const price = GAME_ENTRY_PRICES[gameKey];

      const player = window.SMQ_RETRAITES?.[currentIndex];

      if (!player || typeof price !== "number") {
        return;
      }

      if (player.argent < price) {
        if (gameEntryModalError) {
          gameEntryModalError.textContent =
            "Vous n'avez pas assez d'argent pour entrer dans ce jeu.";

          gameEntryModalError.classList.add("show");
        }

        return;
      }

      gameEntryModalLocked = true;

      const hasPaid = debitPlayerMoney(player, price, updatePlayer);

      if (!hasPaid) {
        gameEntryModalLocked = false;
        return;
      }

      closeGameEntryModal();

      goToSeq3(gameKey);
    });
  }

  /* -------------------------------------------------------- */
  /* SLIDE IN / OUT                                           */
  /* -------------------------------------------------------- */

  function slideOut() {
    if (playerName) playerName.classList.remove("slide-in");
    if (playerMoney) playerMoney.classList.remove("slide-in");
  }

  function slideIn() {
    const mallShops = ["vinyls", "books", "audio", "fashion"];
    const isMallShop = mallShops.includes(currentGameKey);

    if (isMallShop) return;

    setTimeout(() => {
      if (playerName) playerName.classList.add("slide-in");
    }, 200);

    setTimeout(() => {
      if (playerMoney) playerMoney.classList.add("slide-in");
    }, 450);
  }

  /* -------------------------------------------------------- */
  /* UPDATE PLAYER                                            */
  /* -------------------------------------------------------- */

  function updatePlayer() {
    const r = window.SMQ_RETRAITES[currentIndex];
    const nameEl = document.querySelector(".player-name");
    const moneyEl = document.querySelector(".player-money");
    if (!r) return;
    if (nameEl) nameEl.textContent = r.nom;
    if (moneyEl) {
      const montant =
        r.argent % 1 === 0
          ? r.argent.toFixed(0)
          : r.argent.toFixed(2).replace(".", ",");
      moneyEl.textContent = montant + " $";
    }
  }

  /* -------------------------------------------------------- */
  /* SORTIR / START GAME                                      */
  /* -------------------------------------------------------- */

  function hideSortir() {
    if (sortir) {
      sortir.style.opacity = "0";
      sortir.style.pointerEvents = "none";
    }
  }

  function showSortir() {
    if (sortir) {
      sortir.style.opacity = "1";
      sortir.style.pointerEvents = "all";
    }
  }

  function hideStartGame() {
    if (startGame) startGame.classList.remove("visible");
  }

  function showDartsBlueprint() {
    const blueprint = document.getElementById("blueprint-darts");

    if (!blueprint) return;

    blueprint.style.display = "block";

    setTimeout(() => {
      blueprint.style.opacity = "1";
    }, 500);
  }

  function hideDartsBlueprint() {
    const blueprint = document.getElementById("blueprint-darts");

    if (!blueprint) return;

    blueprint.style.display = "none";
    blueprint.style.opacity = "0";
  }

  function showTetrisBlueprint() {
    const blueprint = document.getElementById("blueprint-tetris");

    if (!blueprint) return;

    blueprint.style.display = "block";

    setTimeout(() => {
      blueprint.style.opacity = "1";
    }, 500);
  }

  function hideTetrisBlueprint() {
    const blueprint = document.getElementById("blueprint-tetris");

    if (!blueprint) return;

    blueprint.style.display = "none";
    blueprint.style.opacity = "0";
  }

  function showMemoryBlueprint() {
    const blueprint = document.getElementById("blueprint-memory");

    if (!blueprint) return;

    blueprint.style.display = "block";

    setTimeout(() => {
      blueprint.style.opacity = "1";
    }, 500);
  }

  function hideMemoryBlueprint() {
    const blueprint = document.getElementById("blueprint-memory");

    if (!blueprint) return;

    blueprint.style.display = "none";
    blueprint.style.opacity = "0";
  }

  function showCasinoBlueprint(gameKey) {
    const blueprints = ["videoPoker", "slotMachine", "luckyWheel", "dice"];

    blueprints.forEach((key) => {
      const el = document.getElementById(`blueprint-${key}`);

      if (!el) return;

      if (key === gameKey) {
        el.style.display = "block";

        setTimeout(() => {
          el.style.opacity = "1";
        }, 500);
      } else {
        el.style.display = "none";
        el.style.opacity = "0";
      }
    });
  }

  function hideCasinoBlueprint() {
    const blueprints = ["videoPoker", "slotMachine", "luckyWheel", "dice"];

    blueprints.forEach((key) => {
      const el = document.getElementById(`blueprint-${key}`);

      if (!el) return;

      el.style.display = "none";
      el.style.opacity = "0";
    });
  }

  function startDartsIntro() {
    const scoreboard = document.querySelector(".coney-darts-scoreboard");
    const actions = document.querySelector(".coney-darts-actions");
    const notifications = document.querySelector(".coney-darts-notifications");
    const gameArea = document.querySelector(".coney-darts-game");

    const newGameBtn = document.getElementById("darts-new-game-btn");

    if (!scoreboard || !actions || !notifications || !gameArea) return;

    /* RESET VISUEL */

    scoreboard.style.animation = "none";
    actions.style.animation = "none";
    notifications.style.animation = "none";
    gameArea.style.animation = "none";

    scoreboard.style.opacity = "0";
    actions.style.opacity = "0";
    notifications.style.opacity = "0";
    gameArea.style.opacity = "0";

    document.querySelectorAll(".darts-score-label").forEach((label) => {
      label.style.animation = "none";
      label.style.opacity = "0";
    });

    document.querySelectorAll(".darts-score-value").forEach((value) => {
      value.style.animation = "none";
      value.style.opacity = "0";
    });

    if (newGameBtn) {
      newGameBtn.style.animation = "none";
      newGameBtn.style.opacity = "0";
      newGameBtn.style.pointerEvents = "none";
    }

    void scoreboard.offsetWidth;

    /* SCOREBOARD */

    setTimeout(() => {
      scoreboard.style.animation = "dartsSlideInLeft 3s forwards";
    }, 800);

    /* ACTIONS */

    setTimeout(() => {
      actions.style.animation = "dartsSlideInRight 0.5s forwards";
    }, 1500);

    /* LABELS SCOREBOARD */

    setTimeout(() => {
      document
        .querySelectorAll(".darts-score-label")
        .forEach((label, index) => {
          setTimeout(() => {
            label.style.animation = "dartsLabelFadeIn 0.2s forwards";
          }, index * 200);
        });
    }, 2000);

    /* VALEURS SCOREBOARD */

    setTimeout(() => {
      document
        .querySelectorAll(".darts-score-value")
        .forEach((value, index) => {
          setTimeout(() => {
            value.style.animation = "dartsScoreSlideIn 0.5s forwards";
          }, index * 200);
        });
    }, 2500);

    /* BOUTON */

    setTimeout(() => {
      if (newGameBtn) {
        newGameBtn.style.animation = "dartsButtonFadeIn 2s forwards";
      }
    }, 3500);

    /* GAME AREA */

    setTimeout(() => {
      if (currentMode !== "seq3" || currentGameKey !== "darts") {
        return;
      }

      gameArea.style.animation = "dartsFadeIn 2s forwards";

      const dartsImage = document.querySelector(".darts-image");

      if (dartsImage) {
        dartsImage.style.opacity = "1";
      }

      fadeInDartsMusic();
    }, 4000);

    /* NOTIFICATIONS */

    setTimeout(() => {
      notifications.style.animation = "dartsSlideInBottom 1s forwards";
    }, 5000);

    /* MESSAGE + ACTIVATION NOUVELLE PARTIE */

    setTimeout(() => {
      notifications.innerHTML =
        'Bienvenue au&nbsp;<span class="darts-notif-smq">SMQ Darts Game</span>&nbsp;!&nbsp; Commencer une nouvelle partie ?&nbsp;&nbsp;<span class="darts-notif-price">2 $</span>';

      if (newGameBtn) {
        newGameBtn.style.opacity = "1";
        newGameBtn.style.pointerEvents = "auto";

        newGameBtn.style.animation = "";

        newGameBtn.classList.add("blink");
      }
    }, 6000);
  }

  function resetDartsIntro() {
    const elements = document.querySelectorAll(
      ".coney-darts-scoreboard, \
.coney-darts-actions, \
.coney-darts-notifications, \
.coney-darts-game, \
.darts-score-label, \
.darts-score-value, \
.darts-action-btn",
    );

    elements.forEach((element) => {
      element.style.animation = "none";
      element.style.opacity = "0";

      void element.offsetWidth;

      element.style.animation = "";
    });

    const notif = document.querySelector(".coney-darts-notifications");

    if (notif) {
      notif.textContent = "";
    }

    const newGameBtn = document.getElementById("darts-new-game-btn");

    if (newGameBtn) {
      newGameBtn.style.animation = "none";
      newGameBtn.style.pointerEvents = "none";
      newGameBtn.style.opacity = "0";
    }
  }

  function startTetrisIntro() {
    const scoreboard = document.querySelector(".coney-tetris-scoreboard");
    const actions = document.querySelector(".coney-tetris-actions");
    const notifications = document.querySelector(".coney-tetris-notifications");
    const gameArea = document.querySelector(".coney-tetris-game");

    const newGameBtn = document.getElementById("tetris-new-game-btn");

    const wrapper = document.getElementById("tetris-wrapper");

    if (!scoreboard || !actions || !notifications || !gameArea) {
      return;
    }

    /* RESET VISUEL */

    scoreboard.style.animation = "none";
    actions.style.animation = "none";
    notifications.style.animation = "none";
    gameArea.style.animation = "none";

    scoreboard.style.opacity = "0";
    actions.style.opacity = "0";
    notifications.style.opacity = "0";
    gameArea.style.opacity = "0";

    if (wrapper) {
      wrapper.classList.remove("show");
    }

    document
      .querySelectorAll(".tetris-score-label, .tetris-score-detail")
      .forEach((label) => {
        label.style.animation = "none";
        label.style.opacity = "0";
      });

    document.querySelectorAll(".tetris-score-value").forEach((value) => {
      value.style.animation = "none";
      value.style.opacity = "0";
    });

    if (newGameBtn) {
      newGameBtn.classList.remove("blink");
      newGameBtn.style.animation = "none";
      newGameBtn.style.opacity = "0";
      newGameBtn.style.pointerEvents = "none";
    }

    void scoreboard.offsetWidth;

    /* SCOREBOARD */

    setTimeout(() => {
      scoreboard.style.animation = "tetrisSlideInLeft 3s forwards";
    }, 800);

    /* ACTIONS */

    setTimeout(() => {
      actions.style.animation = "tetrisSlideInRight 0.5s forwards";
    }, 1500);

    /* LABELS */

    setTimeout(() => {
      document
        .querySelectorAll(".tetris-score-label, .tetris-score-detail")
        .forEach((label, index) => {
          setTimeout(() => {
            label.style.animation = "tetrisLabelFadeIn 0.2s forwards";
          }, index * 120);
        });
    }, 2000);

    /* VALEURS */

    setTimeout(() => {
      document
        .querySelectorAll(".tetris-score-value")
        .forEach((value, index) => {
          setTimeout(() => {
            value.style.animation = "tetrisScoreSlideIn 0.5s forwards";
          }, index * 200);
        });
    }, 2500);

    /* BOUTON */

    setTimeout(() => {
      if (newGameBtn) {
        newGameBtn.style.animation = "tetrisButtonFadeIn 2s forwards";
      }
    }, 3500);

    /* GAME AREA + MUSIQUE */

    setTimeout(() => {
      if (currentMode !== "seq3" || currentGameKey !== "tetris") {
        return;
      }

      gameArea.style.animation = "tetrisFadeIn 2s forwards";

      if (wrapper) {
        wrapper.classList.add("show");
      }

      fadeInTetrisMusic();
    }, 4000);

    /* NOTIFICATIONS */

    setTimeout(() => {
      notifications.style.animation = "tetrisSlideInBottom 1s forwards";
    }, 5000);

    /* MESSAGE + ACTIVATION */

    setTimeout(() => {
      if (currentMode !== "seq3" || currentGameKey !== "tetris") {
        return;
      }
      notifications.innerHTML =
        'Bienvenue au&nbsp;<span class="tetris-notif-smq">SMQ Tetris Game</span>&nbsp;!&nbsp; Commencer une nouvelle partie ?&nbsp;&nbsp;<span class="tetris-notif-price">2 $</span>';

      if (newGameBtn) {
        newGameBtn.style.opacity = "1";
        newGameBtn.style.pointerEvents = "auto";

        newGameBtn.style.animation = "";

        newGameBtn.classList.add("blink");
      }
    }, 6000);
  }

  function resetTetrisIntro() {
    const elements = document.querySelectorAll(
      ".coney-tetris-scoreboard, \
.coney-tetris-actions, \
.coney-tetris-notifications, \
.coney-tetris-game, \
.tetris-score-label, \
.tetris-score-detail, \
.tetris-score-value, \
.tetris-action-btn",
    );

    elements.forEach((element) => {
      element.style.animation = "none";
      element.style.opacity = "0";

      void element.offsetWidth;

      element.style.animation = "";
    });

    /* NOTIFICATIONS */

    const notifications = document.querySelector(".coney-tetris-notifications");

    if (notifications) {
      notifications.innerHTML = "";
    }

    /* BOUTON NOUVELLE PARTIE */

    const newGameBtn = document.getElementById("tetris-new-game-btn");

    if (newGameBtn) {
      newGameBtn.classList.remove("blink");
      newGameBtn.style.animation = "none";
      newGameBtn.style.pointerEvents = "none";
      newGameBtn.style.opacity = "0";
    }

    /* WRAPPER */

    const wrapper = document.getElementById("tetris-wrapper");

    if (wrapper) {
      wrapper.classList.remove("show");
    }

    /* GAME OVER */

    const gameOver = document.getElementById("tetris-game-over");

    if (gameOver) {
      gameOver.classList.remove("show");
    }

    /* SCORE GAME OVER */

    const gameOverScore = document.getElementById("tetris-go-score");

    if (gameOverScore) {
      gameOverScore.innerHTML = "";
    }

    /* NOTIFICATION DE LIGNE */

    const lineNotif = document.getElementById("t-line-notif");

    if (lineNotif) {
      lineNotif.classList.remove("flash");
      lineNotif.textContent = "";
    }

    /* STATS */

    const score = document.getElementById("t-score-val");

    const level = document.getElementById("t-level-val");

    const lines = document.getElementById("t-lines-val");

    if (score) {
      score.textContent = "0";
    }

    if (level) {
      level.textContent = "1";
    }

    if (lines) {
      lines.textContent = "0";
    }

    /* TIMER */

    const timer = document.getElementById("tetris-timer-value");

    if (timer) {
      timer.textContent = "00:00";
    }
  }

  function startMemoryIntro() {
    const scoreboard = document.querySelector(".coney-memory-scoreboard");

    const actions = document.querySelector(".coney-memory-actions");

    const notifications = document.querySelector(".coney-memory-notifications");

    const gameArea = document.querySelector(".coney-memory-game");

    const newGameBtn = document.getElementById("memory-new-game-btn");

    const wrapper = document.getElementById("memory-wrapper");

    if (!scoreboard || !actions || !notifications || !gameArea) {
      return;
    }

    /* RESET VISUEL */

    scoreboard.style.animation = "none";
    actions.style.animation = "none";
    notifications.style.animation = "none";
    gameArea.style.animation = "none";

    scoreboard.style.opacity = "0";
    actions.style.opacity = "0";
    notifications.style.opacity = "0";
    gameArea.style.opacity = "0";

    notifications.innerHTML = "";

    if (wrapper) {
      wrapper.classList.remove("show");
    }

    document
      .querySelectorAll(".memory-score-label, .memory-score-detail")
      .forEach((label) => {
        label.style.animation = "none";
        label.style.opacity = "0";
      });

    document.querySelectorAll(".memory-score-value").forEach((value) => {
      value.style.animation = "none";
      value.style.opacity = "0";
    });

    if (newGameBtn) {
      newGameBtn.classList.remove("blink");
      newGameBtn.style.animation = "none";
      newGameBtn.style.opacity = "0";
      newGameBtn.style.pointerEvents = "none";
    }

    void scoreboard.offsetWidth;

    /* SCOREBOARD */

    setTimeout(() => {
      if (currentMode !== "seq3" || currentGameKey !== "memory") {
        return;
      }

      scoreboard.style.animation = "memorySlideInLeft 3s forwards";
    }, 800);

    /* ACTIONS */

    setTimeout(() => {
      if (currentMode !== "seq3" || currentGameKey !== "memory") {
        return;
      }

      actions.style.animation = "memorySlideInRight 0.5s forwards";
    }, 1500);

    /* LABELS */

    setTimeout(() => {
      if (currentMode !== "seq3" || currentGameKey !== "memory") {
        return;
      }

      document
        .querySelectorAll(".memory-score-label, .memory-score-detail")
        .forEach((label, index) => {
          setTimeout(() => {
            if (currentMode === "seq3" && currentGameKey === "memory") {
              label.style.animation = "memoryLabelFadeIn 0.2s forwards";
            }
          }, index * 120);
        });
    }, 2000);

    /* VALEURS */

    setTimeout(() => {
      if (currentMode !== "seq3" || currentGameKey !== "memory") {
        return;
      }

      document
        .querySelectorAll(".memory-score-value")
        .forEach((value, index) => {
          setTimeout(() => {
            if (currentMode === "seq3" && currentGameKey === "memory") {
              value.style.animation = "memoryScoreSlideIn 0.5s forwards";
            }
          }, index * 200);
        });
    }, 2500);

    /* BOUTON */

    setTimeout(() => {
      if (currentMode === "seq3" && currentGameKey === "memory" && newGameBtn) {
        newGameBtn.style.animation = "memoryButtonFadeIn 2s forwards";
      }
    }, 3500);

    /* GAME AREA + FADE-IN MUSIQUE */

    setTimeout(() => {
      if (currentMode !== "seq3" || currentGameKey !== "memory") {
        return;
      }

      gameArea.style.animation = "memoryFadeIn 2s forwards";

      if (wrapper) {
        wrapper.classList.add("show");
      }

      fadeInMemoryMusic();
    }, 4000);

    /* NOTIFICATIONS */

    setTimeout(() => {
      if (currentMode !== "seq3" || currentGameKey !== "memory") {
        return;
      }

      notifications.style.animation = "memorySlideInBottom 1s forwards";
    }, 5000);

    /* MESSAGE + BOUTON NOUVELLE PARTIE */

    setTimeout(() => {
      if (currentMode !== "seq3" || currentGameKey !== "memory") {
        return;
      }

      notifications.innerHTML =
        'Bienvenue au&nbsp;<span class="memory-notif-smq">SMQ Memory Game</span>&nbsp;!&nbsp; Commencer une nouvelle partie ?&nbsp;&nbsp;<span class="memory-notif-price">2 $</span>';

      if (newGameBtn) {
        newGameBtn.style.opacity = "1";
        newGameBtn.style.pointerEvents = "auto";
        newGameBtn.style.animation = "";
        newGameBtn.classList.add("blink");
      }
    }, 6000);
  }

  function resetMemoryIntro() {
    const elements = document.querySelectorAll(
      ".coney-memory-scoreboard, \
.coney-memory-actions, \
.coney-memory-notifications, \
.coney-memory-game, \
.memory-score-label, \
.memory-score-detail, \
.memory-score-value, \
.memory-action-btn",
    );

    elements.forEach((element) => {
      element.style.animation = "none";
      element.style.opacity = "0";

      void element.offsetWidth;

      element.style.animation = "";
    });

    const notifications = document.querySelector(".coney-memory-notifications");

    if (notifications) {
      notifications.innerHTML = "";
    }

    const newGameBtn = document.getElementById("memory-new-game-btn");

    if (newGameBtn) {
      newGameBtn.classList.remove("blink");
      newGameBtn.style.animation = "none";
      newGameBtn.style.pointerEvents = "none";
      newGameBtn.style.opacity = "0";
    }

    const wrapper = document.getElementById("memory-wrapper");

    if (wrapper) {
      wrapper.classList.remove("show");
    }

    resetMemoryGame();
  }

  function startVideoPokerIntro() {
    const scoreboard = document.querySelector(".casino-vp-scoreboard");
    const actions = document.querySelector(".casino-vp-actions");
    const notifications = document.querySelector(".casino-vp-notifications");
    const gameArea = document.querySelector(".casino-vp-game");

    if (!scoreboard || !actions || !notifications || !gameArea) return;

    scoreboard.style.opacity = "0";
    actions.style.opacity = "0";
    notifications.style.opacity = "0";
    gameArea.style.opacity = "0";

    setTimeout(() => {
      scoreboard.style.animation = "vpSlideInLeft 3s forwards";
    }, 800);

    setTimeout(() => {
      actions.style.animation = "vpSlideInRight 0.5s forwards";
    }, 1500);

    setTimeout(() => {
      notifications.style.animation = "vpSlideInBottom 1s forwards";
    }, 5000);

    setTimeout(() => {
      gameArea.style.animation = "vpFadeIn 2s forwards";
    }, 4000);

    setTimeout(() => {
      showVpComboLabels();
    }, 2000);

    setTimeout(() => {
      showVpComboScores();
    }, 2500);

    setTimeout(() => {
      showVpButtons();
    }, 3500);

    setTimeout(() => {
      showVpWelcome();
    }, 6000);

    setTimeout(() => {
      fadeInVideoPokerMusic();
    }, 4000);
  }

  function resetVideoPokerIntro() {
    const elements = document.querySelectorAll(
      ".casino-vp-scoreboard, \
.casino-vp-actions, \
.casino-vp-notifications, \
.casino-vp-game, \
.vp-combo-label, \
.vp-combo-score, \
.vp-action-btn",
    );

    elements.forEach((element) => {
      element.style.animation = "none";
      element.style.opacity = "0";

      void element.offsetWidth;

      element.style.animation = "";
    });
  }

  function startSlotMachineIntro() {
    const scoreboard = document.querySelector(".casino-sm-scoreboard");
    const actions = document.querySelector(".casino-sm-actions");
    const notifications = document.querySelector(".casino-sm-notifications");
    const gameArea = document.querySelector(".casino-sm-game");

    if (!scoreboard || !actions || !notifications || !gameArea) return;

    scoreboard.style.opacity = "0";
    actions.style.opacity = "0";
    notifications.style.opacity = "0";
    gameArea.style.opacity = "0";

    setTimeout(() => {
      scoreboard.style.animation = "smSlideInLeft 3s forwards";
    }, 800);

    setTimeout(() => {
      actions.style.animation = "smSlideInRight 0.5s forwards";
    }, 1500);

    setTimeout(() => {
      notifications.style.animation = "smSlideInBottom 1s forwards";
    }, 5000);

    setTimeout(() => {
      gameArea.style.animation = "smFadeIn 2s forwards";
    }, 4000);

    setTimeout(() => {
      showSmComboLabels();
    }, 2000);

    setTimeout(() => {
      showSmComboScores();
    }, 2500);

    setTimeout(() => {
      showSmButtons();
    }, 3500);

    setTimeout(() => {
      showSmWelcome();
    }, 6000);

    setTimeout(() => {
      fadeInSlotMachineMusic();
    }, 4000);
  }

  function resetSlotMachineIntro() {
    const elements = document.querySelectorAll(
      ".casino-sm-scoreboard, \
.casino-sm-actions, \
.casino-sm-notifications, \
.casino-sm-game, \
.sm-combo-label, \
.sm-combo-score, \
.sm-action-btn",
    );

    elements.forEach((element) => {
      element.style.animation = "none";
      element.style.opacity = "0";

      void element.offsetWidth;

      element.style.animation = "";
    });
  }

  let luckyWheelIntroTimeouts = [];

  function clearLuckyWheelIntroTimeouts() {
    luckyWheelIntroTimeouts.forEach((timeout) => clearTimeout(timeout));
    luckyWheelIntroTimeouts = [];
  }

  function lwIntroTimeout(callback, delay) {
    const timeout = setTimeout(callback, delay);
    luckyWheelIntroTimeouts.push(timeout);
  }

  function startLuckyWheelIntro() {
    clearLuckyWheelIntroTimeouts();
    resetLuckyWheelSfx();

    const scoreboard = document.querySelector(".casino-lw-scoreboard");
    const actions = document.querySelector(".casino-lw-actions");
    const notifications = document.querySelector(".casino-lw-notifications");
    const gameArea = document.querySelector(".casino-lw-game");

    const newGameBtn = document.getElementById("lw-new-game-btn");
    const spinBtn = document.getElementById("lw-spin-btn");

    if (!scoreboard || !actions || !notifications || !gameArea) return;

    notifications.innerHTML = "";

    scoreboard.style.animation = "none";
    actions.style.animation = "none";
    notifications.style.animation = "none";
    gameArea.style.animation = "none";

    scoreboard.style.opacity = "0";
    actions.style.opacity = "0";
    notifications.style.opacity = "0";
    gameArea.style.opacity = "0";

    document.querySelectorAll(".lw-gain-label").forEach((label) => {
      label.style.animation = "none";
      label.style.opacity = "0";
    });

    document.querySelectorAll(".lw-gain-score").forEach((score) => {
      score.style.animation = "none";
      score.style.opacity = "0";
    });

    document.querySelectorAll(".lw-action-btn").forEach((button) => {
      button.style.animation = "none";
      button.style.opacity = "0";
    });

    if (newGameBtn) {
      newGameBtn.disabled = true;
      newGameBtn.style.pointerEvents = "none";
    }

    if (spinBtn) {
      spinBtn.disabled = true;
      spinBtn.style.pointerEvents = "none";
    }

    void scoreboard.offsetWidth;

    lwIntroTimeout(() => {
      scoreboard.style.animation = "lwSlideInLeft 3s forwards";
    }, 800);

    lwIntroTimeout(() => {
      actions.style.animation = "lwSlideInRight 0.5s forwards";
    }, 1500);

    lwIntroTimeout(() => {
      document.querySelectorAll(".lw-gain-label").forEach((label, index) => {
        lwIntroTimeout(() => {
          label.style.animation = "lwLabelFadeIn 0.2s forwards";
        }, index * 200);
      });
    }, 2000);

    lwIntroTimeout(() => {
      document.querySelectorAll(".lw-gain-score").forEach((score, index) => {
        lwIntroTimeout(() => {
          score.style.animation = "lwScoreSlideIn 0.5s forwards";
        }, index * 200);
      });
    }, 2500);

    lwIntroTimeout(() => {
      document.querySelectorAll(".lw-action-btn").forEach((button, index) => {
        lwIntroTimeout(() => {
          button.style.animation = "lwButtonFadeIn 2s forwards";
        }, index * 500);
      });
    }, 3500);

    lwIntroTimeout(() => {
      gameArea.style.animation = "lwFadeIn 2s forwards";
      fadeInLuckyWheelMusic();
    }, 4000);

    lwIntroTimeout(() => {
      notifications.style.animation = "lwSlideInBottom 1s forwards";
    }, 5000);

    lwIntroTimeout(() => {
      notifications.innerHTML =
        'Bienvenue à la&nbsp;<span class="lw-notif-smq">SMQ Lucky Wheel</span> !&nbsp;&nbsp;Commencer une nouvelle partie ?&nbsp;&nbsp;<span class="lw-notif-price">2 $</span>';

      if (newGameBtn) {
        newGameBtn.disabled = false;
        newGameBtn.style.pointerEvents = "auto";
        newGameBtn.style.opacity = "1";
        newGameBtn.style.animation = "lwNewGameBlink 2s infinite";
      }

      if (spinBtn) {
        spinBtn.disabled = true;
        spinBtn.style.pointerEvents = "none";
        spinBtn.style.opacity = "1";
        spinBtn.style.animation = "none";
      }
    }, 6000);
  }

  function resetLuckyWheelIntro() {
    clearLuckyWheelIntroTimeouts();

    const elements = document.querySelectorAll(
      ".casino-lw-scoreboard, \
.casino-lw-actions, \
.casino-lw-notifications, \
.casino-lw-game, \
.lw-gain-label, \
.lw-gain-score, \
.lw-action-btn",
    );

    elements.forEach((element) => {
      element.style.animation = "none";
      element.style.opacity = "0";
    });

    const notif = document.querySelector(".casino-lw-notifications");

    if (notif) {
      notif.innerHTML = "";
    }
  }

  function startDiceIntro() {
    resetDiceGameSfx();
    resetDiceGame();
    const scoreboard = document.querySelector(".casino-dice-scoreboard");
    const actions = document.querySelector(".casino-dice-actions");
    const notifications = document.querySelector(".casino-dice-notifications");
    const gameArea = document.querySelector(".casino-dice-game");

    const newGameBtn = document.getElementById("dice-new-game-btn");
    const rollBtn = document.getElementById("dice-roll-btn");

    if (!scoreboard || !actions || !notifications || !gameArea) return;

    notifications.innerHTML = "";

    scoreboard.style.animation = "none";
    actions.style.animation = "none";
    notifications.style.animation = "none";
    gameArea.style.animation = "none";

    scoreboard.style.opacity = "0";
    actions.style.opacity = "0";
    notifications.style.opacity = "0";
    gameArea.style.opacity = "0";

    document.querySelectorAll(".dice-gain-label").forEach((label) => {
      label.style.animation = "none";
      label.style.opacity = "0";
    });

    document.querySelectorAll(".dice-combo-label").forEach((label) => {
      label.style.animation = "none";
      label.style.opacity = "0";
    });

    document.querySelectorAll(".dice-gain-score").forEach((score) => {
      score.style.animation = "none";
      score.style.opacity = "0";
    });

    document.querySelectorAll(".dice-action-btn").forEach((button) => {
      button.style.animation = "none";
      button.style.opacity = "0";
    });

    document.querySelectorAll(".dice-img").forEach((die) => {
      die.classList.remove("visible");
      die.classList.remove("dice-show");
      die.classList.remove("dice-hide");
    });

    if (newGameBtn) {
      newGameBtn.disabled = true;
      newGameBtn.style.pointerEvents = "none";
    }

    if (rollBtn) {
      rollBtn.disabled = true;
      rollBtn.style.pointerEvents = "none";
    }

    void scoreboard.offsetWidth;

    setTimeout(() => {
      scoreboard.style.animation = "diceSlideInLeft 3s forwards";
    }, 800);

    setTimeout(() => {
      actions.style.animation = "diceSlideInRight 0.5s forwards";
    }, 1500);

    setTimeout(() => {
      document.querySelectorAll(".dice-gain-label").forEach((label, index) => {
        setTimeout(() => {
          label.style.animation = "diceLabelFadeIn 0.2s forwards";
        }, index * 200);
      });

      document.querySelectorAll(".dice-combo-label").forEach((label, index) => {
        setTimeout(() => {
          label.style.animation = "diceLabelFadeIn 0.2s forwards";
        }, index * 200);
      });
    }, 2000);

    setTimeout(() => {
      document.querySelectorAll(".dice-gain-score").forEach((score, index) => {
        setTimeout(() => {
          score.style.animation = "diceScoreSlideIn 0.5s forwards";
        }, index * 200);
      });
    }, 2500);

    setTimeout(() => {
      document.querySelectorAll(".dice-action-btn").forEach((button, index) => {
        setTimeout(() => {
          button.style.animation = "diceButtonFadeIn 2s forwards";
        }, index * 500);
      });
    }, 3500);

    setTimeout(() => {
      gameArea.style.animation = "diceFadeIn 2s forwards";
      fadeInDiceGameMusic();
    }, 4000);

    setTimeout(() => {
      notifications.style.animation = "diceSlideInBottom 1s forwards";
    }, 5000);

    setTimeout(() => {
      notifications.innerHTML =
        'Bienvenue au&nbsp;<span class="darts-notif-smq">SMQ Dice Game</span>&nbsp;!&nbsp; Commencer une nouvelle partie ?&nbsp;&nbsp;<span class="darts-notif-price">2 $</span>';

      if (newGameBtn) {
        newGameBtn.disabled = false;
        newGameBtn.style.pointerEvents = "auto";
        newGameBtn.style.opacity = "1";
        newGameBtn.style.animation = "diceNewGameBlink 2s infinite";
      }

      if (rollBtn) {
        rollBtn.disabled = true;
        rollBtn.style.pointerEvents = "none";
        rollBtn.style.opacity = "1";
        rollBtn.style.animation = "none";
      }
    }, 6000);
  }

  function showVpComboLabels() {
    document.querySelectorAll(".vp-combo-label").forEach((label, index) => {
      setTimeout(() => {
        label.style.animation = "vpLabelFadeIn 0.2s forwards";
      }, index * 200);
    });
  }

  function showVpComboScores() {
    document.querySelectorAll(".vp-combo-score").forEach((score, index) => {
      setTimeout(() => {
        score.style.animation = "vpScoreSlideIn 0.5s forwards";
      }, index * 200);
    });
  }

  function showVpButtons() {
    document.querySelectorAll(".vp-action-btn").forEach((button, index) => {
      setTimeout(() => {
        button.style.animation = "vpButtonFadeIn 2s forwards";
      }, index * 500);
    });
  }

  function showVpWelcome() {
    const notif = document.querySelector(".casino-vp-notifications");
    const newGameBtn = document.querySelectorAll(".vp-action-btn")[1];

    if (notif) {
      notif.innerHTML =
        'Bienvenue au&nbsp;<span class="vp-notif-smq">SMQ Video Poker</span> !&nbsp;&nbsp;Commencer une nouvelle partie ?&nbsp;&nbsp;<span class="vp-notif-price">2 $</span>';
    }

    if (newGameBtn) {
      setTimeout(() => {
        newGameBtn.style.opacity = "1";
        newGameBtn.style.animation = "vpNewGameBlink 2s infinite";
      }, 800);
    }
  }

  function showSmComboLabels() {
    document.querySelectorAll(".sm-combo-label").forEach((label, index) => {
      setTimeout(() => {
        label.style.animation = "smLabelFadeIn 0.2s forwards";
      }, index * 200);
    });
  }

  function showSmComboScores() {
    document.querySelectorAll(".sm-combo-score").forEach((score, index) => {
      setTimeout(() => {
        score.style.animation = "smScoreSlideIn 0.5s forwards";
      }, index * 200);
    });
  }

  function showSmButtons() {
    document.querySelectorAll(".sm-action-btn").forEach((button, index) => {
      setTimeout(() => {
        button.style.animation = "smButtonFadeIn 2s forwards";
      }, index * 500);
    });
  }

  function showSmWelcome() {
    const notif = document.querySelector(".casino-sm-notifications");
    const newGameBtn = document.querySelectorAll(".sm-action-btn")[1];

    if (notif) {
      notif.innerHTML =
        'Bienvenue au&nbsp;<span class="sm-notif-smq">SMQ Slot Machine</span> !&nbsp;&nbsp;Commencer une nouvelle partie ?&nbsp;&nbsp;<span class="sm-notif-price">2 $</span>';
    }

    if (newGameBtn) {
      setTimeout(() => {
        newGameBtn.style.opacity = "1";
        newGameBtn.style.animation = "smNewGameBlink 2s infinite";
      }, 800);
    }
  }

  function showVpGameBlueprint() {
    const deck = document.querySelector(".vp-deck");
    const cards = document.querySelector(".vp-cards");

    if (deck) {
      deck.style.animation = "vpFadeIn 1s forwards";
    }

    if (cards) {
      cards.style.animation = "vpFadeIn 1s forwards";
    }
  }

  function stopVpNewGameBlink() {
    const newGameBtn = document.querySelectorAll(".vp-action-btn")[1];

    if (newGameBtn) {
      newGameBtn.classList.remove("blink");
      newGameBtn.style.animation = "none";
      newGameBtn.style.opacity = "1";
      newGameBtn.style.color = "white";
      newGameBtn.style.boxShadow = "0 0 5px 0 transparent";
    }
  }

  function stopSmNewGameBlink() {
    const newGameBtn = document.querySelectorAll(".sm-action-btn")[1];

    if (newGameBtn) {
      newGameBtn.classList.remove("blink");
      newGameBtn.style.animation = "none";
      newGameBtn.style.opacity = "1";
      newGameBtn.style.color = "white";
      newGameBtn.style.boxShadow = "0 0 5px 0 transparent";
    }
  }

  function showStartGame() {
    if (startGame) startGame.classList.add("visible");
  }

  /* -------------------------------------------------------- */
  /* RULES BOX                                                */
  /* -------------------------------------------------------- */

  function removeRules() {
    if (rulesBox) {
      rulesBox.remove();
      rulesBox = null;
    }
  }

  function createRules(gameKey) {
    removeRules();

    rulesBox = document.createElement("div");
    rulesBox.style.position = "absolute";
    rulesBox.style.right = "5%";
    rulesBox.style.top = "50%";
    rulesBox.style.transform = "translateX(200px) translateY(-50%)";
    rulesBox.style.display = "flex";
    rulesBox.style.flexDirection = "column";
    rulesBox.style.gap = "10px";
    rulesBox.style.fontSize = "14px";
    rulesBox.style.color = "white";
    rulesBox.style.textAlign = "left";
    rulesBox.style.alignItems = "flex-start";
    rulesBox.style.opacity = "0";
    rulesBox.style.transition = "all .6s ease";

    const rules = GAMES[gameKey]?.rules || [];
    rules.forEach((rule) => {
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.gap = "6px";
      div.style.lineHeight = "1.4";

      // Remplace <arrow>X</arrow> par un span stylisé
      const html = rule.replace(/<arrow>(.*?)<\/arrow>/g, (_, txt) => {
        const isLong = txt.length > 2;
        return `<span style="
          font-size: ${isLong ? "12px" : "20px"};
          font-weight: bold;
          color: orangered;
          text-shadow: 0 0 8px orangered, 0 0 16px rgba(255,69,0,0.6);
          display: inline-block;
          line-height: 1;
          padding: 0 2px;
          letter-spacing: ${isLong ? "1px" : "0"};
        ">${txt}</span>`;
      });

      div.innerHTML = html;
      rulesBox.appendChild(div);
    });

    seq2.appendChild(rulesBox);
  }

  function showRules() {
    if (!rulesBox) return;
    rulesBox.style.opacity = "1";
    rulesBox.style.transform = "translateX(0) translateY(-50%)";
  }

  function hideRules() {
    if (!rulesBox) return;
    rulesBox.style.opacity = "0";
    rulesBox.style.transform = "translateX(200px) translateY(-50%)";
  }

  function updateTimerDisplay() {
    const timerEl =
      currentGameKey === "tetris"
        ? document.getElementById("tetris-timer-value")
        : document.getElementById("timer-value");

    let minutes = Math.floor(timerElapsed / 60);
    let seconds = timerElapsed % 60;

    if (seconds < 10) seconds = "0" + seconds;
    if (minutes < 10) minutes = "0" + minutes;

    if (timerEl) {
      timerEl.textContent = minutes + ":" + seconds;
    }
  }

  function runTimerInterval() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      timerElapsed++;
      updateTimerDisplay();
    }, 1000);
  }

  function startTimer() {
    timerElapsed = 0;
    timerWasRunningBeforePause = false;

    updateTimerDisplay();
    runTimerInterval();
  }

  function pauseGameTimer() {
    timerWasRunningBeforePause = timerInterval !== null;

    clearInterval(timerInterval);
    timerInterval = null;
  }

  function resumeGameTimer() {
    if (!timerWasRunningBeforePause) return;

    timerWasRunningBeforePause = false;
    runTimerInterval();
  }

  function stopTimer() {
    clearInterval(timerInterval);

    timerInterval = null;
    timerElapsed = 0;
    timerWasRunningBeforePause = false;
  }

  /* -------------------------------------------------------- */
  /* RESET SEQ2 COMPLET                                      */
  /* -------------------------------------------------------- */

  function resetSeq2() {
    // cacher tous les contenus
    hideAllSeq2Contents();

    // reset du nom (IMPORTANT)
    if (seq2Nom) {
      seq2Nom.style.transition = "none";
      seq2Nom.style.opacity = "0";
      seq2Nom.style.left = "50%";
      seq2Nom.style.top = "50%";
      seq2Nom.style.transform = "translate(-50%, -50%)";
    }

    // reset background
    if (seq2Bg) {
      seq2Bg.style.opacity = "0";
    }

    // reset du chronomètre
    stopTimer();
  }

  /* -------------------------------------------------------- */
  /* RESET SEQ3 COMPLET                                      */
  /* -------------------------------------------------------- */

  function resetSeq3() {
    /* -------------------------
     RESET JEU TETRIS
  ------------------------- */
    resetTetrisGame();
    const wrapper = document.getElementById("tetris-wrapper");

    if (wrapper) {
      wrapper.classList.remove("show");
    }

    /* -------------------------
     RESET JEU DARTS
  ------------------------- */
    resetDartsGame();

    /* -------------------------
     RESET JEU MEMORY GAME
  ------------------------- */

    resetMemoryGame();

    /* -------------------------
     RESET JEU MAZE GAME
  ------------------------- */

    resetMazeGame();

    /* -------------------------
     RESET IMAGE
  ------------------------- */
    const dartsImage = document.querySelector(".darts-image");
    if (dartsImage) {
      dartsImage.style.opacity = "0";
    }

    /* -------------------------
     RESET POPUP CLICK
  ------------------------- */
    if (clickPopup) {
      clickPopup.classList.remove("visible");
    }

    /* -------------------------
     RESET WIN MESSAGE
  ------------------------- */
    const winMsg = document.getElementById("darts-win-message");
    const title = document.querySelector(".win-title");
    const labels = document.querySelectorAll(".win-label");
    const values = document.querySelectorAll(".win-value");
    const recordEl = document.getElementById("win-record");

    if (winMsg) winMsg.classList.remove("show");

    if (title) {
      title.classList.remove("show");
      title.style.animation = ""; // reset animation blink
    }

    labels.forEach((l) => {
      l.classList.remove("show");
    });

    values.forEach((v) => {
      v.classList.remove("show");
    });

    if (recordEl) {
      recordEl.classList.remove("show");
      recordEl.classList.remove("blink");
      recordEl.textContent = ""; // IMPORTANT → évite qu'il reste visible
      recordEl.style.animation = "";
    }

    /* -------------------------
     RESET RULES
  ------------------------- */
    removeRules();

    /* -------------------------
     RESET START BUTTON
  ------------------------- */
    hideStartGame();

    /* -------------------------
     HIDE CONTENT
  ------------------------- */
    hideAllSeq3Contents();

    /* -------------------------
     TIMER
  ------------------------- */
    clearInterval(timerInterval);
  }

  /* -------------------------------------------------------- */
  /* HIDE ALL CONTENTS                                        */
  /* -------------------------------------------------------- */

  function hideAllSeq2Contents() {
    document.querySelectorAll(".seq2-content").forEach((c) => {
      c.style.display = "none";
      c.style.opacity = "0";
    });
  }

  function hideAllSeq3Contents() {
    document.querySelectorAll(".seq3-content").forEach((c) => {
      c.style.display = "none";
      c.style.opacity = "0";
    });
  }

  /* -------------------------------------------------------- */
  /* ANIMATION NOM → COIN HAUT GAUCHE                       */
  /* -------------------------------------------------------- */

  function runDestinationMetro() {
    if (!destinationMetro) return;

    destinationMetro.classList.remove("metro-run");

    void destinationMetro.offsetWidth;

    destinationMetro.classList.add("metro-run");
  }

  function animateNomToCorner(texte, onDone) {
    seq2Nom.textContent = texte;
    seq2Nom.style.transition = "none";
    seq2Nom.style.opacity = "1";
    seq2Nom.style.left = "50%";
    seq2Nom.style.top = "50%";
    seq2Nom.style.transform = "translate(-50%,-50%)";

    setTimeout(() => {
      seq2Nom.style.transition = "all .6s ease";
      seq2Nom.style.left = "-2%";
      seq2Nom.style.transform = "translate(40px,-50%)";

      setTimeout(() => {
        seq2Nom.style.top = "-3%";
        seq2Nom.style.transform = "translate(40px,20px)";

        setTimeout(() => {
          if (onDone) onDone();
        }, 700);
      }, 700);
    }, 1200);
  }

  /* -------------------------------------------------------- */
  /* CAROUSEL                                                 */
  /* -------------------------------------------------------- */

  function renderCarousel() {
    if (currentMode !== "seq1") return;

    const savedRetirees = window.SMQ_RETRAITES;

    if (Array.isArray(savedRetirees)) {
      const remainingRetirees = savedRetirees.filter(
        (retiree) => Number.isFinite(retiree?.argent) && retiree.argent >= 5,
      );

      if (remainingRetirees.length !== savedRetirees.length) {
        localStorage.setItem("smq_retirees", JSON.stringify(remainingRetirees));

        window.SMQ_RETRAITES = remainingRetirees;
      }
    }
    if (!mallCurrentNom || !mallCurrentArgent || !mallCurrentRetiree) {
      return;
    }

    const retirees = Array.isArray(window.SMQ_RETRAITES)
      ? window.SMQ_RETRAITES
      : [];

    const isEmpty = retirees.length === 0;

    mallCurrentRetiree.classList.toggle("no-retiree", isEmpty);
    mallCurrentArgent.classList.remove("money-glow");

    if (isEmpty) {
      currentIndex = 0;
      selectedRetireeIndex = null;
      retireeMoneyCounting = false;
      animatedRetirees.clear();

      mallCurrentNom.textContent = "Aucun joueur disponible";
      mallCurrentArgent.textContent = "";

      mallCurrentRetiree.classList.remove("retiree-selected");
      seq1?.classList.remove("hub-unlocked");

      hideRetireeCarouselArrows();
      return;
    }

    if (
      !Number.isInteger(currentIndex) ||
      currentIndex < 0 ||
      currentIndex >= retirees.length
    ) {
      currentIndex = 0;
    }

    const hideArrows = true;
    btnPrev?.classList.toggle("mall-arrow-hidden", hideArrows);
    btnNext?.classList.toggle("mall-arrow-hidden", hideArrows);

    const retiree = retirees[currentIndex];

    const montant =
      retiree.argent % 1 === 0
        ? retiree.argent.toFixed(0)
        : retiree.argent.toFixed(2).replace(".", ",");

    mallCurrentNom.textContent = retiree.nom;

    if (animatedRetirees.has(currentIndex)) {
      mallCurrentArgent.textContent = `${montant} $`;
      mallCurrentArgent.classList.add("money-glow");
    } else {
      mallCurrentArgent.textContent = "0 $";
    }
  }

  window.addEventListener("smq:retirees-updated", () => {
    renderCarousel();
  });

  function animateRetireeMoney(targetAmount, duration = 3000) {
    if (!mallCurrentArgent) return;

    const startTime = performance.now();

    mallCurrentArgent.classList.remove("money-glow");

    mallCurrentArgent.textContent = "0 $";

    function updateMoney(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentAmount = Math.floor(targetAmount * progress);

      mallCurrentArgent.textContent = `${currentAmount} $`;

      if (progress < 1) {
        requestAnimationFrame(updateMoney);
        return;
      }

      mallCurrentArgent.textContent = `${targetAmount} $`;

      void mallCurrentArgent.offsetWidth;
      mallCurrentArgent.classList.add("money-glow");
      retireeMoneyCounting = false;
    }

    requestAnimationFrame(updateMoney);
  }

  btnPrev?.addEventListener("click", (e) => {
    e.preventDefault();

    const retirees = window.SMQ_RETRAITES ?? [];

    if (
      retirees.length < 2 ||
      selectedRetireeIndex !== null ||
      retireeMoneyCounting
    ) {
      return;
    }

    currentIndex = (currentIndex - 1 + retirees.length) % retirees.length;

    renderCarousel();
  });

  btnNext?.addEventListener("click", (e) => {
    e.preventDefault();

    const retirees = window.SMQ_RETRAITES ?? [];

    if (
      retirees.length < 2 ||
      selectedRetireeIndex !== null ||
      retireeMoneyCounting
    ) {
      return;
    }

    currentIndex = (currentIndex + 1) % retirees.length;

    renderCarousel();
  });

  function hideRetireeCarouselArrows() {
    if (btnPrev) {
      btnPrev.classList.add("mall-arrow-hidden");
    }

    if (btnNext) {
      btnNext.classList.add("mall-arrow-hidden");
    }
  }

  /* -------------------------------------------------------- */
  /* DESTINATION HUB SFX                                     */
  /* -------------------------------------------------------- */

  document.querySelectorAll(".mall-zone-label").forEach((label) => {
    label.addEventListener("mouseenter", () => {
      if (currentMode !== "seq1") return;
      if (selectedRetireeIndex === null) return;

      destinationHubHoverSfx.currentTime = 0;
      destinationHubHoverSfx.play().catch(() => {});
    });
  });

  /* -------------------------------------------------------- */
  /* SEQ1 → SEQ2                                             */
  /* -------------------------------------------------------- */

  document.querySelectorAll(".mall-zone-label").forEach((label) => {
    label.addEventListener("click", (e) => {
      e.preventDefault();

      if (
        currentMode !== "seq1" ||
        selectedRetireeIndex === null ||
        !window.SMQ_RETRAITES?.[selectedRetireeIndex]
      ) {
        return;
      }

      destinationHubMetroSfx.currentTime = 0;
      destinationHubMetroSfx.play().catch(() => {});
      fadeOutDestinationHubMusic();

      const lieu = label.dataset.lieu;
      currentLieu = lieu;
      currentMode = "seq2";
      if (lieu === "coney") {
        fadeInConeyMusic();
      }

      if (lieu === "mall") {
        MallAudioManager.playHubMusic();
      }

      slideOut();
      hideSortir();
      resetSeq3();
      resetSeq2();

      seq1.style.opacity = "0";
      seq1.style.pointerEvents = "none";

      setTimeout(() => {
        seq2.style.opacity = "1";
        seq2.style.pointerEvents = "all";

        if (seq2Bg && BACKGROUNDS[lieu]) {
          seq2Bg.style.backgroundImage = BACKGROUNDS[lieu];
          seq2Bg.style.opacity = "1";
        }

        updatePlayer();

        runDestinationMetro();

        animateNomToCorner(LABELS[lieu], () => {
          hideAllSeq2Contents();
          hideAllSeq3Contents();

          const content = document.getElementById(`seq2-${lieu}`);

          if (content) {
            content.style.display = "flex";

            setTimeout(() => {
              content.style.opacity = "1";
              if (lieu === "casino") {
                casinoLobbyMusic.currentTime = 0;
                casinoLobbyMusic.play().catch(() => {});
              }

              /* -------------------------
               RESET VISUEL BEST SCORES
            ------------------------- */
              content
                .querySelectorAll(
                  "#best-score-darts, #best-score-tetris, #best-score-memory, #best-score-maze",
                )
                .forEach((el) => {
                  el.style.transition = "none";
                  el.style.opacity = "0";
                  el.style.transform = "translateY(-60px)";
                });

              /* -------------------------
               UPDATE + ANIMATION
            ------------------------- */
              setTimeout(() => {
                updateBestScoresUI();

                animateBestScore("darts");
                animateBestScore("tetris");
                animateBestScore("memory");
                animateBestScore("maze");
              }, 600);
            }, 50);
          }

          showSortir();
          slideIn();
        });
      }, 1200);
    });
  });

  /* -------------------------------------------------------- */
  /* SEQ2 → SEQ3                                             */
  /* -------------------------------------------------------- */

  function goToSeq3(gameKey) {
    currentMode = "seq3";
    currentGameKey = gameKey;

    const mallShops = ["vinyls", "books", "audio", "fashion"];

    const isMallShop = mallShops.includes(gameKey);

    if (!isMallShop) {
      const enterGameSfx = createDeferredAudio(
        "/sounds/legal/banner-bottom-nyc-games/casino/common/enter-game.mp3",
      );

      enterGameSfx.volume = 0.1;
      enterGameSfx.play().catch(() => {});
    }

    if (currentLieu === "casino") {
      fadeOutCasinoLobbyMusic();
    }

    if (currentLieu === "coney") {
      fadeOutConeyMusic();
    }

    if (currentLieu === "mall") {
      MallAudioManager.playEnterShopSfx();

      if (gameKey === "vinyls") {
        MallAudioManager.playVinylsMusic();
      }

      if (gameKey === "books") {
        MallAudioManager.playBooksMusic();
      }

      if (gameKey === "audio") {
        MallAudioManager.playAudioEquipmentMusic();
      }

      if (gameKey === "fashion") {
        MallAudioManager.playFashionMusic();
      }
    }

    slideOut();
    hideSortir();
    hideAllSeq2Contents();
    resetSeq3();

    seq2Nom.style.opacity = "0";

    setTimeout(() => {
      updatePlayer();

      const game = GAMES[gameKey];

      animateNomToCorner(game.label, () => {
        const seq3El = document.getElementById(`seq3-${gameKey}`);

        if (seq3El) {
          seq3El.style.display = "flex";
          setTimeout(() => (seq3El.style.opacity = "1"), 50);
        }

        showSortir();
        slideIn();

        setTimeout(() => {
          createRules(gameKey);

          setTimeout(() => {
            if (!isMallShop) {
              showRules();

              setTimeout(() => {
                showStartGame();
              }, 600);
            }
          }, 100);
        }, 500);
      });
    }, 500);
  }

  document
    .querySelectorAll(
      ".effet-coney-game-darts, \
.effet-coney-game-tetris, \
.effet-coney-game-memory, \
.effet-coney-game-maze, \
.effet-mall-shop-vinyls, \
.effet-mall-shop-books-movies, \
.effet-mall-shop-audio, \
.effet-mall-shop-fashion, \
.effet-casino-game-videoPoker, \
.effet-casino-game-slotMachine, \
.effet-casino-game-luckyWheel, \
.effet-casino-game-dice",
    )
    .forEach((gameLink) => {
      if (gameLink.classList.contains("game-image")) return;

      gameLink.style.cursor = "pointer";

      gameLink.addEventListener("click", (e) => {
        e.preventDefault();

        const gameKey =
          /* ======================================================
     CONEY
  ====================================================== */

          gameLink.classList.contains("effet-coney-game-darts")
            ? "darts"
            : gameLink.classList.contains("effet-coney-game-tetris")
              ? "tetris"
              : gameLink.classList.contains("effet-coney-game-memory")
                ? "memory"
                : gameLink.classList.contains("effet-coney-game-maze")
                  ? "maze"
                  : /* ======================================================
     MALL
  ====================================================== */

                    gameLink.classList.contains("effet-mall-shop-vinyls")
                    ? "vinyls"
                    : gameLink.classList.contains(
                          "effet-mall-shop-books-movies",
                        )
                      ? "books"
                      : gameLink.classList.contains("effet-mall-shop-audio")
                        ? "audio"
                        : gameLink.classList.contains("effet-mall-shop-fashion")
                          ? "fashion"
                          : /* ======================================================
     CASINO
  ====================================================== */

                            gameLink.classList.contains(
                                "effet-casino-game-videoPoker",
                              )
                            ? "videoPoker"
                            : gameLink.classList.contains(
                                  "effet-casino-game-slotMachine",
                                )
                              ? "slotMachine"
                              : gameLink.classList.contains(
                                    "effet-casino-game-luckyWheel",
                                  )
                                ? "luckyWheel"
                                : gameLink.classList.contains(
                                      "effet-casino-game-dice",
                                    )
                                  ? "dice"
                                  : null;

        const game = GAMES[gameKey];

        if (!game) return;

        /* LES BOUTIQUES DU MALL N’UTILISENT PAS LA POP-UP */

        if (game.zone === "mall") {
          goToSeq3(gameKey);
          return;
        }

        /* CONEY ET CASINO */

        openGameEntryModal(gameKey);
      });
    });

  /* -------------------------------------------------------- */
  /* SORTIR                                                   */
  /* -------------------------------------------------------- */

  sortir.addEventListener("click", (e) => {
    e.preventDefault();

    const currentGameZone = GAMES[currentGameKey]?.zone;

    const requiresExitConfirmation =
      currentMode === "seq3" &&
      (currentGameZone === "coney" || currentGameZone === "casino");

    if (
      requiresExitConfirmation &&
      !exitConfirmationBypass &&
      sortir.dataset.exitConfirmed !== "true"
    ) {
      openGameExitModal();

      return;
    }

    delete sortir.dataset.exitConfirmed;

    if (currentMode === "seq3") {
      casinoLobbyMusic.pause();
      casinoLobbyMusic.currentTime = 0;

      if (currentLieu === "mall") {
        MallAudioManager.playReturnHubSfx();
        MallAudioManager.playHubMusic();
      }

      fadeOutVideoPokerMusic();
      fadeOutSlotMachineMusic();
      fadeOutDiceGameMusic();
      if (currentGameKey === "dice") {
        resetDiceGameSfx();
        resetDiceGame();
      }
      fadeOutLuckyWheelMusic();
      if (currentGameKey === "luckyWheel") {
        resetLuckyWheelSfx();
      }

      currentMode = "seq2";

      /* =========================
     RESET JEU EN COURS
  ========================= */
      const game = GAMES[currentGameKey];

      if (game?.reset) {
        game.reset();
      }

      resetSeq3();

      if (currentGameKey === "darts") {
        resetDartsAudio();
        resetDartsIntro();
        hideDartsBlueprint();
      }
      if (currentGameKey === "tetris") {
        fadeOutTetrisMusic(700);

        setTimeout(() => {
          resetTetrisAudio();
        }, 700);

        resetTetrisGame();
        resetTetrisIntro();
        hideTetrisBlueprint();
      }

      if (currentGameKey === "memory") {
        fadeOutMemoryMusic(700);

        setTimeout(() => {
          resetMemoryAudio();
        }, 700);

        resetMemoryGame();
        resetMemoryIntro();
        hideMemoryBlueprint();
      }

      if (currentGameKey === "videoPoker") {
        resetVideoPokerIntro();
      }

      if (currentGameKey === "slotMachine") {
        resetSlotMachineIntro();
      }

      if (currentGameKey === "luckyWheel") {
        resetLuckyWheelIntro();
      }

      slideOut();
      hideSortir();

      hideCasinoBlueprint();

      seq2Nom.style.opacity = "0";

      setTimeout(() => {
        updatePlayer();

        animateNomToCorner(LABELS[currentLieu], () => {
          hideAllSeq2Contents();

          const content = document.getElementById(`seq2-${currentLieu}`);

          if (content) {
            content.style.display = "flex";

            setTimeout(() => {
              content.style.opacity = "1";

              if (currentLieu === "casino") {
                casinoLobbyMusic.currentTime = 0;
                casinoLobbyMusic.volume = 0.3;
                casinoLobbyMusic.play().catch(() => {});
              }

              if (currentLieu === "coney") {
                coneyMusic.pause();
                coneyMusic.currentTime = 0;
                coneyMusic.volume = 0;

                setTimeout(() => {
                  fadeInConeyMusic(0.3, 1200);
                }, 100);
              }

              /* -------------------------
             RESET BEST SCORES
          ------------------------- */
              content
                .querySelectorAll(
                  "#best-score-darts, #best-score-tetris, #best-score-memory, #best-score-maze",
                )
                .forEach((el) => {
                  el.style.transition = "none";
                  el.style.opacity = "0";
                  el.style.transform = "translateY(-60px)";
                  el.dataset.visible = "false";
                });

              /* -------------------------
             UPDATE + ANIMATION
          ------------------------- */
              setTimeout(() => {
                updateBestScoresUI();
                animateBestScore("darts");
                animateBestScore("tetris");
                animateBestScore("memory");
                animateBestScore("maze");
              }, 600);
            }, 50);
          }

          showSortir();
          slideIn();
        });
      }, 500);
    } else {
      currentMode = "seq1";

      fadeOutCasinoLobbyMusic();
      fadeOutConeyMusic();
      MallAudioManager.stopMusic();

      slideOut();
      hideSortir();

      seq2.style.opacity = "0";
      seq2.style.pointerEvents = "none";

      setTimeout(() => {
        seq1.style.opacity = "1";
        seq1.style.pointerEvents = "all";
        fadeInDestinationHubMusic();
        renderCarousel();
      }, 800);
    }
  });

  /* -------------------------------------------------------- */
  /* CONTEXTE PARTAGÉ POUR LES JEUX                          */
  /* -------------------------------------------------------- */

  const ctx = {
    stopTimer,
    startTimer,
    getCurrentIndex: () => currentIndex,
    getCurrentPlayer: () => window.SMQ_RETRAITES[currentIndex],
    updatePlayer,
    creditPlayerMoney: (amount) => {
      const player = window.SMQ_RETRAITES[currentIndex];

      return creditPlayerMoney(player, amount, updatePlayer);
    },
    registerCasinoRecord: (gameKey, gain) => {
      return registerCasinoRecord(gameKey, gain);
    },
    getClickPopup: () => clickPopup,
    getSecondBanner: () => secondBanner,
    playVpDealCardsSfx: () => {
      setTimeout(() => {
        vpDealCardsSfx.currentTime = 0;
        vpDealCardsSfx.play().catch(() => {});
      }, 300);
    },
    playVpReplaceSfx: () => {
      vpReplaceSfx.currentTime = 0;
      vpReplaceSfx.play().catch(() => {});
    },

    playVpWinSfx: () => {
      vpWinSfx.currentTime = 0;
      vpWinSfx.play().catch(() => {});
    },

    playVpLoseSfx: () => {
      vpLoseSfx.currentTime = 0;
      vpLoseSfx.play().catch(() => {});
    },

    playSmWinSfx: () => {
      smWinSfx.currentTime = 0;
      smWinSfx.play().catch(() => {});
    },

    playSmLoseSfx: () => {
      smLoseSfx.currentTime = 0;
      smLoseSfx.play().catch(() => {});
    },

    playLwWinSfx: () => {
      lwWinSfx.currentTime = 0;
      lwWinSfx.play().catch(() => {});
    },

    playLwLoseSfx: () => {
      lwLoseSfx.currentTime = 0;
      lwLoseSfx.play().catch(() => {});
    },
    playLwJackpotSfx: () => {
      lwJackpotSfx.currentTime = 0;
      lwJackpotSfx.play().catch(() => {});
    },

    playDiceRollSfx: () => {
      diceRollSfx.currentTime = 0;
      diceRollSfx.play().catch(() => {});
    },

    playDiceWinSfx: () => {
      diceWinSfx.currentTime = 0;
      diceWinSfx.play().catch(() => {});
    },

    playDiceLoseSfx: () => {
      diceLoseSfx.currentTime = 0;
      diceLoseSfx.play().catch(() => {});
    },

    playDiceJackpotSfx: () => {
      diceJackpotSfx.currentTime = 0;
      diceJackpotSfx.play().catch(() => {});
    },
  };

  /* PAYMENT BUTTON LOCK............................................................................................................... */

  function lockPaymentButton(button, duration = 500) {
    if (!button) return false;

    if (button.dataset.paymentLocked === "true") {
      return false;
    }

    button.dataset.paymentLocked = "true";

    setTimeout(() => {
      delete button.dataset.paymentLocked;
    }, duration);

    return true;
  }

  const newGameBtn = document.querySelectorAll(".vp-action-btn")[1];

  if (newGameBtn) {
    newGameBtn.addEventListener("click", () => {
      if (!lockPaymentButton(newGameBtn)) {
        return;
      }

      const vpPlayer = window.SMQ_RETRAITES?.[currentIndex];

      if (
        !vpPlayer ||
        !Number.isFinite(vpPlayer.argent) ||
        vpPlayer.argent < 2
      ) {
        const vpNotification = document.querySelector(
          ".casino-vp-notifications",
        );

        if (vpNotification) {
          vpNotification.textContent =
            "Vous n'avez pas assez d'argent pour commencer une nouvelle partie ( 2 $ nécessaires ).";
        }

        return;
      }

      vpNewGameSfx.currentTime = 0;
      vpNewGameSfx.play().catch(() => {});

      setTimeout(() => {
        vpDealCardsSfx.currentTime = 0;
        vpDealCardsSfx.play().catch(() => {});
      }, 300);

      const r = window.SMQ_RETRAITES[currentIndex];

if (r.argent < 2) {
  return;
}

debitPlayerMoney(r, 2, updatePlayer);

      stopVpNewGameBlink();
      showVpGameBlueprint();
      initVideoPoker(ctx);

      const notif = document.querySelector(".casino-vp-notifications");

      if (notif) {
        notif.textContent =
          "Cliquez sur les cartes que vous souhaitez remplacer.";
      }
    });
  }

  const slotNewGameBtn = document.querySelectorAll(".sm-action-btn")[1];

  if (slotNewGameBtn) {
    slotNewGameBtn.addEventListener("click", () => {
      if (!lockPaymentButton(slotNewGameBtn)) {
        return;
      }

      const r = window.SMQ_RETRAITES[currentIndex];

      if (r.argent < 2) {
        const notif = document.querySelector(".casino-sm-notifications");

        if (notif) {
          notif.textContent =
            "Vous n'avez pas assez d'argent pour commencer une nouvelle partie.";
        }

        return;
      }

      smNewGameSfx.currentTime = 0;
      smNewGameSfx.play().catch(() => {});

      debitPlayerMoney(r, 2, updatePlayer);

      stopSmNewGameBlink();

      const notif = document.querySelector(".casino-sm-notifications");

      if (notif) {
        notif.textContent = "Appuyez sur le bouton LANCER.";
      }

      slotSpinBtn.disabled = false;
      slotSpinBtn.style.pointerEvents = "auto";
      slotSpinBtn.style.opacity = "1";

      initSlotMachine(ctx);

      slotSpinBtn.style.opacity = "1";
      slotSpinBtn.style.animation = "smNewGameBlink 2s infinite";
    });
  }

  const slotSpinBtn = document.querySelectorAll(".sm-action-btn")[0];

  if (slotSpinBtn) {
    slotSpinBtn.addEventListener("click", () => {
      slotNewGameBtn.style.pointerEvents = "none";
      smSpinSfx.currentTime = 0;
      smSpinSfx.play().catch(() => {});

      smReelTurnSfx.currentTime = 0;
      smReelTurnSfx.play().catch(() => {});
      slotSpinBtn.disabled = true;
      slotSpinBtn.style.pointerEvents = "none";

      slotSpinBtn.style.animation = "none";
      slotSpinBtn.style.opacity = "1";
      slotSpinBtn.style.color = "white";
      slotSpinBtn.style.boxShadow = "0 0 5px 0 transparent";

      const notif = document.querySelector(".casino-sm-notifications");

      if (notif) {
        notif.textContent = "Les rouleaux commencent à tourner...";
      }

      spinReels();
      setTimeout(() => {
        slotNewGameBtn.style.pointerEvents = "auto";
        slotNewGameBtn.style.opacity = "1";
        slotNewGameBtn.style.animation = "smNewGameBlink 2s infinite";
      }, 1200);
    });
  }

  const lwNewGameBtn = document.getElementById("lw-new-game-btn");
  const lwSpinBtn = document.getElementById("lw-spin-btn");
  const lwNotif = document.querySelector(".casino-lw-notifications");

  if (lwNewGameBtn) {
    lwNewGameBtn.addEventListener("click", () => {
      if (!lockPaymentButton(lwNewGameBtn)) {
        return;
      }

      const r = window.SMQ_RETRAITES[currentIndex];

      if (!r) return;

      if (r.argent < 2) {
        if (lwNotif) {
          lwNotif.textContent =
            "Vous n'avez pas assez d'argent pour commencer une nouvelle partie.";
        }

        return;
      }

      lwNewGameSfx.currentTime = 0;
      lwNewGameSfx.play().catch(() => {});

      debitPlayerMoney(r, 2, updatePlayer);

      lwNewGameBtn.classList.remove("blink");
      lwNewGameBtn.style.animation = "none";

      if (lwSpinBtn) {
        lwSpinBtn.disabled = false;
        lwSpinBtn.style.pointerEvents = "auto";
        lwSpinBtn.style.opacity = "1";
        lwSpinBtn.style.animation = "lwNewGameBlink 2s infinite";
      }

      if (lwNotif) {
        lwNotif.textContent = "Appuyez sur le bouton LANCER.";
      }
    });
  }

  if (lwSpinBtn) {
    lwSpinBtn.addEventListener("click", () => {
      lwSpinSfx.currentTime = 0;
      lwSpinSfx.play().catch(() => {});

      lwWheelTurnSfx.currentTime = 0;
      lwWheelTurnSfx.play().catch(() => {});

      if (lwNewGameBtn) {
        lwNewGameBtn.style.pointerEvents = "none";
        lwNewGameBtn.disabled = true;
        lwNewGameBtn.style.animation = "none";
      }

      lwSpinBtn.disabled = true;
      lwSpinBtn.style.pointerEvents = "none";
      lwSpinBtn.style.animation = "none";
      lwSpinBtn.style.opacity = "1";
      lwSpinBtn.style.color = "white";
      lwSpinBtn.style.boxShadow = "0 0 5px 0 transparent";

      if (lwNotif) {
        lwNotif.textContent = "La roue tourne...";
      }
      spinLuckyWheel();
    });
  }

  const diceNewGameBtn = document.getElementById("dice-new-game-btn");
  const diceRollBtn = document.getElementById("dice-roll-btn");
  const diceNotif = document.querySelector(".casino-dice-notifications");

  if (diceNewGameBtn) {
    diceNewGameBtn.addEventListener("click", () => {
      if (!lockPaymentButton(diceNewGameBtn)) {
        return;
      }

      const dicePlayer = window.SMQ_RETRAITES?.[currentIndex];

      if (
        !dicePlayer ||
        !Number.isFinite(dicePlayer.argent) ||
        dicePlayer.argent < 2
      ) {
        if (diceNotif) {
          diceNotif.textContent =
            "Vous n'avez pas assez d'argent pour commencer une nouvelle partie ( 2 $ nécessaires ).";
        }

        return;
      }

      diceNewGameSfx.currentTime = 0;
      diceNewGameSfx.play().catch(() => {});

      const r = window.SMQ_RETRAITES[currentIndex];

      if (!r) return;

      if (r.argent < 2) {
        if (diceNotif) {
          diceNotif.textContent =
            "Vous n'avez pas assez d'argent pour commencer une nouvelle partie.";
        }

        return;
      }
      debitPlayerMoney(r, 2, updatePlayer);

      diceNewGameBtn.classList.remove("blink");
      diceNewGameBtn.style.animation = "none";
      diceNewGameBtn.style.opacity = "1";

      startDiceGame();

      if (diceRollBtn) {
        diceRollBtn.disabled = false;
        diceRollBtn.style.pointerEvents = "auto";
        diceRollBtn.style.opacity = "1";
        diceRollBtn.style.animation = "diceNewGameBlink 2s infinite";
      }
    });
  }

  if (diceRollBtn) {
    diceRollBtn.addEventListener("click", () => {
      diceRollBtnSfx.currentTime = 0;
      diceRollBtnSfx.play().catch(() => {});
      diceRollBtn.disabled = true;
      diceRollBtn.style.pointerEvents = "none";
      diceRollBtn.style.animation = "none";
      diceRollBtn.style.opacity = "1";
      diceRollBtn.style.color = "white";
      diceRollBtn.style.boxShadow = "0 0 5px 0 transparent";

      if (diceNewGameBtn) {
        diceNewGameBtn.disabled = true;
        diceNewGameBtn.style.pointerEvents = "none";
        diceNewGameBtn.style.animation = "none";
      }

      rollDice();
    });
  }

  /* -------------------------------------------------------- */
  /* DARTS — NOUVELLE PARTIE                                 */
  /* -------------------------------------------------------- */

  const dartsNewGameBtn = document.getElementById("darts-new-game-btn");

  if (dartsNewGameBtn) {
    dartsNewGameBtn.addEventListener("click", () => {
      if (!lockPaymentButton(dartsNewGameBtn)) {
        return;
      }

      const r = window.SMQ_RETRAITES[currentIndex];

      if (!r) return;

      /* PAS ASSEZ D'ARGENT */

      if (r.argent < 2) {
        const notif = document.querySelector(".coney-darts-notifications");

        if (notif) {
          notif.textContent =
            "Vous n'avez pas assez d'argent pour commencer une nouvelle partie.";
        }

        return;
      }

      playDartsNewGameSfx();

      /* PAIEMENT PARTIE */

      debitPlayerMoney(r, 2, updatePlayer);

      /* STOP CLIGNOTEMENT */

      dartsNewGameBtn.classList.remove("blink");
      dartsNewGameBtn.style.animation = "none";
      dartsNewGameBtn.style.pointerEvents = "none";
      dartsNewGameBtn.style.opacity = "1";

      /* NOTIFICATION */

      const notif = document.querySelector(".coney-darts-notifications");

      if (notif) {
        notif.textContent = "Ciblez et cliquez pour lancer votre flèche.";
      }

      /* LANCEMENT DU JEU */

      startDartsGame(ctx);
    });
  }

  /* -------------------------------------------------------- */
  /* TETRIS — NOUVELLE PARTIE                                */
  /* -------------------------------------------------------- */

  const tetrisNewGameBtn = document.getElementById("tetris-new-game-btn");

  if (tetrisNewGameBtn) {
    tetrisNewGameBtn.addEventListener("click", () => {
      if (!lockPaymentButton(tetrisNewGameBtn)) {
        return;
      }

      const r = window.SMQ_RETRAITES[currentIndex];

      if (!r) return;

      /* PAS ASSEZ D'ARGENT */

      if (r.argent < 2) {
        const notif = document.querySelector(".coney-tetris-notifications");

        if (notif) {
          notif.textContent =
            "Vous n'avez pas assez d'argent pour commencer une nouvelle partie.";
        }

        return;
      }

      playTetrisNewGameSfx();

      /* PAIEMENT */

      debitPlayerMoney(r, 2, updatePlayer);

      /* STOP CLIGNOTEMENT */

      tetrisNewGameBtn.classList.remove("blink");
      tetrisNewGameBtn.style.animation = "none";
      tetrisNewGameBtn.style.pointerEvents = "none";
      tetrisNewGameBtn.style.opacity = "1";

      /* RESET JEU */

      resetTetrisGame();

      const wrapper = document.getElementById("tetris-wrapper");

      if (wrapper) {
        wrapper.classList.add("show");
      }

      /* TIMER */

      startTimer();

      /* NOTIFICATION */

      const notif = document.querySelector(".coney-tetris-notifications");

      if (notif) {
        notif.innerHTML = `
    Utilisez les flèches du clavier
    <span class="tetris-notif-controls">
      ← → ↑ ↓
    </span>
    pour déplacer et contrôler les pièces.
  `;
      }

      /* LANCEMENT */

      initTetrisGame(ctx);
    });
  }

  /* MEMORY — NOUVELLE PARTIE....................................................................................................... */

  const memoryNewGameBtn = document.getElementById("memory-new-game-btn");

  if (memoryNewGameBtn) {
    memoryNewGameBtn.addEventListener("click", () => {
      if (!lockPaymentButton(memoryNewGameBtn)) {
        return;
      }

      const retiree = window.SMQ_RETRAITES[currentIndex];

      if (!retiree) return;

      /* PAS ASSEZ D’ARGENT */

      if (retiree.argent < 2) {
        const notification = document.querySelector(
          ".coney-memory-notifications",
        );

        if (notification) {
          notification.textContent =
            "Vous n'avez pas assez d'argent pour commencer une nouvelle partie.";
        }

        return;
      }

      playMemoryNewGameSfx();

      /* PAIEMENT */

      debitPlayerMoney(retiree, 2, updatePlayer);

      /* ARRÊT DU CLIGNOTEMENT */

      memoryNewGameBtn.classList.remove("blink");
      memoryNewGameBtn.style.animation = "none";
      memoryNewGameBtn.style.pointerEvents = "none";
      memoryNewGameBtn.style.opacity = "1";

      /* RESET */

      resetMemoryGame();

      const wrapper = document.getElementById("memory-wrapper");

      if (wrapper) {
        wrapper.classList.add("show");
      }

      /* NOTIFICATION */

      const notification = document.querySelector(
        ".coney-memory-notifications",
      );

      if (notification) {
        notification.textContent =
          "Retournez deux cartes et trouvez toutes les paires.";
      }

      /* LANCEMENT */

      initMemoryGame(ctx);
    });
  }

  /* -------------------------------------------------------- */
  /* START GAME — LOGIQUE SELON JEU COURANT                  */
  /* -------------------------------------------------------- */

  if (startGame) {
    startGame.addEventListener("click", (e) => {
      e.preventDefault();

      playStartGameButtonSfx();

      hideStartGame();
      hideRules();

      if (currentGameKey === "darts") {
        showDartsBlueprint();
        startDartsIntro();
        return;
      }

      if (currentGameKey === "tetris") {
        showTetrisBlueprint();
        startTetrisIntro();
        return;
      }

      if (currentGameKey === "memory") {
        showMemoryBlueprint();
        startMemoryIntro();
        return;
      }

      if (GAMES[currentGameKey]?.zone === "casino") {
        showCasinoBlueprint(currentGameKey);

        if (currentGameKey === "videoPoker") {
          startVideoPokerIntro();
        }

        if (currentGameKey === "slotMachine") {
          startSlotMachineIntro();
        }

        if (currentGameKey === "luckyWheel") {
          startLuckyWheelIntro();
        }
        if (currentGameKey === "dice") {
          startDiceIntro();
        }
      }

      const game = GAMES[currentGameKey];

      if (game?.init) {
        game.init(ctx);
      }
    });
  }

  function pauseNycGames() {
    if (nycGamesPaused) return;

    nycGamesPaused = true;
    secondBanner.style.pointerEvents = "none";

    secondBanner.getAnimations({ subtree: true }).forEach((animation) => {
      if (animation.playState === "running") {
        animation.pause();
        pausedBannerAnimations.add(animation);
      }
    });

    pauseGameTimer();
    pauseTetrisGame();

    pauseDartsAudio();

    pauseTetrisGame();
    pauseMemoryGame();
    pauseDiceGame();
    pauseSlotMachine();
    pauseLuckyWheel();
    pauseDartsGame();
    pauseVideoPoker();
    pauseMazeGame();

    pauseDirectNycAudio();

    pauseDartsAudio();
    pauseTetrisAudio();
    pauseMemoryAudio();
    MazeGameAudioManager.pauseAudio();
    MallAudioManager.pauseAudio();

    window.dispatchEvent(new CustomEvent("smq:nyc-pause"));
  }

  function resumeNycGames() {
    if (!nycGamesPaused) return;

    nycGamesPaused = false;
    secondBanner.style.pointerEvents = "";

    pausedBannerAnimations.forEach((animation) => {
      try {
        animation.play();
      } catch {}
    });

    pausedBannerAnimations.clear();

    resumeGameTimer();

    resumeTetrisGame();
    resumeMemoryGame();
    resumeDiceGame();
    resumeSlotMachine();
    resumeLuckyWheel();
    resumeDartsGame();
    resumeVideoPoker();
    resumeMazeGame();

    resumeDirectNycAudio();

    resumeDartsAudio();
    resumeTetrisAudio();
    resumeMemoryAudio();
    MazeGameAudioManager.resumeAudio();
    MallAudioManager.resumeAudio();

    window.dispatchEvent(new CustomEvent("smq:nyc-resume"));
  }

  function updateNycGamesPauseState() {
    const mustPause = document.hidden || !destinationHubInView;

    if (mustPause) {
      pauseNycGames();
    } else {
      resumeNycGames();
    }
  }

  function handleDocumentVisibilityChange() {
    if (document.hidden) {
      destinationHubPausedByTab = !destinationHubMusic.paused;

      destinationHubMusic.pause();
    } else if (
      destinationHubPausedByTab &&
      destinationHubInView &&
      currentMode === "seq1" &&
      selectedRetireeIndex !== null
    ) {
      destinationHubMusic.play().catch(() => {});

      destinationHubPausedByTab = false;
    }

    updateNycGamesPauseState();
  }

  function updateDestinationHubViewport(isInView) {
    destinationHubInView = isInView;

    const retireeActive = document.getElementById("mall-retraite-actif");

    if (isInView) {
      renderCarousel();

      if (retireeActive) {
        requestAnimationFrame(() => {
          retireeActive.classList.add("retraite-visible");
        });
      }

      if (
        !document.hidden &&
        currentMode === "seq1" &&
        selectedRetireeIndex !== null
      ) {
        fadeInDestinationHubMusic();
      }
    } else {
      if (retireeActive) {
        retireeActive.classList.remove("retraite-visible");
      }

      fadeOutDestinationHubMusic();
    }

    updateNycGamesPauseState();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        updateDestinationHubViewport(entry.isIntersecting);
      });
    },
    {
      threshold: 0.1,
    },
  );

  observer.observe(secondBanner);

  document.addEventListener("visibilitychange", handleDocumentVisibilityChange);

  function checkDestinationHubViewport() {
    const rect = secondBanner.getBoundingClientRect();

    const isInView = rect.bottom > 0 && rect.top < window.innerHeight;

    updateDestinationHubViewport(isInView);
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      checkDestinationHubViewport();
    });
  });

  window.addEventListener("load", () => {
    setTimeout(() => {
      checkDestinationHubViewport();
    }, 100);
  });
}
