/* DONNÉES DES GAINS ................................................................................................. */

const GAINS = [
  { label: "Jackpot", combo: "6-6-6", score: "500 $" },
  { label: "421", combo: "4-2-1", score: "50 $" },
  { label: "Brelan", combo: "Autre triple", score: "20 $" },
  { label: "Grande Suite", combo: "4-5-6", score: "10 $" },
  { label: "Petite Suite", combo: "1-2-3", score: "5 $" },
  { label: "Paire", combo: "Une paire", score: "1 $" },
  { label: "Perdu", combo: "Autre", score: "0 $" },
];

/* JEU DE DÉS ........................................................................................................ */

export default function CasinoDice() {
  return (
    <div id="seq3-dice" className="seq3-content">
      <div id="blueprint-dice" className="casino-blueprint-dice">

        {/* TABLEAU DES GAINS ....................................................................................... */}

        <div className="casino-dice-scoreboard">
          <div className="dice-score-title">Gains</div>

          {GAINS.map((item) => (
            <div className="dice-score-row" key={item.label}>
              <div className="dice-score-info">
                <span className="dice-gain-label">{item.label}</span>
                <span className="dice-combo-label">{item.combo}</span>
              </div>

              <span className="dice-gain-score">{item.score}</span>
            </div>
          ))}
        </div>

        {/* ZONE DE JEU ............................................................................................. */}

        <div className="casino-dice-game">
          <div className="dice-table">
            <div className="dice-container">
              <img
                id="dice-1"
                className="dice-img"
                src="/images/legal/banner-bottom-nyc-games/casino/dice-game/die-4.png"
                alt="Dé 4"
                data-value="4"
              />

              <img
                id="dice-2"
                className="dice-img"
                src="/images/legal/banner-bottom-nyc-games/casino/dice-game/die-2.png"
                alt="Dé 2"
                data-value="2"
              />

              <img
                id="dice-3"
                className="dice-img"
                src="/images/legal/banner-bottom-nyc-games/casino/dice-game/die-1.png"
                alt="Dé 1"
                data-value="1"
              />
            </div>
          </div>
        </div>

        {/* ACTIONS ................................................................................................. */}

        <div className="casino-dice-actions">
          <button id="dice-roll-btn" className="dice-action-btn">
            LANCER
          </button>

          <button id="dice-new-game-btn" className="dice-action-btn">
            NOUVELLE PARTIE
          </button>
        </div>

        {/* NOTIFICATIONS ........................................................................................... */}

        <div className="casino-dice-notifications" />
      </div>
    </div>
  );
}