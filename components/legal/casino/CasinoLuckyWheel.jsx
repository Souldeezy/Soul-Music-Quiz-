/* SECTEURS DE LA ROUE ............................................................................................... */

const SECTORS = [
  2, 0, 5, 10, 2, 0, 20, 5,
  50, 0, 2, 10, 5, 2, 20, 0,
  500, 0, 5, 2, 10, 0, 50, 5,
  2, 0, 20, 2, 5, 0, 2, 10,
];

/* ROUE DE LA FORTUNE ................................................................................................ */

export default function CasinoLuckyWheel() {
  return (
    <div id="seq3-luckyWheel" className="seq3-content">
      <div id="blueprint-luckyWheel" className="casino-blueprint-luckyWheel">

        {/* TABLEAU DES GAINS ....................................................................................... */}

        <div className="casino-lw-scoreboard">
          <div className="lw-score-title">Gains</div>

          <div className="lw-score-row">
            <span className="lw-gain-label">Jackpot</span>
            <span className="lw-gain-score">500 $</span>
          </div>

          <div className="lw-score-row">
            <span className="lw-gain-label">High Roller</span>
            <span className="lw-gain-score">50 $</span>
          </div>

          <div className="lw-score-row">
            <span className="lw-gain-label">Big Win</span>
            <span className="lw-gain-score">20 $</span>
          </div>

          <div className="lw-score-row">
            <span className="lw-gain-label">Hot Streak</span>
            <span className="lw-gain-score">10 $</span>
          </div>

          <div className="lw-score-row">
            <span className="lw-gain-label">Lucky Hit</span>
            <span className="lw-gain-score">5 $</span>
          </div>

          <div className="lw-score-row">
            <span className="lw-gain-label">Chip Win</span>
            <span className="lw-gain-score">2 $</span>
          </div>

          <div className="lw-score-row">
            <span className="lw-gain-label">No Luck</span>
            <span className="lw-gain-score">0 $</span>
          </div>
        </div>

        {/* ZONE DE JEU ............................................................................................. */}

        <div className="casino-lw-game">
          <div className="lw-table">
            <div className="lw-wheel-container">
              <div className="lw-pointer" />

              <div id="lw-wheel" className="lw-wheel">
                {SECTORS.map((gain, index) => (
                  <div
                    key={index}
                    className={`lw-sector lw-sector-${index + 1} lw-gain-${gain}`}
                    data-index={index}
                    data-gain={gain}
                  >
                    <span className="lw-sector-value">{gain}</span>
                  </div>
                ))}
              </div>

              <div className="lw-wheel-center" />
            </div>
          </div>
        </div>

        {/* ACTIONS ................................................................................................. */}

        <div className="casino-lw-actions">
          <button id="lw-spin-btn" className="lw-action-btn">
            LANCER
          </button>

          <button id="lw-new-game-btn" className="lw-action-btn">
            NOUVELLE PARTIE
          </button>
        </div>

        {/* NOTIFICATIONS ........................................................................................... */}

        <div className="casino-lw-notifications" />
      </div>
    </div>
  );
}