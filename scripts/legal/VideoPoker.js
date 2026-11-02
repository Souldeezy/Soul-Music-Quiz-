/* DECK........................................................................................................................... */

const SUITS = ["♠", "♥", "♦", "♣"];

const VALUES = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

let deck = [];
let ctx = null;
let videoPokerPaused = false;

export function pauseVideoPoker() {
  videoPokerPaused = true;
}

export function resumeVideoPoker() {
  videoPokerPaused = false;
}

/* CREATE DECK.................................................................................................................... */

function createDeck() {
  deck = [];

  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({
        value,
        suit,
      });
    }
  }
}

/* SHUFFLE DECK................................................................................................................... */

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

/* DEAL CARDS..................................................................................................................... */

let currentHand = [];
let selectedCards = [];
let hasReplaced = false;

function dealCards() {
  currentHand = deck.splice(0, 5);

  selectedCards = [false, false, false, false, false];
  hasReplaced = false;

  const replaceBtn = document.querySelectorAll(".vp-action-btn")[0];

  if (replaceBtn) {
    replaceBtn.disabled = false;
    replaceBtn.style.opacity = "1";
    replaceBtn.style.pointerEvents = "all";
  }

  console.log(currentHand);
}

/* DISPLAY HAND.................................................................................................................. */

/* DISPLAY HAND.................................................................................................................. */

function displayHand() {
  const cardElements = document.querySelectorAll(".vp-card");

  const suitMap = {
    "♠": "spades",
    "♥": "hearts",
    "♦": "diamonds",
    "♣": "clubs",
  };

  const valueMap = {
    A: "ace",
    K: "king",
    Q: "queen",
    J: "jack",
  };

  currentHand.forEach((card, index) => {
    if (!cardElements[index]) return;

    const value = valueMap[card.value] || card.value;
    const suit = suitMap[card.suit];

cardElements[index].innerHTML =
  `<img src="/images/legal/banner-bottom-nyc-games/casino/video-poker/${value}-of-${suit}.png" alt="${card.value}${card.suit}">`;

    cardElements[index].style.borderColor = "dodgerblue";
    cardElements[index].style.color = "white";
    cardElements[index].style.transform = "translateY(0)";

    cardElements[index].onclick = () => toggleCard(index);
  });

  const replaceBtn = document.querySelectorAll(".vp-action-btn")[0];

  if (replaceBtn) {
    replaceBtn.onclick = replaceSelectedCards;
  }
}

/* SELECT CARD.................................................................................................................... */

function toggleCard(index) {
  if (videoPokerPaused) return;
  if (hasReplaced) return;

  selectedCards[index] = !selectedCards[index];

  const card = document.querySelectorAll(".vp-card")[index];

  if (!card) return;

  if (selectedCards[index]) {
    card.style.borderColor = "rgb(0,249,166)";
    card.style.color = "rgb(0,249,166)";
    card.style.transform = "translateY(-10px)";
  } else {
    card.style.borderColor = "dodgerblue";
    card.style.color = "white";
    card.style.transform = "translateY(0)";
  }
}

function replaceSelectedCards() {
  if (videoPokerPaused) return;
  if (hasReplaced) return;

  hasReplaced = true;

  ctx?.playVpReplaceSfx?.();

  if (ctx?.playVpDealCardsSfx) {
    ctx.playVpDealCardsSfx();
  }

  currentHand.forEach((card, index) => {
    if (selectedCards[index]) {
      currentHand[index] = deck.shift();
      selectedCards[index] = false;
    }
  });

  displayHand();

  checkHand();

  const replaceBtn = document.querySelectorAll(".vp-action-btn")[0];

  if (replaceBtn) {
    replaceBtn.disabled = true;
    replaceBtn.style.opacity = "0.4";
    replaceBtn.style.pointerEvents = "none";
  }
}

/* CHECK HAND..................................................................................................................... */

/* CHECK HAND................................................................................................................... */

/* CHECK HAND................................................................................................................... */

function checkHand() {
  let result = "Perdu";

  if (isRoyalFlush()) {
    result = "Quinte Flush Royale";
  } else if (isStraightFlush()) {
    result = "Quinte Flush";
  } else if (isFourOfAKind()) {
    result = "Carré";
  } else if (isFullHouse()) {
    result = "Full";
  } else if (isFlush()) {
    result = "Couleur";
  } else if (isStraight()) {
    result = "Suite";
  } else if (isThreeOfAKind()) {
    result = "Brelan";
  } else if (isTwoPair()) {
    result = "Double Paire";
  } else if (isJacksOrBetter()) {
    result = "Paire";
  }

  const gain = getWinAmount(result);

if (gain > 0 && ctx) {
  ctx.creditPlayerMoney?.(gain);
  ctx.playVpWinSfx?.();

  ctx.registerCasinoRecord?.(
    "videoPoker",
    gain,
  );
}

const notif = document.querySelector(
  ".casino-vp-notifications",
);

if (notif) {
  if (gain > 0) {
    notif.innerHTML = `
      <span class="vp-notif-combo">
        ${result.toUpperCase()} !
      </span>

      <span>Vous gagnez</span>

      <span class="vp-notif-gain">
        ${gain} $
      </span>
    `;
  } else {
    ctx?.playVpLoseSfx?.();

    notif.innerHTML = `
      <span class="vp-notif-lose">
        PERDU !
      </span>

      Aucune combinaison gagnante.
    `;
  }
}

  const newGameBtn = document.querySelectorAll(".vp-action-btn")[1];

  if (newGameBtn) {
    newGameBtn.style.animation = "vpNewGameBlink 2s infinite";
  }
}

function getWinAmount(result) {
  switch (result) {
    case "Quinte Flush Royale":
      return 1000;

    case "Quinte Flush":
      return 500;

    case "Carré":
      return 250;

    case "Full":
      return 100;

    case "Couleur":
      return 75;

    case "Suite":
      return 50;

    case "Brelan":
      return 30;

    case "Double Paire":
      return 20;

    case "Paire":
      return 10;

    default:
      return 0;
  }
}

function countValues() {
  const counts = {};

  currentHand.forEach((card) => {
    counts[card.value] = (counts[card.value] || 0) + 1;
  });

  return counts;
}

/* COUNT SUITS................................................................................................................... */

function countSuits() {
  const counts = {};

  currentHand.forEach((card) => {
    counts[card.suit] = (counts[card.suit] || 0) + 1;
  });

  return counts;
}

/* FLUSH......................................................................................................................... */

function isFlush() {
  return Object.values(countSuits()).includes(5);
}

/* STRAIGHT...................................................................................................................... */

function isStraight() {
  const order = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];

  const values = currentHand
    .map((card) => order.indexOf(card.value))
    .sort((a, b) => a - b);

  for (let i = 1; i < values.length; i++) {
    if (values[i] !== values[i - 1] + 1) {
      return false;
    }
  }

  return true;
}

/* FOUR OF A KIND............................................................................................................... */

function isFourOfAKind() {
  return Object.values(countValues()).includes(4);
}

/* THREE OF A KIND.............................................................................................................. */

function isThreeOfAKind() {
  return Object.values(countValues()).includes(3);
}

/* FULL HOUSE................................................................................................................... */

function isFullHouse() {
  const values = Object.values(countValues());

  return values.includes(3) && values.includes(2);
}

/* TWO PAIR..................................................................................................................... */

function isTwoPair() {
  const pairs = Object.values(countValues()).filter((v) => v === 2);

  return pairs.length === 2;
}

/* JACKS OR BETTER.............................................................................................................. */

function isJacksOrBetter() {
  const counts = countValues();

  const highCards = ["J", "Q", "K", "A"];

  return highCards.some((card) => counts[card] === 2);
}

/* STRAIGHT FLUSH............................................................................................................... */

function isStraightFlush() {
  return isStraight() && isFlush();
}

/* ROYAL FLUSH.................................................................................................................. */

function isRoyalFlush() {
  if (!isStraightFlush()) return false;

  const values = currentHand.map((card) => card.value);

  return (
    values.includes("10") &&
    values.includes("J") &&
    values.includes("Q") &&
    values.includes("K") &&
    values.includes("A")
  );
}

/* INIT........................................................................................................................... */

export function initVideoPoker(context) {
  ctx = context;

  createDeck();
  shuffleDeck();
  dealCards();
  displayHand();
}

export function resetVideoPoker() {
  videoPokerPaused = false;
  deck = [];
  currentHand = [];
  selectedCards = [];
  hasReplaced = false;

  document.querySelectorAll(".vp-card").forEach((card) => {
    card.textContent = "";
    card.style.borderColor = "dodgerblue";
    card.style.color = "white";
    card.style.transform = "translateY(0)";
  });

  const deckEl = document.querySelector(".vp-deck");
  const cardsEl = document.querySelector(".vp-cards");

  if (deckEl) {
    deckEl.style.opacity = "0";
    deckEl.style.animation = "";
  }

  if (cardsEl) {
    cardsEl.style.opacity = "0";
    cardsEl.style.animation = "";
  }

  const notif = document.querySelector(".casino-vp-notifications");

  if (notif) {
    notif.innerHTML =
      'Bienvenue au&nbsp;<span class="vp-notif-smq">SMQ Video Poker</span> !&nbsp;&nbsp;Commencer une nouvelle partie ?&nbsp;&nbsp;<span class="vp-notif-price">5 $</span>';
  }
}
