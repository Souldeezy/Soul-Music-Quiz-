import {
  fadeOutTetrisMusic,
  playTetrisMoveRotateSfx,
  playTetrisDropSfx,
  playTetrisPieceLockSfx,
  playTetrisLineClearSfx,
  playTetrisClearSfx,
  playTetrisLevelUpSfx,
  playTetrisGameOverSfx,
} from "./TetrisGameAudioManager.js";

let tetrisRAF = null;
let tetrisActive = false;
let tetrisPaused = false;
let tetrisKeyHandler = null;

export function pauseTetrisGame() {
  tetrisPaused = true;
}

export function resumeTetrisGame() {
  tetrisPaused = false;
}

export function resetTetrisGame() {
  tetrisActive = false;
  tetrisPaused = false;

  /* STOP ANIMATION */

  if (tetrisRAF) {
    cancelAnimationFrame(tetrisRAF);
    tetrisRAF = null;
  }

  /* STOP KEYBOARD */

  if (tetrisKeyHandler) {
    document.removeEventListener("keydown", tetrisKeyHandler, true);

    tetrisKeyHandler = null;
  }

  /* CLEAR MAIN CANVAS */

  const canvas = document.getElementById("tetris-canvas");

  if (canvas) {
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  /* CLEAR GHOST CANVAS */

  const ghostCanvas = document.getElementById("tetris-ghost-canvas");

  if (ghostCanvas) {
    const ghostCtx = ghostCanvas.getContext("2d");

    if (ghostCtx) {
      ghostCtx.clearRect(0, 0, ghostCanvas.width, ghostCanvas.height);
    }
  }

  /* CLEAR NEXT CANVAS */

  const nextCanvas = document.getElementById("t-next-canvas");

  if (nextCanvas) {
    const nextCtx = nextCanvas.getContext("2d");

    if (nextCtx) {
      nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    }
  }

  /* GAME OVER */

  const gameOver = document.getElementById("tetris-game-over");

  if (gameOver) {
    gameOver.classList.remove("show");
  }

  /* GAME OVER SCORE */

  const gameOverScore = document.getElementById("tetris-go-score");

  if (gameOverScore) {
    gameOverScore.innerHTML = "";
  }

  /* LINE NOTIFICATION */

  const lineNotif = document.getElementById("t-line-notif");

  if (lineNotif) {
    lineNotif.classList.remove("flash");
    lineNotif.textContent = "";
  }

  /* LIVE STATS */

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
}

export function initTetrisGame(ctxData) {
  resetTetrisGame();

  const container = document.getElementById("seq3-tetris");
  if (!container) return;

  runTetris(ctxData);
}

function runTetris(ctxData) {
  // nettoyage sécurité
  if (tetrisKeyHandler) {
    document.removeEventListener("keydown", tetrisKeyHandler, true);
    tetrisKeyHandler = null;
  }

  const COLS = 10;
  const ROWS = 20;
  const CELL = 10;

  const PIECES = [
    { shape: [[1, 1, 1, 1]], color: "orangered" }, // I
    {
      shape: [
        [1, 1],
        [1, 1],
      ],
      color: "orangered",
    }, // O
    {
      shape: [
        [0, 1, 0],
        [1, 1, 1],
      ],
      color: "orangered",
    }, // T
    {
      shape: [
        [0, 1, 1],
        [1, 1, 0],
      ],
      color: "orangered",
    }, // S
    {
      shape: [
        [1, 1, 0],
        [0, 1, 1],
      ],
      color: "orangered",
    }, // Z
    {
      shape: [
        [1, 0, 0],
        [1, 1, 1],
      ],
      color: "orangered",
    }, // J
    {
      shape: [
        [0, 0, 1],
        [1, 1, 1],
      ],
      color: "orangered",
    }, // L
  ];

  const SCORE_TABLE = [0, 100, 300, 500, 800];
  const LINE_NOTIFS = ["", "NICE !", "DOUBLE !", "TRIPLE !", "TETRIS !"];

  const canvas = document.getElementById("tetris-canvas");
  const ghostCv = document.getElementById("tetris-ghost-canvas");
  const nextCv = document.getElementById("t-next-canvas");

  const goDiv = document.getElementById("tetris-game-over");
  const goScore = document.getElementById("tetris-go-score");

  const scoreEl = document.getElementById("t-score-val");
  const levelEl = document.getElementById("t-level-val");
  const linesEl = document.getElementById("t-lines-val");

  const notifEl = document.getElementById("t-line-notif");
  const recBanner = document.getElementById("tetris-record-banner");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const ghostCtx = ghostCv ? ghostCv.getContext("2d") : null;
  const nextCtx = nextCv ? nextCv.getContext("2d") : null;

  let board;
  let score;
  let level;
  let lines;
  let current;
  let next;
  let dropInterval;
  let lastDrop;
  let gameOver;

  function newBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  }

  function randPiece() {
    const p = PIECES[Math.floor(Math.random() * PIECES.length)];

    return {
      shape: p.shape,
      color: p.color,
      x: Math.floor(COLS / 2) - Math.floor(p.shape[0].length / 2),
      y: 0,
    };
  }

  function rotate(shape) {
    const rows = shape.length;
    const cols = shape[0].length;

    return Array.from({ length: cols }, (_, c) =>
      Array.from({ length: rows }, (_, r) => shape[rows - 1 - r][c]),
    );
  }

  function collides(piece, dx, dy, shape) {
    const s = shape || piece.shape;

    for (let r = 0; r < s.length; r++) {
      for (let c = 0; c < s[r].length; c++) {
        if (!s[r][c]) continue;

        const nx = piece.x + c + (dx || 0);
        const ny = piece.y + r + (dy || 0);

        if (nx < 0 || nx >= COLS || ny >= ROWS) {
          return true;
        }

        if (ny >= 0 && board[ny][nx]) {
          return true;
        }
      }
    }

    return false;
  }

  function merge() {
    current.shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          board[current.y + r][current.x + c] = current.color;
        }
      });
    });
  }

  function clearLines() {
    let cleared = 0;

    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r].every((c) => c !== null)) {
        board.splice(r, 1);
        board.unshift(Array(COLS).fill(null));

        cleared++;
        r++;
      }
    }

    if (cleared > 0) {
      lines += cleared;
      score += SCORE_TABLE[cleared] * level;

      const newLevel = Math.floor(lines / 10) + 1;
      const hasLeveledUp = newLevel !== level;

      if (cleared === 4) {
        playTetrisClearSfx();
      } else {
        playTetrisLineClearSfx();
      }

      if (hasLeveledUp) {
        level = newLevel;

        setTimeout(() => {
          if (tetrisActive) {
            playTetrisLevelUpSfx();
          }
        }, 500);
      }

      updateUI();
      showLineNotif(cleared);
      syncScoreBox();
    }
  }

  function syncScoreBox() {
    const pts = document.getElementById("score-points");
    const lvl = document.getElementById("score-turns");

    if (pts) pts.textContent = score;
    if (lvl) lvl.textContent = level;
  }

  function updateUI() {
    if (scoreEl) scoreEl.textContent = score;
    if (levelEl) levelEl.textContent = level;
    if (linesEl) linesEl.textContent = lines;
  }

  function showLineNotif(n) {
    if (!notifEl || n < 1) return;

    notifEl.textContent = LINE_NOTIFS[n] || LINE_NOTIFS[4];

    notifEl.classList.remove("flash");

    void notifEl.offsetWidth;

    notifEl.classList.add("flash");

    notifEl.addEventListener(
      "animationend",
      () => notifEl.classList.remove("flash"),
      { once: true },
    );
  }

  function getDropInterval() {
    return Math.max(100, 800 - (level - 1) * 70);
  }

  function getGhostY() {
    let dy = 0;

    while (!collides(current, 0, dy + 1)) {
      dy++;
    }

    return current.y + dy;
  }

  function drawCell(c, x, y, alpha) {
    if (!c) return;

    ctx.globalAlpha = alpha || 1;

    ctx.fillStyle = c;
    ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);

    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.strokeRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);

    ctx.globalAlpha = 1;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        ctx.strokeRect(c * CELL, r * CELL, CELL, CELL);
      }
    }

    // cellules posées
    board.forEach((row, r) => {
      row.forEach((cell, c) => {
        drawCell(cell, c, r);
      });
    });

    // ghost
    if (ghostCtx) {
      ghostCtx.clearRect(0, 0, ghostCv.width, ghostCv.height);

      const gy = getGhostY();

      if (gy !== current.y) {
        current.shape.forEach((row, r) => {
          row.forEach((cell, c) => {
            if (cell) {
              ghostCtx.globalAlpha = 0.22;
              ghostCtx.fillStyle = current.color;

              ghostCtx.fillRect(
                (current.x + c) * CELL + 1,
                (gy + r) * CELL + 1,
                CELL - 2,
                CELL - 2,
              );

              ghostCtx.strokeStyle = current.color;

              ghostCtx.strokeRect(
                (current.x + c) * CELL + 1,
                (gy + r) * CELL + 1,
                CELL - 2,
                CELL - 2,
              );

              ghostCtx.globalAlpha = 1;
            }
          });
        });
      }
    }

    // pièce actuelle
    current.shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          drawCell(current.color, current.x + c, current.y + r);
        }
      });
    });

    // preview
    if (nextCtx && nextCv) {
      nextCtx.clearRect(0, 0, nextCv.width, nextCv.height);

      const pw = next.shape[0].length;
      const ph = next.shape.length;

      const ox = Math.floor((4 - pw) / 2);
      const oy = Math.floor((4 - ph) / 2);

      next.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) {
            nextCtx.fillStyle = next.color;

            nextCtx.fillRect((ox + c) * 20 + 1, (oy + r) * 20 + 1, 18, 18);

            nextCtx.strokeStyle = "rgba(255,255,255,0.15)";

            nextCtx.strokeRect((ox + c) * 20 + 1, (oy + r) * 20 + 1, 18, 18);
          }
        });
      });
    }
  }

  function lockAndNext() {
    playTetrisPieceLockSfx();

    merge();
    clearLines();

    current = next;
    next = randPiece();

    if (collides(current, 0, 0)) {
      triggerGameOver();
    }
  }

  function triggerGameOver() {
    gameOver = true;
    tetrisActive = false;
    fadeOutTetrisMusic();
    playTetrisGameOverSfx();

    if (tetrisRAF) {
      cancelAnimationFrame(tetrisRAF);
      tetrisRAF = null;
    }

    if (tetrisKeyHandler) {
      document.removeEventListener("keydown", tetrisKeyHandler, true);
      tetrisKeyHandler = null;
    }

    ctxData.stopTimer();

    // UI
    if (goScore) {
      goScore.innerHTML = `
        <div>Score :</div>
        <div>${score}</div>
      `;
    }

    if (goDiv) {
      goDiv.classList.add("show");
    }

    // record
    const player = window.SMQ_RETRAITES[ctxData.getCurrentIndex()];

    const oldScore = parseInt(
      localStorage.getItem("tetris_best_score") || "0",
      10,
    );

    let isNewRecord = false;

    if (score > oldScore) {
      localStorage.setItem("tetris_best_score", score);

      if (player) {
        localStorage.setItem("tetris_best_player", player.nom);
      }

      isNewRecord = true;
    }

    const notifications = document.querySelector(".coney-tetris-notifications");

    if (notifications) {
      notifications.innerHTML = `
    <span class="tetris-notif-game-over">
      GAME OVER
    </span>

    <span class="tetris-notif-separator"></span>

    <span class="tetris-notif-label">
      Retraité :
    </span>

    <span class="tetris-notif-player">
      ${player?.nom || ""}
    </span>

    <span class="tetris-notif-slash">/</span>

    <span class="tetris-notif-label">
      Score :
    </span>

    <span class="tetris-notif-final-score">
      ${score}
    </span>

    ${
      isNewRecord
        ? '<span class="tetris-notif-record">Nouveau Record !</span>'
        : ""
    }
  `;
    }

    updateTetrisBestScoreUI();

    if (recBanner) {
      recBanner.classList.remove("show", "blink");

      recBanner.style.opacity = "0";
      recBanner.style.transform = "translateY(10px)";

      if (isNewRecord) {
        recBanner.textContent = "Nouveau Record";

        void recBanner.offsetWidth;

        setTimeout(() => {
          recBanner.classList.add("show");

          recBanner.style.opacity = "1";
          recBanner.style.transform = "translateY(0)";

          setTimeout(() => {
            recBanner.classList.remove("blink");

            void recBanner.offsetWidth;

            recBanner.classList.add("blink");
          }, 200);
        }, 300);
      }
    }
  }

  function updateTetrisBestScoreUI() {
    const el = document.getElementById("best-score-tetris");

    if (!el) return;

    const sc = localStorage.getItem("tetris_best_score");
    const pl = localStorage.getItem("tetris_best_player");

    if (sc && pl) {
      el.innerHTML = `
        Meilleur score :
        <span class="best-name">${pl}</span>
        <span class="best-time">${sc} pts</span>
      `;

      el.dataset.visible = "true";

      el.style.transition = "all .6s ease";
      el.style.transform = "translateY(0)";
      el.style.opacity = "1";
    }
  }

  function startTetris() {
    board = newBoard();

    score = 0;
    level = 1;
    lines = 0;

    gameOver = false;
    tetrisActive = true;

    current = randPiece();
    next = randPiece();

    dropInterval = getDropInterval();
    lastDrop = performance.now();

    updateUI();
    syncScoreBox();

    if (goDiv) {
      goDiv.classList.remove("show");
    }

    if (recBanner) {
      recBanner.classList.remove("show");
    }

    tetrisKeyHandler = function (e) {
      if (!tetrisActive) return;

      const code = e.code;

      if (
        code === "ArrowLeft" ||
        code === "ArrowRight" ||
        code === "ArrowDown" ||
        code === "ArrowUp" ||
        code === "Space"
      ) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (gameOver) return;

      switch (code) {
        case "ArrowLeft":
          if (!collides(current, -1, 0)) {
            current.x--;
            playTetrisMoveRotateSfx();
          }

          break;

        case "ArrowRight":
          if (!collides(current, 1, 0)) {
            current.x++;
            playTetrisMoveRotateSfx();
          }

          break;

        case "ArrowDown":
          if (!e.repeat) {
            playTetrisDropSfx();
          }

          if (!collides(current, 0, 1)) {
            current.y++;
          } else {
            lockAndNext();
          }

          break;

        case "ArrowUp": {
          const rotated = rotate(current.shape);

          if (!collides(current, 0, 0, rotated)) {
            current.shape = rotated;
            playTetrisMoveRotateSfx();
          }

          break;
        }

        case "Space":
          playTetrisDropSfx();

          let guard = 0;

          while (!collides(current, 0, 1) && guard < 50) {
            current.y++;
            guard++;
          }

          lockAndNext();

          break;
      }
    };

    document.addEventListener("keydown", tetrisKeyHandler, true);

    function loop(now) {
      if (!tetrisActive) return;
      if (tetrisPaused) {
  lastDrop = now;
  tetrisRAF = requestAnimationFrame(loop);
  return;
}

      const elapsed = now - lastDrop;

      dropInterval = getDropInterval();

      if (elapsed > dropInterval) {
        if (!collides(current, 0, 1)) {
          current.y++;
        } else {
          lockAndNext();
        }

        lastDrop = now;
      }

      draw();

      tetrisRAF = requestAnimationFrame(loop);
    }

    tetrisRAF = requestAnimationFrame(loop);
  }

  startTetris();
}
