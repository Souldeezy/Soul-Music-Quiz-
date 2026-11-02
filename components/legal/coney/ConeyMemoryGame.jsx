const MEMORY_OBJECTIVES = [
  { label: "Paires à trouver", value: "9" },
  { label: "Erreurs maximum", value: "9" },
];

const MEMORY_FINAL_STATS = [
  { label: "Temps :", id: "memory-final-time" },
  { label: "Paires :", id: "memory-final-pairs" },
  { label: "Erreurs :", id: "memory-final-errors" },
];

const MEMORY_LIVE_STATS = [
  {
    label: "Temps",
    id: "memory-time",
    value: "00:00",
    extraClass: "memory-live-time",
  },
  {
    label: "Paires",
    id: "memory-pairs",
    value: "0 / 9",
    extraClass: "",
  },
  {
    label: "Erreurs",
    id: "memory-errors",
    value: "0 / 9",
    extraClass: "",
  },
];

export default function ConeyMemoryGame() {
  return (
    <div id="seq3-memory" className="seq3-content">
      <div
        id="blueprint-memory"
        className="coney-blueprint-memory"
      >
        {/* SCOREBOARD............................................................................................... */}

        <div className="coney-memory-scoreboard">
          <div className="memory-score-title">Objectifs</div>

          {MEMORY_OBJECTIVES.map((objective) => (
            <div className="memory-score-row" key={objective.label}>
              <span className="memory-score-label">
                {objective.label}
              </span>

              <span className="memory-score-value">
                {objective.value}
              </span>
            </div>
          ))}
        </div>

        {/* GAME AREA................................................................................................ */}

        <div className="coney-memory-game">
          <div id="memory-wrapper">
            <div id="memory-grid"></div>

            {/* END MESSAGE.......................................................................................... */}

            <div id="memory-end-message">
              <div
                id="memory-end-title"
                className="memory-end-title"
              >
                GAME OVER
              </div>

              <div className="memory-win-stats">
                {MEMORY_FINAL_STATS.map((stat) => (
                  <div className="memory-win-row" key={stat.id}>
                    <span className="memory-win-label">
                      {stat.label}
                    </span>

                    <span
                      id={stat.id}
                      className="memory-win-value"
                    ></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS.................................................................................................. */}

        <div className="coney-memory-actions">
          <div className="memory-live-stats">
            {MEMORY_LIVE_STATS.map((stat) => (
              <div className="memory-live-row" key={stat.id}>
                <span className="memory-live-label">
                  {stat.label}
                </span>

                <span
                  id={stat.id}
                  className={`memory-live-value ${stat.extraClass}`.trim()}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          <button
            id="memory-new-game-btn"
            className="memory-action-btn"
          >
            NOUVELLE PARTIE
          </button>
        </div>

        {/* NOTIFICATIONS............................................................................................ */}

        <div
          id="memory-notif"
          className="coney-memory-notifications"
        ></div>
      </div>
    </div>
  );
}