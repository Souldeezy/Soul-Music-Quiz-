const COMBOS = [
  { label: "Quinte Flush Royale", score: 1000 },
  { label: "Quinte Flush", score: 500 },
  { label: "Carré", score: 250 },
  { label: "Full", score: 100 },
  { label: "Couleur", score: 75 },
  { label: "Suite", score: 50 },
  { label: "Brelan", score: 30 },
  { label: "Double Paire", score: 20 },
  { label: "Paire (Minimum J)", score: 10 },
];

const DECK_LAYERS = ["vp-deck-3", "vp-deck-2", "vp-deck-1"];
const CARD_COUNT = 5;

export default function CasinoVideoPoker() {
  return (
    <div id="seq3-videoPoker" className="seq3-content">
      <div
        id="blueprint-videoPoker"
        className="casino-blueprint-videoPoker"
      >
        {/* SCOREBOARD............................................................................................... */}

        <div className="casino-vp-scoreboard">
          <div className="vp-score-title">Combos</div>

          {COMBOS.map((combo) => (
            <div className="vp-score-row" key={combo.label}>
              <span className="vp-combo-label">{combo.label}</span>
              <span className="vp-combo-score">{combo.score}</span>
            </div>
          ))}
        </div>

        {/* GAME..................................................................................................... */}

        <div className="casino-vp-game">
          <div className="vp-table">
            <div className="vp-deck-stack">
              {DECK_LAYERS.map((className) => (
                <div className={className} key={className}></div>
              ))}
            </div>

            <div className="vp-cards">
              {Array.from({ length: CARD_COUNT }, (_, index) => (
                <div className="vp-card" key={index}></div>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIONS.................................................................................................. */}

        <div className="casino-vp-actions">
          <button className="vp-action-btn">REMPLACER</button>
          <button className="vp-action-btn">NOUVELLE PARTIE</button>
        </div>

        {/* NOTIFICATIONS............................................................................................ */}

        <div className="casino-vp-notifications"></div>
      </div>
    </div>
  );
}