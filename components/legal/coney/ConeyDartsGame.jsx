const DARTS_SCORES = [
  {
    label: "Bullseye",
    detail: "Centre",
    value: "50 pts",
  },
  {
    label: "Bull",
    detail: "Anneau central",
    value: "25 pts",
  },
  {
    label: "Triple",
    detail: "Anneau triple",
    multiplier: 3,
  },
  {
    label: "Double",
    detail: "Anneau double",
    multiplier: 2,
  },
  {
    label: "Simple extérieur",
    detail: "Valeur normale",
    multiplier: 1,
  },
  {
    label: "Simple intérieur",
    detail: "Valeur normale",
    multiplier: 1,
  },
];

const DARTS_GAUGE_SECTIONS = [
  "darts-gauge-red-top",
  "darts-gauge-orange-top",
  "darts-gauge-green",
  "darts-gauge-orange-bottom",
  "darts-gauge-red-bottom",
];

const DARTS_LIVE_STATS = [
  { label: "Temps", id: "timer-value", value: "00:00" },
  { label: "Points", id: "score-points", value: "301" },
  { label: "Tours", id: "score-turns", value: "0" },
];

export default function ConeyDartsGame() {
  return (
    <div id="seq3-darts" className="seq3-content">
      <div id="blueprint-darts" className="coney-blueprint-darts">

        {/* SCOREBOARD............................................................................................... */}

        <div className="coney-darts-scoreboard">
          <div className="darts-score-title">Scores</div>

          {DARTS_SCORES.map((score) => (
            <div className="darts-score-row" key={score.label}>
              <div className="darts-score-info">
                <span className="darts-score-label">{score.label}</span>
                <span className="darts-score-detail">{score.detail}</span>
              </div>

              <span className="darts-score-value">
                {score.multiplier ? (
                  <>
                    <span className="darts-score-x">×</span>
                    {score.multiplier}
                  </>
                ) : (
                  score.value
                )}
              </span>
            </div>
          ))}
        </div>

        {/* GAME AREA................................................................................................ */}

        <div className="coney-darts-game">
          <div className="game-image darts-image"></div>
          <div id="darts-overlay"></div>

          <div id="darts-gauge-container">
            <div id="darts-gauge">
              {DARTS_GAUGE_SECTIONS.map((sectionId) => (
                <div id={sectionId} key={sectionId}></div>
              ))}

              <div id="darts-cursor"></div>
            </div>

            <div id="darts-gauge-label">Visez le vert</div>
          </div>

          {/* WIN MESSAGE............................................................................................ */}

          <div id="darts-win-message">
            <div className="win-title">GAGNÉ</div>

            <div className="win-stats">
              <div className="win-row" id="win-row-record">
                <span className="win-label">Joueur :</span>
                <span id="win-player" className="win-value"></span>
                <span id="win-record">Nouveau Record !</span>
              </div>

              <div className="win-row">
                <span className="win-label">Temps :</span>
                <span id="win-time" className="win-value"></span>
              </div>

              <div className="win-row" id="win-row-tour">
                <span className="win-label">Tours :</span>
                <span id="win-turns" className="win-value"></span>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS.................................................................................................. */}

        <div className="coney-darts-actions">
          <div className="darts-live-stats">
            {DARTS_LIVE_STATS.map((stat) => (
              <div className="darts-live-row" key={stat.id}>
                <span className="darts-live-label">{stat.label}</span>

                <span id={stat.id} className="darts-live-value">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          <button
            id="darts-new-game-btn"
            className="darts-action-btn"
          >
            NOUVELLE PARTIE
          </button>
        </div>

        {/* NOTIFICATIONS............................................................................................ */}

        <div
          id="darts-notif"
          className="coney-darts-notifications"
        ></div>
      </div>
    </div>
  );
}