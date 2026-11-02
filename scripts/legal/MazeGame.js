/* MAZE GAME ....................................................................................................................*/
/* ..............................................................................................................................*/
/* ..............................................................................................................................*/

import MazeGameAudioManager, { SFX } from "./MazeGameAudioManager";

let FLOORS = [];



/* PLAYER .......................................................................................................................*/
/* ..............................................................................................................................*/
/* ..............................................................................................................................*/

let isMoving = false;
let mazeTimerInterval = null;
let mazeElapsedSeconds = 0;
let mazeTimerStarted = false;

let mazePaused = false;
let mazeTimeouts = [];

function startMazeTimeout(task) {
  task.startedAt = performance.now();

  task.id = setTimeout(() => {
    task.id = null;

    mazeTimeouts = mazeTimeouts.filter(
      (currentTask) => currentTask !== task,
    );

    task.callback();
  }, task.remaining);
}

function addMazeTimeout(callback, delay) {
  const task = {
    callback,
    remaining: delay,
    startedAt: 0,
    id: null,
  };

  mazeTimeouts.push(task);
  startMazeTimeout(task);

  return task;
}

function clearMazeTimeouts() {
  mazeTimeouts.forEach((task) => {
    if (task.id !== null) {
      clearTimeout(task.id);
    }
  });

  mazeTimeouts = [];
}

export function pauseMazeGame() {
  if (mazePaused) return;

  mazePaused = true;

  const pauseTime = performance.now();

  mazeTimeouts.forEach((task) => {
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

export function resumeMazeGame() {
  if (!mazePaused) return;

  mazePaused = false;

  mazeTimeouts.forEach((task) => {
    if (task.id === null) {
      startMazeTimeout(task);
    }
  });
}

let player = {
  soul: 0,
  secrets: 0,
  keys: 0,
  codeAttempts: 0,
  floor: 1,
  unlockedFloors: [1],
  cheese: 0,
  chicken: 0,
  ladder: 0,
  position: 0,
  score: 0,
  soulShield: false,
  soulShieldUsed: false,
};

/* TILE TYPES ...................................................................................................................*/
/* ..............................................................................................................................*/
/* ..............................................................................................................................*/

const TILE_TYPES = {
  EMPTY: "empty",
  ROOM: "room",
  STAIRS: "stairs",
  EXIT: "exit",
};

/* FLOOR SETTINGS ...............................................................................................................*/

const FLOOR_COUNT = 5;
let ROOF_CODE = "";
const MAX_CODE_ATTEMPTS = 3;

const FLOOR_LAYOUT = [
  TILE_TYPES.EMPTY,
  TILE_TYPES.EMPTY,
  TILE_TYPES.EMPTY,
  TILE_TYPES.ROOM,
  TILE_TYPES.EMPTY,
  TILE_TYPES.ROOM,
  TILE_TYPES.EMPTY,
  TILE_TYPES.ROOM,
  TILE_TYPES.EMPTY,
  TILE_TYPES.ROOM,
  TILE_TYPES.EMPTY,
  TILE_TYPES.ROOM,
  TILE_TYPES.EMPTY,
  TILE_TYPES.STAIRS,
];

/* GROUND FLOOR ROOMS ..........................................................................................................*/

const GROUND_FLOOR_ROOMS = [
  {
    id: "reception",
    name: "ACCUEIL",
    insideText:
      "Un vieux comptoir en bois accueille les rares visiteurs du Soul Motel",
    notifText: "Vous êtes devant l'accueil",
  },
  {
    id: "lounge",
    name: "SALON",
    insideText:
      "Quelques canapés usés entourent une télévision qui semble allumée depuis des années",
    notifText: "Vous êtes devant le salon",
  },
  {
    id: "bar",
    name: "BAR",
    insideText:
      "Le bar est presque vide. Quelques habitués aux allures de pimps discutent autour d'un verre",
    notifText: "Vous êtes devant le bar",
  },
  {
    id: "restaurant",
    name: "RESTAURANT",
    insideText: "On sent l'odeur du poulet frit de chez Connie's",
    notifText: "Vous êtes devant le restaurant",
  },
  {
    id: "laundry",
    name: "LINGERIE",
    insideText: "Des piles de draps s'entassent dans tous les coins",
    notifText: "Vous êtes devant la lingerie",
  },
];

/* ROOM CONTENT TYPES ..........................................................................................................*/

const ROOM_CONTENT = {
  SECRET_1: { label: "CLÉ D'ACCÈS ÉTAGE 2", type: "secret", soul: 50 },
  SECRET_2: { label: "CLÉ D'ACCÈS ÉTAGE 3", type: "secret", soul: 50 },
  SECRET_3: { label: "CLÉ D'ACCÈS ÉTAGE 4", type: "secret", soul: 50 },
  SECRET_4: { label: "CLÉ D'ACCÈS ÉTAGE 5", type: "secret", soul: 50 },
  SECRET_5: { label: "CLÉ D'ACCÈS AU TOIT", type: "secret", soul: 50 },

  CHICKEN: { label: "POULET", type: "item", item: "chicken" },
  CHEESE: { label: "FROMAGE", type: "item", item: "cheese" },
  LADDER: { label: "ECHELLE", type: "item", item: "ladder" },

  DOG: { label: "CHIEN", type: "trap", item: "chicken", soulLoss: 25 },
  RAT: { label: "RAT", type: "trap", item: "cheese", soulLoss: 25 },
  HOLE: { label: "TROU", type: "trap", item: "ladder", soulLoss: 25 },

  FAKE_1: {
    label: "Pimpin Ain't Easy",
    type: "fakeNegative",
    soulLoss: 20,
    text: "Un pimp attend dans sa chambre avec un air menaçant. Il vous prend pour un autre et vous laisse repartir. Cependant, cette courte interaction vous laisse une vibe amère",
  },
  FAKE_2: {
    label: "Dodge Tha Bottle !",
    type: "fakeNegative",
    soulLoss: 20,
    text: "Vous dérangez un couple en pleine action ! L'homme vous somme de sortir immédiatement en vous lançant une bouteille vide dans votre direction. Vous esquivez fort heureusement",
  },
  FAKE_3: {
    label: "Horror Room Experience",
    type: "fakeNegative",
    soulLoss: 20,
    text: "En entrant dans la chambre, une odeur âcre et insoutenable vous prend à la gorge. Apparemment, personne n'est venu faire le ménage depuis des lustres",
  },
  FAKE_4: {
    label: "The Night Scammer",
    type: "fakeNegative",
    soulLoss: 20,
    text: "Un inconnu vous convainc de lui prêter quelques dollars avant de disparaître dans le motel sans jamais revenir",
  },
  FAKE_5: {
    label: "Easy Peasy Lemon Squeezy",
    type: "fakePositive",
    soul: 25,
    text: "Un client du motel vous prend pour quelqu'un d'autre et vous offre généreusement un petit pourboire",
  },

  LORE_1: {
    label: "LORE 1",
    type: "lore",
    object: "un vieux magazine posé sur une table",
    text: "Un article raconte qu'un musicien aurait composé <span style='font-weight:bold; color:rgb(0,249,166);'>1</span> album dans ce motel avant de disparaître sans laisser de traces",
  },

  LORE_2: {
    label: "LORE 2",
    type: "lore",
    object: "une photo jaunie accrochée au mur",
    text: "La photo montre l'inauguration du Soul Motel en <span style='font-weight:bold; color:rgb(0,249,166);'>1</span> grande cérémonie alors que le quartier connaissait ses heures de gloire",
  },

  LORE_3: {
    label: "LORE 3",
    type: "lore",
    object: "un carnet oublié sur une commode",
    text: "Son propriétaire raconte avoir rencontré <span style='font-weight:bold; color:rgb(0,249,166);'>1</span> personnage particulièrement étrange durant son séjour au motel",
  },

  LORE_4: {
    label: "LORE 4",
    type: "lore",
    object: "une cassette audio posée au sol",
    text: "Une émission de radio SMQ 101 raconte comment <span style='font-weight:bold; color:rgb(0,249,166);'>1</span> légende de la Soul Music organisait des sessions improvisées dans le bar de l'hôtel",
  },
};

const EMPTY_TILE_MESSAGES = {
  1: {
    0: `Vous êtes au rez de chaussée du <span style="color: orangered; font-size: 0.9em; font-weight: bold; margin-left: 6px; margin-right: 6px; display: inline-block;">SOUL MOTEL</span>.`,
    1: "L'hôtel est dans son jus et son ambiance est quelque peu glauque.",
    2: "Vous entendez un peu de bruit au loin.",

    4: "Une odeur de tabac froid flotte dans le hall.",
    6: "Quelques clients discutent discrètement près d'une porte.",
    8: "Vous sentez une odeur de poulet frit.",
    10: "Un speaker diffuse la radio SMQ 101 dans les couloirs.",
    12: "Vous poursuivez votre exploration du rez-de-chaussée.",
  },

  2: {
    0: "Les parties communes n'ont pas été nettoyées depuis longtemps.",
    1: "Les couloirs sont emplis d'une certaine humidité.",
    2: "Une vieille moquette étouffe vos pas.",

    4: "Une ampoule clignote au plafond. Le dépanneur ne passera pas aujourd'hui.",
    6: "Une porte claque à votre passage. Vous n'êtes pas le bienvenu.",
    8: "Vous entendez une chasse d'eau derrière un mur. Bonjour la discrétion...",
    10: "Une odeur de lessive se mélange à celle du vieux bois.",
    12: "Plus vous progressez, plus l'ambiance paraît malfamée.",
  },

  3: {
    0: "Quelques chambres semblent encore occupées à cet étage.",
    1: "Vous entendez une télévision allumée derrière une porte.",
    2: "Une odeur de blunt et de Hennessy flotte dans le couloir.",

    4: "Des éclats de rire étouffés proviennent d'une chambre.",
    6: "Vous entendez quelqu'un briser un verre au loin.",
    8: "Des blattes courent sur les murs.",
    10: "Vous apercevez une lumière étrange sous une porte fermée.",
    12: "L'atmosphère devient de plus en plus lourde.",
  },

  4: {
    0: "L'étage semble plus calme que les précédents.",
    1: "L'état des murs est de plus en plus délabré.",
    2: "Vous apercevez des tags défraîchis sur les murs du couloir.",

    4: "Une canalisation semble fuir derrière une cloison.",
    6: "Le couloir paraît interminable.",
    8: "Des sacs vides de chez Connie's jonchent le sol.",
    10: "L'éclairage vacille pendant quelques secondes.",
    12: "Vous sentez un léger courant d'air frais.",
  },

  5: {
    0: "Le dernier étage est animé. Il y a du monde ici.",
    1: "Une radio diffuse un morceau des Isley Brothers au loin.",
    2: "Cet étage semble être réservé aux couples d'un soir !",

    4: "Un homme retire son alliance et rentre discrètement dans une chambre.",
    6: "Des odeurs d'eau de Cologne bon marché flottent dans l'air.",
    8: "L'ambiance se calme peu à peu.",
    10: "L'air semble plus frais à mesure que vous avancez.",

    12: "Vous vous sentez proche de la sortie.",
  },
};

/* TEST CONTENT LAYOUT .........................................................................................................*/

const FLOOR_CONTENT_LAYOUT = {
  1: [
    ROOM_CONTENT.SECRET_1, // Accueil
    ROOM_CONTENT.CHICKEN, // Salon
    ROOM_CONTENT.LORE_1, // Bar
    ROOM_CONTENT.CHEESE, // Restaurant
    ROOM_CONTENT.LADDER, // Lingerie
  ],

  2: [
    ROOM_CONTENT.SECRET_2,
    ROOM_CONTENT.DOG,
    ROOM_CONTENT.FAKE_1,
    ROOM_CONTENT.CHICKEN,
    ROOM_CONTENT.FAKE_2,
  ],

  3: [
    ROOM_CONTENT.SECRET_3,
    ROOM_CONTENT.RAT,
    ROOM_CONTENT.FAKE_3,
    ROOM_CONTENT.CHEESE,
    ROOM_CONTENT.LORE_2,
  ],

  4: [
    ROOM_CONTENT.SECRET_4,
    ROOM_CONTENT.HOLE,
    ROOM_CONTENT.FAKE_4,
    ROOM_CONTENT.LADDER,
    ROOM_CONTENT.LORE_3,
  ],

  5: [
    ROOM_CONTENT.SECRET_5,
    ROOM_CONTENT.DOG,
    ROOM_CONTENT.RAT,
    ROOM_CONTENT.HOLE,
    ROOM_CONTENT.FAKE_5,
  ],
};

/* DOM HELPERS ..................................................................................................................*/
/* ..............................................................................................................................*/
/* ..............................................................................................................................*/

function getGridMaze() {
  return document.querySelector(".grid-maze");
}

/* ENSURE MAZE TRACK ............................................................................................................*/

function ensureMazeTrack() {
  const grid = getGridMaze();
  if (!grid) return null;

  let track = document.getElementById("maze-track");

  if (!track) {
    track = document.createElement("div");
    track.id = "maze-track";
    grid.appendChild(track);
  }

  return track;
}

/* ENSURE MOVE BUTTON ...........................................................................................................*/

function ensureMoveButton() {
  return document.getElementById("maze-move-btn");
}

/* SET MAZE NOTIFICATION ........................................................................................................*/

function setMazeNotification(text) {
  const notif = document.querySelector(".cont-notif");
  if (!notif) return;

  notif.innerHTML = text;
}

function getEmptyTileNotification() {
  const floorMessages = EMPTY_TILE_MESSAGES[player.floor];

  if (!floorMessages) {
    return "Le couloir semble vide...";
  }

  return floorMessages[player.position] || floorMessages.default;
}

/* START MAZE TIMER .............................................................................................................*/
/* ..............................................................................................................................*/
/* ..............................................................................................................................*/

function startMazeTimer() {
  if (mazeTimerStarted) return;

  mazeTimerStarted = true;

mazeTimerInterval = setInterval(() => {
  if (mazePaused) return;

  mazeElapsedSeconds++;
    updateHUD();
  }, 1000);
}

function stopMazeTimer() {
  clearInterval(mazeTimerInterval);
  mazeTimerInterval = null;
  mazeTimerStarted = false;
}

/* HUD ..........................................................................................................................*/
/* ..............................................................................................................................*/
/* ..............................................................................................................................*/

function updateHUD() {
  const values = document.querySelectorAll(".ligne-stat-valeur-1");

  if (!values.length) return;

  if (values[0]) {
    values[0].innerHTML = `<span class="maze-time-fixed">${formatMazeTime(mazeElapsedSeconds)}</span>`;
  }

  if (values[1]) {
    values[1].textContent = player.soul;

    if (player.soul < 0 || player.soul >= 100) {
      values[1].style.color = "orangered";
      values[1].style.fontWeight = "bold";
    } else {
      values[1].style.color = "";
      values[1].style.fontWeight = "";
    }
  }

  if (values[2]) values[2].textContent = player.floor;
  if (values[3]) values[3].textContent = player.keys;
  if (values[4]) values[4].textContent = player.chicken;
  if (values[5]) values[5].textContent = player.cheese;
  if (values[6]) values[6].textContent = player.ladder;
}

/* FLOORS .......................................................................................................................*/
/* ..............................................................................................................................*/
/* ..............................................................................................................................*/

/* CREATE GROUND FLOOR .........................................................................................................*/

function createGroundFloor() {
  const tiles = FLOOR_LAYOUT.map((type) => ({
    type,
    roomData: null,
    revealed: false,
    completed: false,
  }));

  tiles[3].roomData = GROUND_FLOOR_ROOMS[0];
  tiles[5].roomData = GROUND_FLOOR_ROOMS[1];
  tiles[7].roomData = GROUND_FLOOR_ROOMS[2];
  tiles[9].roomData = GROUND_FLOOR_ROOMS[3];
  tiles[11].roomData = GROUND_FLOOR_ROOMS[4];

  return addContentToFloorRooms({
    floor: 1,
    tiles,
  });
}

/* GENERATE ROOF CODE .........................................................................................................*/

function generateRoofCode() {
  ROOF_CODE = "";

  for (let i = 0; i < 4; i++) {
    ROOF_CODE += Math.floor(Math.random() * 5) + 1;
  }
}

/* RANDOM CONTENT ..............................................................................................................*/
/* ..............................................................................................................................*/
/* ..............................................................................................................................*/

/* SHUFFLE ARRAY ...............................................................................................................*/

function shuffleArray(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

/* GENERATE RANDOM MAZE CONTENT ...............................................................................................*/

function generateRandomMazeContent() {
  const fixedContent = [
    ROOM_CONTENT.LORE_2,
    ROOM_CONTENT.LORE_3,
    ROOM_CONTENT.LORE_4,

    ROOM_CONTENT.FAKE_1,
    ROOM_CONTENT.FAKE_2,
    ROOM_CONTENT.FAKE_3,
    ROOM_CONTENT.FAKE_4,
    ROOM_CONTENT.FAKE_5,
  ];

  const itemPool = [
    ROOM_CONTENT.CHICKEN,
    ROOM_CONTENT.CHICKEN,
    ROOM_CONTENT.CHICKEN,

    ROOM_CONTENT.CHEESE,
    ROOM_CONTENT.CHEESE,
    ROOM_CONTENT.CHEESE,

    ROOM_CONTENT.LADDER,
    ROOM_CONTENT.LADDER,
    ROOM_CONTENT.LADDER,
  ];

  const trapPool = [
    ROOM_CONTENT.DOG,
    ROOM_CONTENT.DOG,
    ROOM_CONTENT.DOG,
    ROOM_CONTENT.DOG,
    ROOM_CONTENT.DOG,

    ROOM_CONTENT.RAT,
    ROOM_CONTENT.RAT,
    ROOM_CONTENT.RAT,
    ROOM_CONTENT.RAT,
    ROOM_CONTENT.RAT,

    ROOM_CONTENT.HOLE,
    ROOM_CONTENT.HOLE,
    ROOM_CONTENT.HOLE,
    ROOM_CONTENT.HOLE,
    ROOM_CONTENT.HOLE,
  ];

  const randomItems = shuffleArray(itemPool).slice(0, 3);
  const randomTraps = shuffleArray(trapPool).slice(0, 5);

  return shuffleArray([...fixedContent, ...randomItems, ...randomTraps]);
}

/* ADD CONTENT TO FLOOR ROOMS .................................................................................................*/

function addContentToFloorRooms(floorData) {
  if (floorData.floor === 1) {
    const contentList = FLOOR_CONTENT_LAYOUT[1];

    const roomIndexes = floorData.tiles
      .map((tile, index) => (tile.type === TILE_TYPES.ROOM ? index : null))
      .filter((index) => index !== null);

    roomIndexes.forEach((tileIndex, roomIndex) => {
      floorData.tiles[tileIndex].roomData = {
        ...(floorData.tiles[tileIndex].roomData || {}),
        content: contentList[roomIndex],
        contentResolved: false,
      };
    });
  }

  return floorData;
}

/* CREATE FLOOR ................................................................................................................*/

function createFloor(floorNumber) {
  const tiles = FLOOR_LAYOUT.map((type, index) => {
    let finalType = type;

    if (index === FLOOR_LAYOUT.length - 1) {
      finalType =
        floorNumber === FLOOR_COUNT ? TILE_TYPES.EXIT : TILE_TYPES.STAIRS;
    }

    return {
      type: finalType,
      roomData: null,
      revealed: false,
      completed: false,
    };
  });

  return addContentToFloorRooms({
    floor: floorNumber,
    tiles,
  });
}

/* GENERATE FLOORS ..............................................................................................................*/

/* GENERATE FLOORS ..............................................................................................................*/

function generateFloors() {
  FLOORS = [];

  generateRoofCode();

  FLOORS.push(createGroundFloor());

  const randomContent = generateRandomMazeContent();

  const forcedKeys = {
    2: ROOM_CONTENT.SECRET_2,
    3: ROOM_CONTENT.SECRET_3,
    4: ROOM_CONTENT.SECRET_4,
    5: ROOM_CONTENT.SECRET_5,
  };

  const forcedLores = {
    2: ROOM_CONTENT.LORE_2,
    3: ROOM_CONTENT.LORE_3,
    4: ROOM_CONTENT.LORE_4,
  };

  let contentIndex = 0;

  for (let floor = 2; floor <= FLOOR_COUNT; floor++) {
    const floorData = createFloor(floor);

    const roomIndexes = floorData.tiles
      .map((tile, index) => (tile.type === TILE_TYPES.ROOM ? index : null))
      .filter((index) => index !== null);

    const floorContentBase = [forcedKeys[floor]];

    if (forcedLores[floor]) {
      floorContentBase.push(forcedLores[floor]);
    }

    while (floorContentBase.length < 5 && contentIndex < randomContent.length) {
      const candidate = randomContent[contentIndex];

      contentIndex++;

      if (candidate?.type === "lore" || candidate?.type === "secret") {
        continue;
      }

      floorContentBase.push(candidate);
    }

    const floorContent = shuffleArray(floorContentBase);

    roomIndexes.forEach((tileIndex, roomIndex) => {
      floorData.tiles[tileIndex].roomData = {
        ...(floorData.tiles[tileIndex].roomData || {}),

        content: floorContent[roomIndex],

        contentResolved: false,
      };
    });

    FLOORS.push(floorData);
  }
}

/* MAP ..........................................................................................................................*/
/* ..............................................................................................................................*/
/* ..............................................................................................................................*/

function renderMap() {
  const map = document.getElementById("maze-map");
  if (!map) return;

  map.innerHTML = "";

  FLOORS.forEach((floorData) => {
    const line = document.createElement("div");
    line.className = "maze-map-line";

    if (floorData.floor === 1) {
      line.textContent = "REZ DE CHAUSSÉE";
    } else {
      line.textContent = "ÉTAGE " + floorData.floor;
    }

    if (floorData.floor === player.floor) {
      line.style.color = "orangered";
    }

    map.appendChild(line);
  });
}

/* IMAGES ALEATOIRES DES TABLEAUX ...................................... */

const PAINTINGS_LANDSCAPE = [
  "pictures-city-night-streets-background.jpg",
  "pictures-detroit-street-boy-painting.png",
  "pictures-james-brown.webp",
  "pictures-kids-running.png",
  "pictures-man-walkin-drinkin.png",
  "pictures-map-vue-de-haut.jpg",
  "pictures-memphis-bridge.png",
  "pictures-metro-station.png",
];

const PAINTINGS_PORTRAIT = [
  "pictures-aretha-franklin.webp",
  "pictures-cactus.svg",
  "pictures-dunk-pippen-ewing.webp",
  "pictures-havana-hat-man.png",
  "pictures-lady-finger-pointing.webp",
  "pictures-marlena-shaw.webp",
  "pictures-marvin-gaye.webp",
  "pictures-nyc-map.png",
  "pictures-skyscraper.png",
  "flower-pot-1.png",
  "flower-pot-1.svg",
  "item-hennessy-bottle.svg",
];

let shuffledLandscapePool = [];
let shuffledPortraitPool = [];

/* GET NEXT LANDSCAPE .................................................... */

function getNextLandscape() {
  if (shuffledLandscapePool.length === 0) {
    shuffledLandscapePool = shuffleArray([...PAINTINGS_LANDSCAPE]);
  }

  return shuffledLandscapePool.pop();
}

/* GET NEXT PORTRAIT ..................................................... */

function getNextPortrait() {
  if (shuffledPortraitPool.length === 0) {
    shuffledPortraitPool = shuffleArray([...PAINTINGS_PORTRAIT]);
  }

  return shuffledPortraitPool.pop();
}

function applyRandomPaintings(tileEl, tile) {
  if (!tile.paintingLandscape) {
    tile.paintingLandscape = getNextLandscape();
  }

  if (!tile.paintingPortrait) {
    tile.paintingPortrait = getNextPortrait();
  }

  const paint1 = tileEl.querySelector(".tile-label-11");

  const paint2 = tileEl.querySelector(".tile-label-15");

  if (paint1) {
    paint1.style.background = `url("/svg/legal/banner-bottom-nyc-games/coney/maze-game/${tile.paintingLandscape}") center / cover no-repeat`;
  }

  if (paint2) {
    paint2.style.background = `url("/svg/legal/banner-bottom-nyc-games/coney/maze-game/${tile.paintingPortrait}") center / cover no-repeat`;
  }
}

/* REGLES VISUELLES DES TILES ............................................ */

function applyTileVisualRules(tileEl, tile) {
  const type = String(tile.type).toLowerCase();

  tileEl.querySelectorAll(".tile-label").forEach((label) => {
    label.style.display = "none";
  });

  if (type.includes("empty")) {
    showTileLabels(tileEl, [1, 4, 5, 6, 7, 10, 11, 14, 15]);
  }

  if (type.includes("room")) {
    showTileLabels(tileEl, [1, 2, 3, 4, 5, 6, 7, 10, 11, 14, 15]);
  }

  if (type.includes("stairs")) {
    showTileLabels(tileEl, [1, 4, 5, 6, 7, 12]);
  }

  if (type.includes("exit")) {
    showTileLabels(tileEl, [1, 4, 5, 13]);
  }
  applyRandomPaintings(tileEl, tile);
}

/* AFFICHER LABELS TILE .................................................. */

function showTileLabels(tileEl, numbers) {
  numbers.forEach((num) => {
    const label = tileEl.querySelector(`.tile-label-${num}`);
    if (label) label.style.display = "block";
  });
}

/* RENDER CORRIDOR ..............................................................................................................*/

function renderCorridor() {
  const track = ensureMazeTrack();
  if (!track) return;

  track.innerHTML = "";

  const currentFloor = FLOORS[player.floor - 1];
  if (!currentFloor) return;

  currentFloor.tiles.forEach((tile, index) => {
    const tileEl = document.createElement("div");
    tileEl.className = "maze-tile";
    tileEl.classList.add(`floor-${player.floor}-tile-${index + 1}`);

    // TILES DE LHOTEL..............................................................................................................//
    // .............................................................................................................................//
    // .............................................................................................................................//

    /* CREATION DES ELEMENTS VISUELS DE TILE ................................. */

    for (let i = 1; i <= 15; i++) {
      const label = document.createElement("div");
      label.className = `tile-label tile-label-${i}`;
      tileEl.appendChild(label);
    }

    applyTileVisualRules(tileEl, tile);

    const roomSign = tileEl.querySelector(".tile-label-3");

    if (roomSign) {
      if (player.floor === 1 && tile.roomData?.name) {
        roomSign.setAttribute("data-room-name", tile.roomData.name);
      } else if (tile.type === TILE_TYPES.ROOM) {
        const roomTiles = currentFloor.tiles.filter(
          (t) => t.type === TILE_TYPES.ROOM,
        );

        const roomNumber = roomTiles.indexOf(tile) + 1;

        roomSign.setAttribute(
          "data-room-name",
          `${player.floor}${String(roomNumber).padStart(2, "0")}`,
        );
      }
    }

    if (tile.type === TILE_TYPES.EMPTY) {
      tileEl.classList.add("empty-tile");
    }

    if (tile.type === TILE_TYPES.ROOM) {
      tileEl.classList.add("room-tile");
    }

    if (tile.type === TILE_TYPES.STAIRS) {
      tileEl.classList.add("stairs-tile");
    }

    if (tile.type === TILE_TYPES.EXIT) {
      tileEl.classList.add("exit-tile");
    }

    if (index < player.position) {
      tileEl.classList.add("visited");
    }

    if (index === player.position) {
      tileEl.classList.add("active");
    }

    track.appendChild(tileEl);
  });
}

/* UPDATE TRACK POSITION ........................................................................................................*/

function updateTrackPosition() {
  const track = document.getElementById("maze-track");
  if (!track) return;

  const activeTile = track.children[player.position];
  if (!activeTile) return;

  track.style.transform = `translateX(${-activeTile.offsetLeft}px)`;
}

/* LOADER .......................................................................................................................*/
/* ..............................................................................................................................*/
/* ..............................................................................................................................*/

/* SHOW LOADER ..................................................................................................................*/

function showLoader() {
  const moveBtn = document.getElementById("maze-move-btn");
  if (!moveBtn) return;

  moveBtn.innerHTML = `
    <div class="maze-loader-container">
      <img
        src="/images/shared/logo-smq.webp"
        alt="SMQ"
        class="maze-loader"
      />
    </div>
  `;

  moveBtn.onclick = null;
}

/* HIDE LOADER ..................................................................................................................*/

function hideLoader(callback) {
  const loader = document.querySelector(".maze-loader");

  if (!loader) {
    callback();
    return;
  }

  loader.classList.add("maze-loader-fade-out");

  addMazeTimeout(() => {
    callback();
  }, 300);
}

/* ROOM CONTENT .................................................................................................................*/
/* ..............................................................................................................................*/
/* ..............................................................................................................................*/

/* SHOW SOUL MAX POPUP..........................................................................................................*/

function showSoulMaxPopup() {
  const gridMaze = document.querySelector(".cont-center");

  if (!gridMaze) return;

  const oldPopup = document.querySelector(".maze-soul-popup");

  if (oldPopup) {
    oldPopup.remove();
  }

  const popup = document.createElement("div");

  popup.className = "maze-lore-popup maze-soul-popup";

  popup.innerHTML = `
    <div class="maze-lore-popup-title soul-max-title">
      SOUL POWER ACTIVÉ
    </div>

    <div class="maze-lore-popup-text">
      Votre <strong>SOUL</strong> est à son max !
    </div>
  `;

  gridMaze.appendChild(popup);

  addMazeTimeout(() => {
    if (popup && popup.parentNode) {
      popup.remove();
    }
  }, 5000);
}

/* ADD SOUL.....................................................................................................................*/

function addSoul(amount) {
  const oldSoul = player.soul;

  player.soul += amount;

  if (
    oldSoul < 100 &&
    player.soul >= 100 &&
    !player.soulShield &&
    !player.soulShieldUsed
  ) {
    player.soulShield = true;

    MazeGameAudioManager.playSFX(SFX.VICTORY);

    showSoulMaxPopup();
  }

  updateHUD();
}

/* GET LORE CONTENT TEXT ......................................................................................................*/

function getLoreContentText(content) {
  if (content === ROOM_CONTENT.LORE_1) {
    return `
      Un article raconte qu'un musicien aurait composé
      <span style="font-weight:bold; color:rgb(0,249,166);">
        ${ROOF_CODE[0]}
      </span>
      album dans ce motel avant de disparaître sans laisser de traces
    `;
  }

  if (content === ROOM_CONTENT.LORE_2) {
    return `
      La photo montre l'inauguration du Soul Motel en
      <span style="font-weight:bold; color:rgb(0,249,166);">
        ${ROOF_CODE[1]}
      </span>
      grande cérémonie alors que le quartier connaissait ses heures de gloire
    `;
  }

  if (content === ROOM_CONTENT.LORE_3) {
    return `
      Son propriétaire raconte avoir rencontré
      <span style="font-weight:bold; color:rgb(0,249,166);">
        ${ROOF_CODE[2]}
      </span>
      personnage particulièrement étrange durant son séjour au motel
    `;
  }

  if (content === ROOM_CONTENT.LORE_4) {
    return `
      Une émission de radio SMQ 101 raconte comment
      <span style="font-weight:bold; color:rgb(0,249,166);">
        ${ROOF_CODE[3]}
      </span>
      légende de la Soul Music organisait des sessions improvisées dans le bar de l'hôtel
    `;
  }

  return content.text;
}

/* SHOW LORE POPUP .............................................................................................................*/

function showLorePopup(content) {
  const gridMaze = document.querySelector(".grid-maze");
  if (!gridMaze) return;

  const oldPopup = document.querySelector(".maze-lore-popup");

  if (oldPopup) {
    oldPopup.remove();
  }

  const popup = document.createElement("div");
  popup.className = "maze-lore-popup";

  popup.innerHTML = `
    <div class="maze-lore-popup-title">
      ${content.label}
    </div>

    <div class="maze-lore-popup-text">
      ${getLoreContentText(content)}
    </div>

    <button class="maze-lore-popup-close" type="button">
      FERMER
    </button>
  `;

  gridMaze.appendChild(popup);

  const closeBtn = popup.querySelector(".maze-lore-popup-close");

  if (closeBtn) {
    closeBtn.onclick = () => {
      popup.remove();
    };
  }
}

/* SHOW FAKE EVENT POPUP ........................................................................................................*/

function showFakeEventPopup(content) {
  const gridMaze = document.querySelector(".grid-maze");
  if (!gridMaze) return;

  const oldPopup = document.querySelector(".maze-fake-popup");

  if (oldPopup) {
    oldPopup.remove();
  }

  const popup = document.createElement("div");
  popup.className = "maze-fake-popup";

  popup.innerHTML = `
    <div class="maze-fake-popup-title">
      ${content.label}
    </div>

    <div class="maze-fake-popup-text">
      ${content.text}
    </div>
  `;

  gridMaze.appendChild(popup);
}

/* LOSE SOUL....................................................................................................................*/

function loseSoul(amount) {
  if (player.soulShield) {
    player.soulShield = false;
    player.soulShieldUsed = true;

    MazeGameAudioManager.playSFX(SFX.LAUGH);

    setMazeNotification(`
      Votre
      <span style="
        font-weight: bold;
        margin-left: 6px;
        margin-right: 6px;
        display: inline-block;
        font-size: 0.9em;
      ">
        SOUL POWER
      </span>
      vous protège !

      Vous ne perdez pas de SOUL.
    `);

    updateHUD();

    return true;
  }

  player.soul -= amount;

  updateHUD();

  return false;
}

/* HANDLE TRAP .................................................................................................................*/

function handleTrap(content, tile) {
  const itemLabels = {
    chicken: "POULET",
    cheese: "FROMAGE",
    ladder: "ECHELLE",
  };

  const neededItem = itemLabels[content.item];

  switch (content.item) {
    case "chicken":
      MazeGameAudioManager.playSFX(SFX.TRAP_DOG);
      break;

    case "cheese":
      MazeGameAudioManager.playSFX(SFX.TRAP_RAT);
      break;

    case "ladder":
      MazeGameAudioManager.playSFX(SFX.TRAP_HOLE);
      break;
  }

  setMazeNotification(`
    Vous vous retrouvez face à un
    <span style="font-weight: bold; font-size: 0.9em; margin-left: 6px; margin-right: 6px; display: inline-block;">
      ${content.label}
    </span>
    Voulez-vous utiliser un
    <span style="font-weight: bold; margin-left: 6px; margin-right: 6px; display: inline-block;">
      ${neededItem}
    </span>
    ?
    <button class="maze-trap-btn" id="trap-yes">OUI</button>
    <button class="maze-trap-btn" id="trap-no">NON</button>
  `);

  const yesBtn = document.getElementById("trap-yes");

  const noBtn = document.getElementById("trap-no");

  function showReturnButton() {
    const moveBtn = document.getElementById("maze-move-btn");

    if (moveBtn) {
      moveBtn.innerHTML = "REVENIR";
      moveBtn.onclick = () => {
        returnToCorridor();
      };
    }
  }

  if (yesBtn) {
    yesBtn.onclick = () => {
      if (player[content.item] > 0) {
        player[content.item]--;

        MazeGameAudioManager.playSFX(SFX.PICKUP_ITEM);

        setMazeNotification(`
          Vous évitez le
          <span style="font-weight: bold; font-size: 0.9em; margin-left: 6px; margin-right: 6px; display: inline-block;">
            ${content.label}
          </span>
          grâce au
          <span style="font-weight: bold; font-size: 0.9em; margin-left: 6px; margin-right: 6px; display: inline-block;">
            ${neededItem}
          </span>
        `);
      } else {
        const soulPowerLost = loseSoul(content.soulLoss);

        if (!soulPowerLost) {
          MazeGameAudioManager.playSFX(SFX.BAD_EVENT);
        }

        if (!soulPowerLost) {
          setMazeNotification(`
            Vous n'avez pas de
            <span style="font-weight: bold; font-size: 0.9em; margin-left: 6px; margin-right: 6px; display: inline-block;">
              ${neededItem}
            </span>
            Vous perdez
            <span style="
              color: orangered;
              font-weight: bold;
              margin-left: 8px;
              margin-right: 8px;
              display: inline-block;
              font-size: 0.9em;
            ">
              -${content.soulLoss} SOUL
            </span>
          `);
        }
      }

      tile.roomData.contentResolved = true;

      updateHUD();
      showReturnButton();
    };
  }

  if (noBtn) {
    noBtn.onclick = () => {
      const soulPowerLost = loseSoul(content.soulLoss);

      if (!soulPowerLost) {
        MazeGameAudioManager.playSFX(SFX.BAD_EVENT);
      }

      if (!soulPowerLost) {
        setMazeNotification(`
          Vous n'avez pas voulu utiliser le
          <span style="font-weight: bold; font-size: 0.9em; margin-left: 6px; margin-right: 6px; display: inline-block;">
            ${neededItem}
          </span>
          Vous perdez
          <span style="
            color: orangered;
            font-weight: bold;
            margin-left: 8px;
            margin-right: 8px;
            display: inline-block;
            font-size: 0.9em;
          ">
            -${content.soulLoss} SOUL
          </span>
        `);
      }

      tile.roomData.contentResolved = true;

      updateHUD();
      showReturnButton();
    };
  }
}

/* RESOLVE ROOM CONTENT ........................................................................................................*/

function resolveRoomContent(tile) {
  if (!tile?.roomData?.content) return;

  const content = tile.roomData.content;

  if (tile.roomData.contentResolved && content.type !== "lore") {
    const moveBtn = document.getElementById("maze-move-btn");

    setMazeNotification("La pièce est vide.");

    if (moveBtn) {
      moveBtn.innerHTML = "REVENIR";
      moveBtn.onclick = () => {
        returnToCorridor();
      };
    }

    updateHUD();
    return;
  }

  if (content.type === "secret") {
    player.keys++;

    MazeGameAudioManager.playSFX(SFX.PICKUP_KEY);

    addSoul(content.soul);

    setMazeNotification(
      `Vous avez trouvé la
      <span style="
        font-weight: bold;
        margin-left: 6px;
        margin-right: 6px;
        display: inline-block;
        font-size: 0.9em;
      ">
        ${content.label}
      </span>
      !

      Vous gagnez

      <span style="
        color: rgb(0,249,166);
        font-weight: bold;
        margin-left: 6px;
        display: inline-block;
        font-size: 0.9em;
      ">
        +${content.soul} SOUL
      </span>`,
    );
  }

  if (content.type === "item") {
    player[content.item]++;

    MazeGameAudioManager.playSFX(SFX.PICKUP_ITEM);

    setMazeNotification(
      `Vous avez récupéré

      <span style="
        font-weight: bold;
        margin-left: 8px;
        margin-right: 8px;
        display: inline-block;
        color: rgb(0,249,166);
        font-size: 0.9em;
      ">
        ${content.label} x 1
      </span>`,
    );
  }

  if (content.type === "fakeNegative") {
    const moveBtn = document.getElementById("maze-move-btn");

    const soulPowerLost = loseSoul(content.soulLoss);

    if (!soulPowerLost) {
      MazeGameAudioManager.playSFX(SFX.BAD_EVENT);
    }

    showFakeEventPopup(content);

    if (!soulPowerLost) {
      setMazeNotification(`
    Vous perdez
    <span style="
      color: orangered;
      font-weight: bold;
      margin-left: 8px;
      margin-right: 8px;
      display: inline-block;
      font-size: 0.9em;
    ">
      -${content.soulLoss} SOUL
    </span>
  `);
    }

    if (moveBtn) {
      moveBtn.innerHTML = "REVENIR";
      moveBtn.onclick = () => {
        returnToCorridor();
      };
    }

    tile.roomData.contentResolved = true;
    updateHUD();
    return;
  }

  if (content.type === "fakePositive") {
    const moveBtn = document.getElementById("maze-move-btn");

    addSoul(content.soul);

    MazeGameAudioManager.playSFX(SFX.GOOD_EVENT);
    showFakeEventPopup(content);

    setMazeNotification(`
      Vous gagnez
      <span style="
        color: rgb(0,249,166);
        font-weight: bold;
        margin-left: 8px;
        margin-right: 8px;
        display: inline-block;
        font-size: 0.9em;
      ">
        +${content.soul} SOUL
      </span>
    `);

    if (moveBtn) {
      moveBtn.innerHTML = "REVENIR";
      moveBtn.onclick = () => {
        returnToCorridor();
      };
    }

    tile.roomData.contentResolved = true;
    updateHUD();
    return;
  }

  if (content.type === "lore") {
    const moveBtn = document.getElementById("maze-move-btn");

    setMazeNotification(
      `Vous entrez dans la chambre. Rien de spécial ici à part ${content.object}`,
    );

    if (moveBtn) {
      moveBtn.innerHTML = "";

      const readChoice = document.createElement("span");
      const backChoice = document.createElement("span");

      readChoice.className = "maze-choice-btn";
      backChoice.className = "maze-choice-btn";

      readChoice.textContent = "LIRE";
      backChoice.textContent = "REVENIR";

      readChoice.onclick = (e) => {
        e.preventDefault();

        e.stopPropagation();

        MazeGameAudioManager.playSFX(SFX.PAGE_TURN);

        showLorePopup(content);
      };

      backChoice.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        returnToCorridor();
      };

      moveBtn.appendChild(readChoice);
      moveBtn.appendChild(backChoice);
    }

    tile.roomData.contentResolved = true;
    updateHUD();
    return;
  }

  if (content.type === "trap") {
    handleTrap(content, tile);
    return;
  }

  tile.roomData.contentResolved = true;
  updateHUD();
}

/* REGLES VISUELLES CHAMBRE TEST ............................................................................................... */
/* .............................................................................................................................. */
/* .............................................................................................................................. */

function applyTestRoomVisualRules(insideView, currentTile) {
  const mandatoryLabels = [1, 2, 3, 4, 11, 12, 13, 16, 17];

  const portraitLabels = [8, 9, 10];

  const optionalLabels = [5, 6, 7, 14, 15];

  if (!currentTile.roomVisuals) {
    const portrait =
      portraitLabels[Math.floor(Math.random() * portraitLabels.length)];

    const optional = optionalLabels.filter(() => Math.random() < 0.5);

    currentTile.roomVisuals = {
      portrait,
      optional,
    };
  }

  insideView.querySelectorAll(".room-label").forEach((label) => {
    label.style.display = "none";
  });

  mandatoryLabels.forEach((num) => {
    const label = insideView.querySelector(`.room-label-${num}`);

    if (label) {
      label.style.display = "block";
    }
  });

  const portraitLabel = insideView.querySelector(
    `.room-label-${currentTile.roomVisuals.portrait}`,
  );

  if (portraitLabel) {
    portraitLabel.style.display = "block";
  }

  currentTile.roomVisuals.optional.forEach((num) => {
    const label = insideView.querySelector(`.room-label-${num}`);

    if (label) {
      label.style.display = "block";
    }
  });
}

/* ENTER ROOM ...................................................................................................................*/

function enterRoom() {
  const gridMaze = document.querySelector(".grid-maze");

  const track = document.getElementById("maze-track");

  const currentFloor = FLOORS[player.floor - 1];

  const currentTile = currentFloor?.tiles[player.position];

  const moveBtn = document.getElementById("maze-move-btn");

  const mazePlayer = document.getElementById("maze-player");

  if (mazePlayer) {
    mazePlayer.classList.remove("show");
  }

  if (!gridMaze || !track || !currentTile) return;

  currentTile.completed = true;

  MazeGameAudioManager.stopMusic();

  MazeGameAudioManager.playSFX(SFX.DOOR_OPEN);

  showLoader();

  track.style.transition = "opacity 1s ease";

  track.style.opacity = "0";

  setMazeNotification(
    currentTile.roomData?.name
      ? `Vous ouvrez la porte de ${currentTile.roomData.name.toLowerCase()}...`
      : "Vous ouvrez la porte de la chambre...",
  );

  addMazeTimeout(() => {
    const doorView = document.createElement("div");

    doorView.className = "maze-room-view maze-door-view";

    const activeTile = document.querySelector(".maze-tile.active");

    if (activeTile) {
      const doorAnim = document.createElement("div");

      doorAnim.className = "maze-door-animation";

      const doorClone = activeTile
        .querySelector(".tile-label-2")
        ?.cloneNode(true);

      const signClone = activeTile
        .querySelector(".tile-label-3")
        ?.cloneNode(true);

      if (doorClone) {
        doorClone.classList.add("maze-door-clone");

        doorAnim.appendChild(doorClone);
      }

      if (signClone) {
        signClone.classList.add("maze-sign-clone");

        doorAnim.appendChild(signClone);
      }

      doorView.appendChild(doorAnim);
    }

    gridMaze.appendChild(doorView);

    addMazeTimeout(() => {
      doorView.classList.add("visible");

      addMazeTimeout(() => {
        doorView.classList.add("zooming");

        addMazeTimeout(() => {
          doorView.classList.remove("visible");

          addMazeTimeout(() => {
            doorView.remove();

            const insideView = document.createElement("div");

            insideView.className = "maze-room-view maze-inside-view";

            insideView.innerHTML = `
  <div class="maze-room-text">
    TEST ROOM
  </div>
`;

            /* ELEMENTS VISUELS CHAMBRE .................................................................................................... */
            /* .............................................................................................................................. */
            /* .............................................................................................................................. */

            if (currentTile.roomData?.id === "reception") {
              for (let i = 1; i <= 20; i++) {
                const label = document.createElement("div");

                label.className = `reception-label reception-label-${i}`;

                insideView.appendChild(label);
              }
            } else if (currentTile.roomData?.id === "laundry") {
              for (let i = 1; i <= 20; i++) {
                const label = document.createElement("div");

                label.className = `laundry-label laundry-label-${i}`;

                insideView.appendChild(label);
              }
            } else if (currentTile.roomData?.id === "restaurant") {
              for (let i = 1; i <= 39; i++) {
                const label = document.createElement("div");

                label.className = `restaurant-label restaurant-label-${i}`;

                insideView.appendChild(label);
              }
            } else if (currentTile.roomData?.id === "bar") {
              for (let i = 1; i <= 50; i++) {
                const label = document.createElement("div");

                label.className = `bar-label bar-label-${i}`;

                insideView.appendChild(label);
              }
            } else if (currentTile.roomData?.id === "lounge") {
              for (let i = 1; i <= 20; i++) {
                const label = document.createElement("div");

                label.className = `lounge-label lounge-label-${i}`;

                insideView.appendChild(label);
              }
            } else if (player.floor >= 2) {
              for (let i = 1; i <= 17; i++) {
                const label = document.createElement("div");

                label.className = `room-label room-label-${i}`;

                insideView.appendChild(label);
              }

              applyTestRoomVisualRules(insideView, currentTile);
            }

            gridMaze.appendChild(insideView);

            addMazeTimeout(() => {
              insideView.classList.add("visible");

              if (player.floor === 1 && currentTile.roomData) {
                MazeGameAudioManager.playRdcMusic(currentTile.roomData.id);
              } else if (player.floor >= 2) {
                MazeGameAudioManager.playRoomMusic();
              }

              setMazeNotification(
                currentTile.roomData?.name
                  ? `Vous êtes dans ${currentTile.roomData.name.toLowerCase()}...`
                  : "Vous êtes dans la chambre...",
              );

              resolveRoomContent(currentTile);

              if (
                moveBtn &&
                currentTile.roomData?.content?.type !== "lore" &&
                currentTile.roomData?.content?.type !== "fakeNegative" &&
                currentTile.roomData?.content?.type !== "fakePositive" &&
                currentTile.roomData?.content?.type !== "trap"
              ) {
                moveBtn.innerHTML = "REVENIR";

                moveBtn.onclick = () => {
                  returnToCorridor();
                };
              }
            }, 50);
          }, 1000);
        }, 3000);
      }, 1000);
    }, 50);
  }, 1000);
}

/* RETURN TO CORRIDOR ...........................................................................................................*/

function returnToCorridor() {
  const insideView = document.querySelector(".maze-inside-view");

  const track = document.getElementById("maze-track");

  const currentFloor = FLOORS[player.floor - 1];

  const currentTile = currentFloor?.tiles[player.position];

  const mazePlayer = document.getElementById("maze-player");

  /* AUDIO ....................................................................................................................*/
  /* ..........................................................................................................................*/
  /* ..........................................................................................................................*/

  MazeGameAudioManager.playSFX(SFX.DOOR_CLOSED);

  addMazeTimeout(() => {
    MazeGameAudioManager.playFloorMusic(player.floor);
  }, 1000);

  showLoader();

  document.querySelector(".maze-lore-popup")?.remove();

  document.querySelector(".maze-fake-popup")?.remove();

  if (insideView) {
    insideView.classList.remove("visible");
  }

  setMazeNotification("");

  if (mazePlayer) {
    mazePlayer.classList.remove("show");
  }

  addMazeTimeout(() => {
    if (insideView) {
      insideView.remove();
    }
  }, 1000);

  addMazeTimeout(() => {
    if (track) {
      track.style.transition = "opacity 1s ease";
      track.style.opacity = "1";
    }

    addMazeTimeout(() => {
      hideLoader(() => {
        showCorridorElements(
          currentTile?.roomData?.notifText || getEmptyTileNotification(),
        );
      });
    }, 100);

    addMazeTimeout(() => {
      if (track) {
        track.style.opacity = "";

        track.style.transition = "";

        track.classList.remove(
          "maze-corridor-fade-out",
          "maze-corridor-fade-in",
        );
      }
    }, 1100);
  }, 1600);
}

/* NEXT FLOOR AND WIN ...........................................................................................................*/
/* ..............................................................................................................................*/
/* ..............................................................................................................................*/

/* NEXT FLOOR ...................................................................................................................*/

function nextFloor() {
  const requiredKey = player.floor;

  if (player.keys < requiredKey) {
    setMazeNotification(`
    Vous n'avez pas la
    <span style="font-weight: bold; font-size: 0.9em; margin-left: 6px; margin-right: 6px; display: inline-block;">
      clé d'accès à l'étage ${player.floor + 1}
    </span>
    Cherchez bien dans cet étage
  `);

    return;
  }

  if (player.floor >= FLOOR_COUNT) return;

  const mazePlayer = document.getElementById("maze-player");

  if (mazePlayer) {
    mazePlayer.classList.remove("show");
  }

  MazeGameAudioManager.stopMusic();

  MazeGameAudioManager.playSFX(SFX.DOOR_OPEN);

  addMazeTimeout(() => {
    MazeGameAudioManager.playSFX(SFX.FOOTSTEPS_STAIRS);
  }, 1000);

  const gridMaze = document.querySelector(".grid-maze");

  if (gridMaze) {
    const stairsView = document.createElement("div");

    stairsView.className = "maze-room-view maze-stairs-view";

    stairsView.innerHTML = `
    <img
      src="/svg/legal/banner-bottom-nyc-games/coney/maze-game/stairs.png"
      class="maze-stairs-image"
      alt="stairs"
    />
  `;

    gridMaze.appendChild(stairsView);

    addMazeTimeout(() => {
      if (!player.unlockedFloors.includes(player.floor + 1)) {
        MazeGameAudioManager.playSFX(SFX.STAIRS_OPEN);
      }

      stairsView.classList.add("visible");
      stairsView.classList.add("zooming");
    }, 500);
  }

  const track = document.getElementById("maze-track");
  if (!track) return;

  track.classList.remove("maze-floor-fade-in");
  track.classList.add("maze-floor-fade-out");

  if (player.unlockedFloors.includes(player.floor + 1)) {
    setMazeNotification("Vous montez à l'étage supérieur...");
  } else {
    setMazeNotification(
      "Vous utilisez la clé et accédez à l'étage supérieur...",
    );
  }

  addMazeTimeout(() => {
    const oldStairs = document.querySelector(".maze-stairs-view");

    if (oldStairs) {
      oldStairs.classList.add("fade-out");

      addMazeTimeout(() => {
        oldStairs.remove();
      }, 500);
    }

    player.floor++;

    MazeGameAudioManager.playFloorMusic(player.floor);

    if (!player.unlockedFloors.includes(player.floor)) {
      player.unlockedFloors.push(player.floor);
    }
    player.position = 0;

    updateHUD();
    renderMap();
    renderCorridor();
    updateTrackPosition();

    const newTrack = document.getElementById("maze-track");
    if (!newTrack) return;

    newTrack.classList.remove("maze-floor-fade-out");

    newTrack.classList.remove(
      "maze-corridor-fade-out",
      "maze-corridor-fade-in",
    );

    void newTrack.offsetWidth;

    newTrack.classList.add("maze-corridor-fade-in");

    showCorridorElements(getEmptyTileNotification());
  }, 6000);
}

/* PREVIOUS FLOOR ..............................................................................................................*/

function previousFloor() {
  if (player.floor <= 1) return;

  const mazePlayer = document.getElementById("maze-player");

  if (mazePlayer) {
    mazePlayer.classList.remove("show");
  }

  showLoader();

  MazeGameAudioManager.stopMusic();

  MazeGameAudioManager.playSFX(SFX.DOOR_OPEN);

  addMazeTimeout(() => {
    MazeGameAudioManager.playSFX(SFX.FOOTSTEPS_STAIRS);
  }, 1000);

  const gridMaze = document.querySelector(".grid-maze");

  if (gridMaze) {
    const stairsView = document.createElement("div");

    stairsView.className = "maze-room-view maze-stairs-view";

    stairsView.innerHTML = `
      <img
        src="/svg/legal/banner-bottom-nyc-games/coney/maze-game/stairs.png"
        class="maze-stairs-image"
        alt="stairs"
      />
    `;

    gridMaze.appendChild(stairsView);

    addMazeTimeout(() => {
      stairsView.classList.add("visible");

      stairsView.classList.add("descending");
    }, 500);
  }

  const track = document.getElementById("maze-track");

  if (!track) return;

  track.classList.remove("maze-floor-fade-in");

  track.classList.add("maze-floor-fade-out");

  setMazeNotification("Vous redescendez à l'étage inférieur...");

  addMazeTimeout(() => {
    const oldStairs = document.querySelector(".maze-stairs-view");

    if (oldStairs) {
      oldStairs.classList.add("fade-out");

      addMazeTimeout(() => {
        oldStairs.remove();
      }, 500);
    }

    player.floor--;

    MazeGameAudioManager.playFloorMusic(player.floor);

    player.position = 13;
    const soulProtected = loseSoul(10);

    if (!soulProtected) {
      MazeGameAudioManager.playSFX(SFX.BAD_EVENT);
    }

    updateHUD();
    renderMap();
    renderCorridor();
    updateTrackPosition();

    const newTrack = document.getElementById("maze-track");
    if (!newTrack) return;

    newTrack.classList.remove("maze-floor-fade-out");

    newTrack.classList.remove(
      "maze-corridor-fade-out",
      "maze-corridor-fade-in",
    );

    void newTrack.offsetWidth;

    newTrack.classList.add("maze-corridor-fade-in");

    if (!soulProtected) {
      setMazeNotification(`
    Il faut partir de ce motel au plus vite !
    Vous perdez
    <span style="
      color: orangered;
      font-weight: bold;
      margin-left: 8px;
      margin-right: 8px;
      display: inline-block;
      font-size: 0.9em;
    ">
      -10 SOUL
    </span>
  `);
    }

    showCorridorElements(getEmptyTileNotification());
  }, 6000);
}

// ROOF ESCAPE ANIMATION........................................................................................................*/

function showRoofEscapeAnimation() {
  const gridMaze = document.querySelector(".grid-maze");

  if (!gridMaze) return;

  const mazePlayer = document.getElementById("maze-player");

  if (mazePlayer) {
    mazePlayer.classList.remove("show");
  }

  const roofView = document.createElement("div");

  roofView.className = "maze-room-view maze-roof-view visible";

  roofView.innerHTML = `
    <div class="maze-roof-animation">
      <div class="maze-roof-wall"></div>
      <div class="maze-roof-ladder"></div>
    </div>
  `;

  gridMaze.appendChild(roofView);

  addMazeTimeout(() => {
    MazeGameAudioManager.playSFX(SFX.LADDER_CLIMB);

    roofView.classList.add("zooming");
  }, 100);

  addMazeTimeout(() => {
    roofView.remove();
    winMazeGame();
  }, 8500);
}

/* SHOW ROOF CODE PANEL ........................................................................................................*/
/* .............................................................................................................................*/
/* .............................................................................................................................*/

/* SHOW ROOF CODE PANEL ........................................................................................................*/
/* .............................................................................................................................*/
/* .............................................................................................................................*/

function showRoofCodePanel() {
  const gridMaze = document.querySelector(".grid-maze");

  if (!gridMaze) return;

  const oldPanel = document.querySelector(".maze-code-popup");

  if (oldPanel) {
    oldPanel.remove();
  }

  const panel = document.createElement("div");

  panel.className = "maze-lore-popup maze-code-popup";

  panel.innerHTML = `

    <div class="maze-lore-popup-title">
      DIGICODE DU TOIT
    </div>

    <div class="maze-lore-popup-text">
      Entrez le code trouvé dans les textes du motel.
    </div>

    <input
      id="maze-roof-code-input"
      type="text"
      maxlength="4"
      autocomplete="off"
    />

    <div class="maze-code-display">
      <span class="maze-code-slot blink">-</span>
      <span class="maze-code-slot">-</span>
      <span class="maze-code-slot">-</span>
      <span class="maze-code-slot">-</span>
    </div>

    <button
      class="maze-lore-popup-close"
      id="maze-code-submit"
      type="button"
    >
      VALIDER
    </button>

  `;

  gridMaze.appendChild(panel);

  const input = document.getElementById("maze-roof-code-input");

  const submit = document.getElementById("maze-code-submit");

  const slots = panel.querySelectorAll(".maze-code-slot");

  function updateCodeDisplay() {
    const value = input ? input.value.trim() : "";

    slots.forEach((slot, index) => {
      slot.textContent = value[index] ? value[index] : "-";

      slot.classList.remove("blink");
    });

    if (value.length < slots.length && slots[value.length]) {
      slots[value.length].classList.add("blink");
    }
  }

  function submitRoofCode() {
    const value = input ? input.value.trim() : "";

    if (value === ROOF_CODE) {
      MazeGameAudioManager.playSFX(SFX.CORRECT_CODE);

      panel.remove();

      showRoofEscapeAnimation();

      return;
    }

    player.codeAttempts++;

    if (player.codeAttempts >= MAX_CODE_ATTEMPTS) {
      panel.remove();

      gameOverMazeGame();

      return;
    }

    MazeGameAudioManager.playSFX(SFX.WRONG_CODE);

    const attemptsLeft = MAX_CODE_ATTEMPTS - player.codeAttempts;

    setMazeNotification(
      `Code faux... ${attemptsLeft} tentative(s) restante(s).`,
    );

    if (input) {
      input.value = "";

      input.focus();

      updateCodeDisplay();
    }
  }

  if (input) {
    input.focus();

    input.addEventListener("input", () => {
      const oldValue = input.dataset.previousValue || "";

      input.value = input.value.replace(/\D/g, "").slice(0, 4);

      if (input.value.length > oldValue.length) {
        MazeGameAudioManager.playSFX(SFX.BIP_CODE);
      }

      input.dataset.previousValue = input.value;

      updateCodeDisplay();
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        submitRoofCode();
      }
    });
  }

  if (submit) {
    submit.onclick = () => {
      submitRoofCode();
    };
  }
}

/* GET MAZE PLAYER NAME ........................................................................................................*/
/* .............................................................................................................................*/
/* .............................................................................................................................*/

function getMazePlayerName() {
  const playerName = document.querySelector(".player-name");

  if (playerName && playerName.textContent.trim() !== "") {
    return playerName.textContent.trim();
  }

  return "Bill";
}

/* GET REMAINING ITEMS COUNT ..................................................................................................*/
/* .............................................................................................................................*/
/* .............................................................................................................................*/

/* GET REMAINING ITEMS COUNT ..................................................................................................*/
/* .............................................................................................................................*/
/* .............................................................................................................................*/

function getRemainingItemsCount() {
  return player.chicken + player.cheese + player.ladder;
}

/* GET MAZE FINAL TIME .........................................................................................................*/
/* .............................................................................................................................*/
/* .............................................................................................................................*/

/* GET MAZE FINAL TIME .........................................................................................................*/

function getMazeFinalTime() {
  return formatMazeTime(mazeElapsedSeconds);
}

/* PARSE MAZE TIME TO SECONDS .................................................................................................*/
/* .............................................................................................................................*/
/* .............................................................................................................................*/

function parseMazeTimeToSeconds(timeText) {
  const parts = timeText.split(":");

  const minutes = Number(parts[0]) || 0;

  const seconds = Number(parts[1]) || 0;

  return minutes * 60 + seconds;
}

/* FORMAT MAZE TIME ............................................................................................................*/
/* .............................................................................................................................*/
/* .............................................................................................................................*/

function formatMazeTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

/* CALCULATE MAZE TIME BONUS ..................................................................................................*/
/* .............................................................................................................................*/
/* .............................................................................................................................*/

/* CALCULATE MAZE TIME BONUS ..................................................................................................*/

function calculateMazeTimeBonus(totalSeconds) {
  if (totalSeconds <= 1500) {
    // 25 min
    return 8000;
  }

  if (totalSeconds <= 2400) {
    // 40 min
    return 5000;
  }

  if (totalSeconds <= 3600) {
    // 60 min
    return 2500;
  }

  return 1000;
}

/* CALCULATE MAZE FINAL SCORE .................................................................................................*/
/* .............................................................................................................................*/
/* .............................................................................................................................*/

function calculateMazeFinalScore() {
  const remainingItems = getRemainingItemsCount();

  const finalSoul = player.soul;

  const finalTime = getMazeFinalTime();

  const finalSeconds = parseMazeTimeToSeconds(finalTime);

  const itemsScore = remainingItems * 25;

  const soulScore = finalSoul * 20;

  const timeBonus = calculateMazeTimeBonus(finalSeconds);

  return itemsScore + soulScore + timeBonus;
}

/* REVEAL MAZE VICTORY ELEMENT .................................................................................................*/
/* .............................................................................................................................*/
/* .............................................................................................................................*/

function revealMazeVictoryElement(selector, delay) {
  addMazeTimeout(() => {
    const element = document.querySelector(selector);

    if (element) {
      element.classList.add("maze-victory-show");
    }
  }, delay);
}

/* ANIMATE MAZE NUMBER .........................................................................................................*/
/* .............................................................................................................................*/
/* .............................................................................................................................*/

function animateMazeNumber(element, finalValue, duration = 700) {
  if (!element) return;

  let startTime = null;

  function updateNumber(timestamp) {
    if (!startTime) {
      startTime = timestamp;
    }

    const progress = Math.min((timestamp - startTime) / duration, 1);

    const currentValue = Math.floor(finalValue * progress);

    element.textContent = currentValue;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      element.textContent = finalValue;
    }
  }

  requestAnimationFrame(updateNumber);
}

/* ANIMATE MAZE NUMBER DOWN ....................................................................................................*/

function animateMazeNumberDown(element, startValue, endValue, duration = 1200) {
  if (!element) return;

  let startTime = null;

  function updateNumber(timestamp) {
    if (!startTime) {
      startTime = timestamp;
    }

    const progress = Math.min((timestamp - startTime) / duration, 1);

    const currentValue = Math.floor(
      startValue - (startValue - endValue) * progress,
    );

    element.textContent = currentValue;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      element.textContent = endValue;
    }
  }

  requestAnimationFrame(updateNumber);
}

/* ANIMATE MAZE TIME ...........................................................................................................*/

function animateMazeTime(element, finalSeconds, duration = 1200) {
  if (!element) return;

  let startTime = null;

  function updateTime(timestamp) {
    if (!startTime) {
      startTime = timestamp;
    }

    const progress = Math.min((timestamp - startTime) / duration, 1);

    const currentSeconds = Math.floor(finalSeconds - finalSeconds * progress);

    element.textContent = formatMazeTime(currentSeconds);

    if (progress < 1) {
      requestAnimationFrame(updateTime);
    } else {
      element.textContent = "00:00";
    }
  }

  requestAnimationFrame(updateTime);
}

/* SHOW MAZE VICTORY POPUP ....................................................................................................*/
/* .............................................................................................................................*/
/* .............................................................................................................................*/

function showMazeVictoryPopup() {
  const gridMaze = document.querySelector(".cont-center");

  if (!gridMaze) return;

  MazeGameAudioManager.stopMusic();

  MazeGameAudioManager.playSFX(SFX.VICTORY);

  const oldPopup = document.querySelector(".maze-victory-popup");

  if (oldPopup) {
    oldPopup.remove();
  }

  const remainingItems = getRemainingItemsCount();

  const finalSoul = player.soul;

  const finalTime = getMazeFinalTime();

  const finalSeconds = parseMazeTimeToSeconds(finalTime);

  const itemsScore = remainingItems * 25;

  const soulScore = finalSoul * 20;

  const timeBonus = calculateMazeTimeBonus(finalSeconds);

  const finalScore = calculateMazeFinalScore();

  const oldMazeScore = Number(localStorage.getItem("maze_best_score")) || 0;

  const isNewMazeRecord = finalScore > oldMazeScore;

  if (isNewMazeRecord) {
    localStorage.setItem("maze_best_score", finalScore);
    localStorage.setItem("maze_best_player", getMazePlayerName());
  }

  const popup = document.createElement("div");

  popup.className = "maze-victory-popup";

  popup.innerHTML = `
    <div class="maze-victory-top">
      <div class="maze-victory-title">
        Gagné !
      </div>
    </div>

    <div class="maze-victory-middle">

      <div class="maze-victory-row">
        <span class="maze-victory-label maze-victory-piece" id="victory-items-label">
          Items restants :
        </span>

        <div class="maze-victory-formula">
          <span class="maze-victory-value maze-victory-piece" id="victory-items-count">
            ${remainingItems}
          </span>

          <span class="maze-victory-symbol maze-victory-piece" id="victory-items-x">
            x
          </span>

          <span class="maze-victory-value maze-victory-piece" id="victory-items-points">
            25
          </span>
        </div>

        <div class="maze-victory-result-group">
          <span class="maze-victory-value maze-victory-piece maze-victory-result-number" id="victory-items-result">
            0
          </span>

          <span class="maze-victory-value maze-victory-piece" id="victory-items-word">
            points
          </span>
        </div>
      </div>

      <div class="maze-victory-row">
        <span class="maze-victory-label maze-victory-piece" id="victory-soul-label">
          Soul :
        </span>

        <div class="maze-victory-formula">
          <span class="maze-victory-value maze-victory-piece" id="victory-soul-count">
            ${finalSoul}
          </span>

          <span class="maze-victory-symbol maze-victory-piece" id="victory-soul-x">
            x
          </span>

          <span class="maze-victory-value maze-victory-piece" id="victory-soul-points">
            20
          </span>
        </div>

        <div class="maze-victory-result-group">
          <span class="maze-victory-value maze-victory-piece maze-victory-result-number" id="victory-soul-result">
            0
          </span>

          <span class="maze-victory-value maze-victory-piece" id="victory-soul-word">
            points
          </span>
        </div>
      </div>

      <div class="maze-victory-row">
        <span class="maze-victory-label maze-victory-piece" id="victory-time-label">
          Temps :
        </span>

        <div class="maze-victory-formula">
          <span class="maze-victory-value maze-victory-piece" id="victory-time-value">
            ${finalTime}
          </span>
        </div>

        <div class="maze-victory-result-group">
          <span class="maze-victory-value maze-victory-piece maze-victory-result-number" id="victory-time-bonus">
            2000
          </span>

          <span class="maze-victory-value maze-victory-piece" id="victory-time-word">
            points
          </span>
        </div>
      </div>

    </div>

<div class="maze-victory-bottom">

  <div id="maze-exit-hint" class="maze-exit-hint">
    ← SORTIR DU JEU
  </div>

  <div class="maze-victory-score">

        <span class="maze-victory-score-label maze-score-slide" id="victory-score-label">
          SCORE :
        </span>

        <span
          id="maze-final-score"
          class="maze-victory-score-value maze-score-slide"
        >
          0
        </span>

        <span
          id="maze-new-record"
          class="maze-new-record maze-score-slide"
        >
          Nouveau Record !
        </span>

      </div>
    </div>
  `;

  gridMaze.appendChild(popup);

  addMazeTimeout(() => {
    const title = document.querySelector(".maze-victory-title");

    if (title) {
      title.classList.add("maze-title-stamp");
    }
  }, 500);

  const itemsSteps = [
    "#victory-items-label",
    "#victory-items-count",
    "#victory-items-x",
    "#victory-items-points",
  ];

  itemsSteps.forEach((selector, index) => {
    revealMazeVictoryElement(selector, 1000 + index * 250);
  });

  addMazeTimeout(() => {
    const itemResult = document.getElementById("victory-items-result");

    const itemWord = document.getElementById("victory-items-word");

    if (itemResult) {
      itemResult.classList.add("maze-victory-show");
    }

    if (itemWord) {
      itemWord.classList.add("maze-victory-show");
    }

    addMazeTimeout(() => {
      animateMazeNumber(itemResult, itemsScore, 1100);
    }, 500);
  }, 2600);

  const soulSteps = [
    "#victory-soul-label",
    "#victory-soul-count",
    "#victory-soul-x",
    "#victory-soul-points",
  ];

  soulSteps.forEach((selector, index) => {
    revealMazeVictoryElement(selector, 4600 + index * 250);
  });

  addMazeTimeout(() => {
    const soulResult = document.getElementById("victory-soul-result");

    const soulWord = document.getElementById("victory-soul-word");

    if (soulResult) {
      soulResult.classList.add("maze-victory-show");
    }

    if (soulWord) {
      soulWord.classList.add("maze-victory-show");
    }

    addMazeTimeout(() => {
      animateMazeNumber(soulResult, soulScore, 1200);
    }, 500);
  }, 6200);

  const timeSteps = ["#victory-time-label", "#victory-time-value"];

  timeSteps.forEach((selector, index) => {
    revealMazeVictoryElement(selector, 8200 + index * 250);
  });

  addMazeTimeout(() => {
    const timeValue = document.getElementById("victory-time-value");

    const bonusValue = document.getElementById("victory-time-bonus");

    const timeWord = document.getElementById("victory-time-word");

    if (bonusValue) {
      bonusValue.classList.add("maze-victory-show");
    }

    if (timeWord) {
      timeWord.classList.add("maze-victory-show");
    }

    addMazeTimeout(() => {
      animateMazeTime(timeValue, finalSeconds, 1200);

      animateMazeNumberDown(bonusValue, 2000, timeBonus, 1200);
    }, 500);
  }, 8800);

  revealMazeVictoryElement("#victory-score-label", 12600);

  addMazeTimeout(() => {
    const scoreEl = document.getElementById("maze-final-score");

    const recordEl = document.getElementById("maze-new-record");

    if (scoreEl) {
      scoreEl.classList.add("maze-victory-show");
    }

    addMazeTimeout(() => {
      animateMazeNumber(scoreEl, finalScore, 1500);

      if (recordEl && isNewMazeRecord) {
        addMazeTimeout(() => {
          recordEl.classList.add("maze-victory-show");
        }, 1800);
      }
    }, 500);
  }, 13400);
  addMazeTimeout(() => {
    const exitHint = document.getElementById("maze-exit-hint");

    if (exitHint) {
      exitHint.classList.add("show");
    }
  }, 16400);
}

/* SHOW SHOWMAZEGAMEOVERPOPUP ..................................................................................................*/
/* .............................................................................................................................*/
/* .............................................................................................................................*/

function showMazeGameOverPopup() {
  const gridMaze = document.querySelector(".cont-center");

  if (!gridMaze) return;

  const oldPopup = document.querySelector(".maze-gameover-popup");

  if (oldPopup) {
    oldPopup.remove();
  }

  const popup = document.createElement("div");

  popup.className = "maze-gameover-popup";

  popup.innerHTML = `
  <div
    id="maze-exit-hint"
    class="maze-exit-hint"
  >
    ← SORTIR DU JEU
  </div>
`;

  gridMaze.appendChild(popup);

  addMazeTimeout(() => {
    const title = popup.querySelector(".maze-victory-title");

    if (title) {
      title.classList.add("maze-title-stamp");
    }
  }, 300);

  addMazeTimeout(() => {
    const exitHint = document.getElementById("maze-exit-hint");

    if (exitHint) {
      exitHint.classList.add("show");
    }
  }, 1000);
}

/* WIN MAZE GAME ...............................................................................................................*/
/* .............................................................................................................................*/
/* .............................................................................................................................*/

function winMazeGame() {
  const mazePlayer = document.getElementById("maze-player");

  if (mazePlayer) {
    mazePlayer.classList.remove("show");
  }

  showLoader();

  setMazeNotification(
    "Le digicode s'ouvre... Vous accédez enfin au toit du Soul Motel !",
  );

  removeControls();

  const moveBtn = document.getElementById("maze-move-btn");

  if (moveBtn) {
    moveBtn.disabled = true;

    moveBtn.textContent = "GAGNÉ";
  }

  stopMazeTimer();
  showMazeVictoryPopup();
}

/* GAME OVER MAZE GAME .........................................................................................................*/
/* .............................................................................................................................*/
/* .............................................................................................................................*/

function gameOverMazeGame() {
  removeControls();

  stopMazeTimer();

  MazeGameAudioManager.playSFX(SFX.GAME_OVER);

  setMazeNotification(
    "Troisième erreur... Une fumée épaisse envahit le couloir. GAME OVER.",
  );

  const moveBtn = document.getElementById("maze-move-btn");

  if (moveBtn) {
    moveBtn.style.display = "none";
  }

  addMazeTimeout(() => {
    showMazeGameOverPopup();
  }, 1000);
}

/* UPDATE MOVE CONTROLS .........................................................................................................*/

function updateMoveControls() {
  const moveBtn = document.getElementById("maze-move-btn");
  if (!moveBtn) return;

  const currentFloor = FLOORS[player.floor - 1];
  if (!currentFloor) return;

  const currentTile = currentFloor.tiles[player.position];
  if (!currentTile) return;

  moveBtn.innerHTML = "";
  moveBtn.onclick = null;

  if (player.floor >= 2 && player.position === 0) {
    const downChoice = document.createElement("span");
    const advanceChoice = document.createElement("span");

    downChoice.className = "maze-choice-btn";
    advanceChoice.className = "maze-choice-btn";

    downChoice.textContent = "DESCENDRE";
    advanceChoice.textContent = "AVANCER";

    downChoice.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      previousFloor();
    };

    advanceChoice.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      movePlayer();
    };

    moveBtn.appendChild(downChoice);
    moveBtn.appendChild(advanceChoice);

    return;
  }

  if (currentTile.type === TILE_TYPES.ROOM) {
    const backChoice = document.createElement("span");
    const enterChoice = document.createElement("span");
    const advanceChoice = document.createElement("span");

    backChoice.className = "maze-choice-btn";
    enterChoice.className = "maze-choice-btn";
    advanceChoice.className = "maze-choice-btn";

    backChoice.textContent = "RECULER";
    enterChoice.textContent = "ENTRER";
    advanceChoice.textContent = "AVANCER";

    backChoice.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      movePlayerBack();
    };

    enterChoice.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      enterRoom();
    };

    advanceChoice.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      movePlayer();
    };

    if (player.position >= 1) {
      moveBtn.appendChild(backChoice);
    }

    moveBtn.appendChild(enterChoice);
    moveBtn.appendChild(advanceChoice);

    return;
  }

  if (currentTile.type === TILE_TYPES.STAIRS) {
    const backChoice = document.createElement("span");
    const useKeyChoice = document.createElement("span");

    backChoice.className = "maze-choice-btn";
    useKeyChoice.className = "maze-choice-btn";

    backChoice.textContent = "RECULER";
    const nextFloorUnlocked = player.unlockedFloors.includes(player.floor + 1);

    useKeyChoice.textContent = nextFloorUnlocked ? "MONTER" : "UTILISER LA CLÉ";

    backChoice.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      movePlayerBack();
    };

    useKeyChoice.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      nextFloor();
    };

    moveBtn.appendChild(backChoice);
    moveBtn.appendChild(useKeyChoice);

    return;
  }

  if (currentTile.type === TILE_TYPES.EXIT) {
    const backChoice = document.createElement("span");
    const useKeyChoice = document.createElement("span");

    backChoice.className = "maze-choice-btn";
    useKeyChoice.className = "maze-choice-btn";

    backChoice.textContent = "RECULER";
    useKeyChoice.textContent = "UTILISER LA CLÉ DU TOIT";

    backChoice.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      movePlayerBack();
    };

    useKeyChoice.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (player.keys < 5) {
        setMazeNotification("Vous n'avez pas encore la clé d'accès au toit...");
        return;
      }

      showRoofCodePanel();
    };

    moveBtn.appendChild(backChoice);
    moveBtn.appendChild(useKeyChoice);

    return;
  }

  if (player.position >= 1) {
    const backChoice = document.createElement("span");
    const advanceChoice = document.createElement("span");

    backChoice.className = "maze-choice-btn";
    advanceChoice.className = "maze-choice-btn";

    backChoice.textContent = "RECULER";
    advanceChoice.textContent = "AVANCER";

    backChoice.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      movePlayerBack();
    };

    advanceChoice.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      movePlayer();
    };

    moveBtn.appendChild(backChoice);
    moveBtn.appendChild(advanceChoice);

    return;
  }

  moveBtn.textContent = "AVANCER";
  moveBtn.onclick = () => {
    movePlayer();
  };
}

function showCorridorElements(notification) {
  const notif = document.querySelector(".cont-notif");
  const moveBtn = document.getElementById("maze-move-btn");
  const mazePlayer = document.getElementById("maze-player");

  addMazeTimeout(() => {
    if (notification) {
      setMazeNotification(notification);
    }

    if (notif) {
      notif.classList.remove("maze-notif-fade-out");
      notif.classList.add("maze-notif-fade-in");
    }
  }, 0);

  addMazeTimeout(() => {
    updateMoveControls();

    if (moveBtn) {
      moveBtn.classList.add("maze-show");
    }
  }, 300);

  addMazeTimeout(() => {
    if (mazePlayer) {
      mazePlayer.classList.add("show");
    }

    isMoving = false;
  }, 800);
}

function corridorTransition(changeCorridor) {
  const track = document.getElementById("maze-track");
  const moveBtn = document.getElementById("maze-move-btn");
  const mazePlayer = document.getElementById("maze-player");
  const notif = document.querySelector(".cont-notif");

  if (!track || isMoving) return;

  isMoving = true;

  /* DISPARITION */

  if (moveBtn) {
    moveBtn.classList.remove("maze-show");
  }

  if (mazePlayer) {
    mazePlayer.classList.remove("show");
  }

  if (notif) {
    notif.classList.remove("maze-notif-fade-in");
    notif.classList.add("maze-notif-fade-out");
  }

  setMazeNotification("");

  track.classList.remove("maze-corridor-fade-in");
  track.classList.add("maze-corridor-fade-out");

  /* FIN DU FADE OUT */

  addMazeTimeout(() => {
    const notification = changeCorridor();

    track.classList.remove("maze-corridor-fade-out");
    track.classList.add("maze-corridor-fade-in");

    showCorridorElements(notification);
  }, 2000);
}

/* MOVE PLAYER BACK ............................................................................................................*/

function movePlayerBack() {
  if (isMoving) return;

  if (player.position <= 0) return;

  /* AUDIO ....................................................................................................................*/
  /* ..........................................................................................................................*/
  /* ..........................................................................................................................*/

  MazeGameAudioManager.playSFX(SFX.FOOTSTEPS_CORRIDOR);

  const oldCodePopup = document.querySelector(".maze-code-popup");

  if (oldCodePopup) {
    oldCodePopup.remove();
  }

  corridorTransition(() => {
    player.position--;

    const currentFloor = FLOORS[player.floor - 1];

    const currentTile = currentFloor?.tiles[player.position];

    renderCorridor();

    updateTrackPosition();

    updateHUD();

    if (currentTile?.type === TILE_TYPES.EMPTY) {
      return getEmptyTileNotification();
    }

    if (currentTile?.type === TILE_TYPES.ROOM) {
      return (
        currentTile.roomData?.notifText || "Vous revenez devant une chambre..."
      );
    }

    if (currentTile?.type === TILE_TYPES.STAIRS) {
      return "Vous trouvez les escaliers...";
    }

    if (currentTile?.type === TILE_TYPES.EXIT) {
      return "Vous trouvez la sortie du motel...";
    }

    return "";
  });
}

/* PLAYER MOVE ..................................................................................................................*/

function movePlayer() {
  if (isMoving) return;

  const currentFloor = FLOORS[player.floor - 1];

  if (!currentFloor) return;

  if (player.position >= currentFloor.tiles.length - 1) return;

  /* AUDIO ....................................................................................................................*/
  /* ..........................................................................................................................*/
  /* ..........................................................................................................................*/

  MazeGameAudioManager.playSFX(SFX.FOOTSTEPS_CORRIDOR);

  startMazeTimer();

  corridorTransition(() => {
    player.position++;

    const currentTile = currentFloor.tiles[player.position];

    renderCorridor();

    updateTrackPosition();

    updateHUD();

    if (currentTile.type === TILE_TYPES.EMPTY) {
      return getEmptyTileNotification();
    }

    if (currentTile.type === TILE_TYPES.ROOM) {
      return (
        currentTile.roomData?.notifText || "Vous êtes devant une chambre..."
      );
    }

    if (currentTile.type === TILE_TYPES.STAIRS) {
      return "Vous trouvez les escaliers...";
    }

    if (currentTile.type === TILE_TYPES.EXIT) {
      return "Vous trouvez la sortie du motel...";
    }

    return "";
  });
}

/* CONTROLS .....................................................................................................................*/
/* ..............................................................................................................................*/
/* ..............................................................................................................................*/

function handleKeyDown(e) {
  if (e.key === "ArrowRight") {
    movePlayer();
  }
}

/* REMOVE CONTROLS ..............................................................................................................*/

function removeControls() {
  window.removeEventListener("keydown", handleKeyDown);
}

/* SETUP CONTROLS ...............................................................................................................*/

function setupControls() {
  removeControls();
  window.addEventListener("keydown", handleKeyDown);
}

/* RESET MAZE GAME ..............................................................................................................*/
/* ..............................................................................................................................*/
/* ..............................................................................................................................*/

export function resetMazeGame() {
  MazeGameAudioManager.reset();
  removeControls();
  stopMazeTimer();
mazePaused = false;
clearMazeTimeouts();

  mazeElapsedSeconds = 0;
  mazeTimerStarted = false;

  const maze = document.getElementById("seq3-maze");

  if (maze) {
    maze.classList.remove("game-started");
  }

  player = {
    soul: 0,
    secrets: 0,
    keys: 0,
    codeAttempts: 0,
    floor: 1,
    unlockedFloors: [1],
    cheese: 0,
    chicken: 0,
    ladder: 0,
    position: 0,
    score: 0,
    soulShield: false,
    soulShieldUsed: false,
  };

  FLOORS = [];

  shuffledLandscapePool = [];
  shuffledPortraitPool = [];

  const track = document.getElementById("maze-track");

  if (track) {
    track.innerHTML = "";
    track.style.transform = "translateX(0)";
    track.style.opacity = "";
    track.style.transition = "";
  }

  const map = document.getElementById("maze-map");

  if (map) {
    map.innerHTML = "";
  }

  setMazeNotification("Bienvenue dans le Soul Motel");

  const contLeft = document.querySelector(".cont-left");
  const contRight = document.querySelector(".cont-right");
  const contNotif = document.querySelector(".cont-notif");
  const gridMaze = document.querySelector(".grid-maze");
  const moveBtn = document.getElementById("maze-move-btn");
  const mazePlayer = document.getElementById("maze-player");

  if (contLeft) {
    contLeft.classList.remove("maze-show");
    contLeft.style.opacity = "";
    contLeft.style.transition = "";
    contLeft.style.transform = "";
  }

  if (contRight) {
    contRight.classList.remove("maze-show");
    contRight.style.opacity = "";
    contRight.style.transition = "";
    contRight.style.transform = "";
  }

  if (contNotif) {
    contNotif.classList.remove("maze-show");
    contNotif.classList.remove("maze-notif-fade-in");
    contNotif.classList.remove("maze-notif-fade-out");
    contNotif.style.opacity = "";
    contNotif.style.transition = "";
    contNotif.style.transform = "";
  }

  if (gridMaze) {
    gridMaze.classList.remove("maze-show");
    gridMaze.style.opacity = "";
    gridMaze.style.transition = "";
  }

  if (moveBtn) {
    moveBtn.classList.remove("maze-show");
    moveBtn.disabled = false;
    moveBtn.textContent = "AVANCER";
    moveBtn.onclick = null;
    moveBtn.style.opacity = "";
    moveBtn.style.transition = "";
    moveBtn.style.transform = "";
  }

  if (mazePlayer) {
    mazePlayer.classList.remove("show");
  }

  document.querySelectorAll(".maze-room-view").forEach((el) => el.remove());
  document.querySelectorAll(".maze-lore-popup").forEach((el) => el.remove());
  document.querySelectorAll(".maze-fake-popup").forEach((el) => el.remove());
  document.querySelectorAll(".maze-victory-popup").forEach((el) => el.remove());
  document.querySelectorAll(".maze-code-popup").forEach((el) => el.remove());
}

/* INIT MAZE GAME ...............................................................................................................*/
/* ..............................................................................................................................*/
/* ..............................................................................................................................*/

export function initMazeGame() {
  resetMazeGame();

  /* AUDIO ....................................................................................................................*/
  /* ..........................................................................................................................*/
  /* ..........................................................................................................................*/

  MazeGameAudioManager.reset();

  MazeGameAudioManager.playSFX(SFX.SOUL_MOTEL_BEGIN);

  MazeGameAudioManager.playFloorMusic(1);

  const maze = document.getElementById("seq3-maze");

  if (maze) {
    maze.classList.add("game-started");
  }

  generateFloors();

  ensureMazeTrack();
  ensureMoveButton();

  updateHUD();

  renderMap();
  renderCorridor();
  updateTrackPosition();
  setupControls();
  updateMoveControls();

  const moveBtn = document.getElementById("maze-move-btn");

  const contLeft = document.querySelector(".cont-left");
  const contRight = document.querySelector(".cont-right");
  const contNotif = document.querySelector(".cont-notif");
  const gridMaze = document.querySelector(".grid-maze");

  if (moveBtn) {
    moveBtn.classList.remove("maze-show");
  }

  setMazeNotification(`
    Bienvenue au
    <span style="
      color: orangered;
      font-weight: bold;
      margin-left: 6px;
      margin-right: 6px;
      display: inline-block;
      font-size: 0.9em;
    ">
      SOUL MOTEL
    </span>
    !
  `);

  addMazeTimeout(() => {
    if (contLeft) {
      contLeft.classList.add("maze-show");
    }

    addMazeTimeout(() => {
      if (contRight) {
        contRight.classList.add("maze-show");
      }

      addMazeTimeout(() => {
        if (contNotif) {
          contNotif.classList.add("maze-show");
        }

        addMazeTimeout(() => {
          if (gridMaze) {
            gridMaze.classList.add("maze-show");
          }

          addMazeTimeout(() => {
            setMazeNotification(`
              Tentez de vous en échapper en récoltant les

              <span style="
                font-weight: bold;
                margin-left: 6px;
                margin-right: 6px;
                display: inline-block;
                font-size: 0.9em;
              ">
                CLÉS
              </span>

              en évitant les

              <span style="
                font-weight: bold;
                margin-left: 6px;
                margin-right: 6px;
                display: inline-block;
                font-size: 0.9em;
              ">
                PIÈGES
              </span>

              et en obtenant les

              <span style="
                font-weight: bold;
                margin-left: 6px;
                margin-right: 6px;
                display: inline-block;
                font-size: 0.9em;
              ">
                CHIFFRES
              </span>

              !
            `);

            addMazeTimeout(() => {
              setMazeNotification(getEmptyTileNotification());

              const mazePlayer = document.getElementById("maze-player");

              if (mazePlayer) {
                mazePlayer.classList.add("show");
              }

              addMazeTimeout(() => {
                if (moveBtn) {
                  moveBtn.classList.add("maze-show");
                }
              }, 1000);
            }, 5000);
          }, 5000);
        }, 500);
      }, 500);
    }, 200);
  }, 100);
}
