const TETRIS_SCORE_RULES = [
  { label: "1 ligne", value: "100 pts" },
  { label: "2 lignes", value: "300 pts" },
  { label: "3 lignes", value: "500 pts" },
  { label: "TETRIS", value: "800 pts" },
];

const TETRIS_LIVE_STATS = [
  {
    label: "Temps",
    id: "tetris-timer-value",
    value: "00:00",
    extraClass: "tetris-live-time",
  },
  {
    label: "Score",
    id: "t-score-val",
    value: "0",
    extraClass: "",
  },
  {
    label: "Niveau",
    id: "t-level-val",
    value: "1",
    extraClass: "",
  },
  {
    label: "Lignes",
    id: "t-lines-val",
    value: "0",
    extraClass: "",
  },
];

export default function ConeyTetrisGame() {
  return (
    <div id="seq3-tetris" className="seq3-content">
      <div
        id="blueprint-tetris"
        className="coney-blueprint-tetris"
      >
        {/* SCOREBOARD............................................................................................... */}

        <div className="coney-tetris-scoreboard">
          <div className="tetris-score-title">Scores</div>

          {TETRIS_SCORE_RULES.map((rule) => (
            <div className="tetris-score-row" key={rule.label}>
              <div className="tetris-score-info">
                <span className="tetris-score-label">
                  {rule.label}
                </span>
              </div>

              <span className="tetris-score-value">
                {rule.value}
              </span>
            </div>
          ))}

          <div className="tetris-score-row">
            <div className="tetris-score-info">
              <span className="tetris-score-label">Niveau</span>
              <span className="tetris-score-detail">
                Multiplicateur x Score
              </span>
            </div>
          </div>
        </div>

        {/* GAME AREA................................................................................................ */}

        <div className="coney-tetris-game">
          <div id="tetris-wrapper">
            <div id="tetris-next-block">
              <div className="t-panel-label">NEXT</div>

              <canvas
                id="t-next-canvas"
                width="60"
                height="60"
              />
            </div>

            <div id="tetris-board-container">
              <canvas
                id="tetris-canvas"
                width="100"
                height="200"
              />

              <canvas
                id="tetris-ghost-canvas"
                width="100"
                height="200"
              />

              <div id="t-line-notif"></div>

              {/* GAME OVER.......................................................................................... */}

              <div id="tetris-game-over">
                <div id="tetris-go-title">GAME OVER</div>
                <div id="tetris-go-score"></div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS.................................................................................................. */}

        <div className="coney-tetris-actions">
          <div className="tetris-live-stats">
            {TETRIS_LIVE_STATS.map((stat) => (
              <div className="tetris-live-row" key={stat.id}>
                <span className="tetris-live-label">
                  {stat.label}
                </span>

                <span
                  id={stat.id}
                  className={`tetris-live-value ${stat.extraClass}`.trim()}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          <button
            id="tetris-new-game-btn"
            className="tetris-action-btn"
          >
            NOUVELLE PARTIE
          </button>
        </div>

        {/* NOTIFICATIONS............................................................................................ */}

        <div
          id="tetris-notif"
          className="coney-tetris-notifications"
        ></div>
      </div>
    </div>
  );
}