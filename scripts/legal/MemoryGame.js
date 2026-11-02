import {
  fadeOutMemoryMusic,
  playMemoryTurnCardsSfx,
  playMemoryPairFoundSfx,
  playMemoryPairWrongSfx,
  playMemoryWinGameSfx,
  playMemoryGameOverSfx,
} from "./MemoryGameAudioManager.js";

let gameCtx = null;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let errors = 0;

let timer = 0;
let timerInterval = null;

let memoryActive = false;
let memoryPaused = false;

const memoryTimeouts = new Set();

function startMemoryTimeout(task) {
  task.startedAt = performance.now();

  task.id = setTimeout(() => {
    task.id = null;
    memoryTimeouts.delete(task);
    task.callback();
  }, task.remaining);
}

function addMemoryTimeout(callback, delay) {
  const task = {
    callback,
    remaining: delay,
    startedAt: 0,
    id: null,
  };

  memoryTimeouts.add(task);
  startMemoryTimeout(task);

  return task;
}

function clearMemoryTimeouts() {
  memoryTimeouts.forEach((task) => {
    if (task.id !== null) {
      clearTimeout(task.id);
    }
  });

  memoryTimeouts.clear();
}

export function pauseMemoryGame() {
  if (memoryPaused) return;

  memoryPaused = true;

  const pauseTime = performance.now();

  memoryTimeouts.forEach((task) => {
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

export function resumeMemoryGame() {
  if (!memoryPaused) return;

  memoryPaused = false;

  memoryTimeouts.forEach((task) => {
    if (task.id === null) {
      startMemoryTimeout(task);
    }
  });
}

export function initMemoryGame(ctx) {
  gameCtx = ctx;
  resetMemoryGame();
  memoryActive = true;

  const grid = document.getElementById("memory-grid");

  if (!grid) return;

  grid.innerHTML = "";

  matchedPairs = 0;
  errors = 0;
  timer = 0;

  updateStats();

  startTimer();

  const values = [];

  for (let i = 1; i <= 9; i++) {
    values.push(i);
    values.push(i);
  }

  values.sort(() => Math.random() - 0.5);

  cards = values;

  cards.forEach((value) => {
    const card = document.createElement("div");

    card.className = "memory-card";

    card.dataset.value = value;

    card.innerHTML = `
  <div class="memory-card-inner">

    <div class="memory-card-front">
    </div>

    <div class="memory-card-back">

      <img
        src="/images/legal/banner-bottom-nyc-games/coney/memory-game/card-${value}.png"
        class="memory-card-img"
        alt="card-${value}"
      />

    </div>

  </div>
`;

    card.addEventListener("click", () => flipCard(card));

    grid.appendChild(card);
  });
}

function flipCard(card) {
  if (!memoryActive || memoryPaused) return;
  if (flippedCards.length >= 2) return;

  if (card.classList.contains("flipped")) return;

  if (card.classList.contains("matched")) return;

  playMemoryTurnCardsSfx();

  card.classList.add("flipped");

  flippedCards.push(card);

  if (flippedCards.length === 2) {
    const [card1, card2] = flippedCards;

    const val1 = card1.dataset.value;
    const val2 = card2.dataset.value;

    if (val1 === val2) {
      addMemoryTimeout(() => {
        if (memoryActive) {
          playMemoryPairFoundSfx();
        }
      }, 300);

      card1.classList.add("matched");
      card2.classList.add("matched");

      matchedPairs++;

      updateStats();

      flippedCards = [];

      if (matchedPairs >= 9) {
        addMemoryTimeout(() => {
          endGame(true);
        }, 1000);
      }
    } else {
      addMemoryTimeout(() => {
        if (memoryActive) {
          playMemoryPairWrongSfx();
        }
      }, 300);

      errors++;

      updateStats();

      if (errors >= 9) {
        endGame(false);
      }

      addMemoryTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");

        flippedCards = [];
      }, 700);
    }
  }
}

function updateStats() {
  const pairsEl = document.getElementById("memory-pairs");

  const errorsEl = document.getElementById("memory-errors");

  if (pairsEl) {
    pairsEl.textContent = `${matchedPairs} / 9`;
  }

  if (errorsEl) {
    errorsEl.textContent = `${errors} / 9`;

    if (errors === 3) {
      errorsEl.style.color = "#00ff90";
    }

    if (errors === 5) {
      errorsEl.style.color = "orange";
    }

    if (errors >= 8) {
      errorsEl.style.color = "red";
    }
  }
}

function startTimer() {
  clearInterval(timerInterval);

timerInterval = setInterval(() => {
  if (memoryPaused) return;

  timer++;

    const min = String(Math.floor(timer / 60)).padStart(2, "0");

    const sec = String(timer % 60).padStart(2, "0");

    const timerEl = document.getElementById("memory-time");

    if (timerEl) {
      timerEl.textContent = `${min}:${sec}`;
    }
  }, 1000);
}

function endGame(victory) {
  memoryActive = false;

  clearInterval(timerInterval);

  fadeOutMemoryMusic();

  if (victory) {
    playMemoryWinGameSfx();
  } else {
    playMemoryGameOverSfx();
  }

  const gameOver = document.getElementById("memory-end-message");

  if (!gameOver) return;

  gameOver.classList.add("show");

  const grid = document.getElementById("memory-grid");

  if (grid) {
    grid.style.opacity = "0.12";
  }

  const titleEl = document.getElementById("memory-end-title");

  const finalTime = document.getElementById("memory-final-time");

  const finalPairs = document.getElementById("memory-final-pairs");

  const finalErrors = document.getElementById("memory-final-errors");

  const finalRecord = document.getElementById("memory-record");

  const currentTime =
    document.getElementById("memory-time")?.textContent || "00:00";

  let isNewRecord = false;

  if (victory) {
    if (titleEl) {
      titleEl.textContent = "GAGNÉ";
      titleEl.style.color = "white";
      titleEl.style.fontSize = "22px";
    }

    function timeToSeconds(t) {
      const parts = t.split(":");

      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }

    const oldRecord = localStorage.getItem("memory_best_time");

    if (!oldRecord || timeToSeconds(currentTime) < timeToSeconds(oldRecord)) {
      localStorage.setItem("memory_best_time", currentTime);

      const currentPlayer =
        window.SMQ_RETRAITES?.[gameCtx?.getCurrentIndex?.() || 0]?.nom ||
        "PLAYER";

      localStorage.setItem("memory_best_player", currentPlayer);

      isNewRecord = true;
    }

    if (finalRecord) {
      finalRecord.classList.remove("show");

      finalRecord.style.opacity = "0";
      finalRecord.style.transform = "translateX(40px)";

      finalRecord.textContent = isNewRecord ? "Nouveau Record !" : "";
    }
  } else {
    if (titleEl) {
      titleEl.textContent = "GAME OVER";
      titleEl.style.color = "orangered";
      titleEl.style.fontSize = "22px";
    }

    if (finalRecord) {
      finalRecord.classList.remove("show");

      finalRecord.textContent = "";
    }
  }

  if (finalTime) {
    finalTime.textContent = currentTime;
  }

  if (finalPairs) {
    finalPairs.textContent = `${matchedPairs} / 9`;
  }

  if (finalErrors) {
    finalErrors.textContent = `${errors} / 9`;
  }

  const notifications = document.querySelector(".coney-memory-notifications");

  const currentPlayer =
    window.SMQ_RETRAITES?.[gameCtx?.getCurrentIndex?.() || 0]?.nom || "PLAYER";

  if (notifications) {
    if (victory) {
      notifications.innerHTML = `
      <span class="memory-notif-result memory-notif-victory">
        GAGNÉ !
      </span>


      <span class="memory-notif-label">
        Retraité :
      </span>

      <span class="memory-notif-player">
        ${currentPlayer}
      </span>

      <span class="memory-notif-slash">/</span>

      <span class="memory-notif-label">
        Temps :
      </span>

      <span class="memory-notif-final-time">
        ${currentTime}
      </span>

      ${
        isNewRecord
          ? '<span class="memory-notif-record">Nouveau Record !</span>'
          : ""
      }
    `;
    } else {
      notifications.innerHTML = `
      <span class="memory-notif-result memory-notif-defeat">
        PERDU !
      </span>

      <span class="memory-notif-message">
        Vous n'avez pas réussi à retrouver toutes les paires.
      </span>
    `;
    }
  }

  const labels = document.querySelectorAll(".memory-win-label");

  const values = document.querySelectorAll(".memory-win-value");

  labels.forEach((label) => {
    label.classList.remove("show");
  });

  values.forEach((value) => {
    value.classList.remove("show");
  });

  if (titleEl) {
    titleEl.classList.remove("show");
  }

  addMemoryTimeout(() => {
    if (titleEl) {
      titleEl.classList.add("show");
    }
  }, 300);

  addMemoryTimeout(() => {
    labels.forEach((label) => {
      label.classList.add("show");
    });
  }, 900);

  addMemoryTimeout(() => {
    values.forEach((value) => {
      value.classList.add("show");
    });
  }, 1300);

  addMemoryTimeout(() => {
    if (finalRecord && finalRecord.textContent !== "") {
      finalRecord.classList.add("show");
    }
  }, 1700);
}

export function resetMemoryGame() {
  memoryActive = false;
  memoryPaused = false;
  clearMemoryTimeouts();

  clearInterval(timerInterval);

  matchedPairs = 0;
  errors = 0;
  timer = 0;

  flippedCards = [];

  const grid = document.getElementById("memory-grid");

  if (grid) {
    grid.innerHTML = "";
    grid.style.opacity = "1";
  }

  const endMsg = document.getElementById("memory-end-message");

  if (endMsg) {
    endMsg.classList.remove("show");
  }

  const title = document.getElementById("memory-end-title");

  if (title) {
    title.textContent = "GAME OVER";
    title.style.color = "orangered";
    title.style.fontSize = "22px";

    title.classList.remove("show");
  }

  const labels = document.querySelectorAll(".memory-win-label");

  const values = document.querySelectorAll(".memory-win-value");

  labels.forEach((label) => {
    label.classList.remove("show");
  });

  values.forEach((value) => {
    value.classList.remove("show");
  });

  const record = document.getElementById("memory-record");

  if (record) {
    record.textContent = "";
    record.classList.remove("show");
  }

  const timeEl = document.getElementById("memory-time");

  const pairEl = document.getElementById("memory-pairs");

  const errorEl = document.getElementById("memory-errors");

  if (timeEl) {
    timeEl.textContent = "00:00";
  }

  if (pairEl) {
    pairEl.textContent = "0 / 9";
  }

  if (errorEl) {
    errorEl.textContent = "0 / 9";
    errorEl.style.color = "#00ff90";
  }
}
