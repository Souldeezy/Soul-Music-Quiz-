/* DONNÉES DES COMBINAISONS .............................................................................................. */

const COMBOS = [
  { label: "3 Diamants", score: "1000" },
  { label: "3 Seven", score: "500" },
  { label: "3 BAR", score: "250" },
  { label: "3 Cloches", score: "100" },
  { label: "3 Oranges", score: "75" },
  { label: "3 Citrons", score: "50" },
  { label: "3 Cerises", score: "30" },
  { label: "2 Diamants", score: "20" },
  { label: "2 Seven", score: "10" },
];

/* DONNÉES DES ROULEAUX .................................................................................................. */

const SYMBOLS = [
  { name: "cherry", alt: "Cherry" },
  { name: "lemon", alt: "Lemon" },
  { name: "orange", alt: "Orange" },
  { name: "bell", alt: "Bell" },
  { name: "bar", alt: "Bar" },
  { name: "seven", alt: "Seven" },
  { name: "diamond", alt: "Diamond" },
];

const REEL_SYMBOLS = [...SYMBOLS, ...SYMBOLS];
const REELS = [1, 2, 3];

/* MACHINE À SOUS .......................................................................................................... */

export default function CasinoSlotMachine() {
  return (
    <div id="seq3-slotMachine" className="seq3-content">
      <div
        id="blueprint-slotMachine"
        className="casino-blueprint-slotMachine"
      >
        {/* TABLEAU DES COMBINAISONS ....................................................................................... */}

        <div className="casino-sm-scoreboard">
          <div className="sm-score-title">Combos</div>

          {COMBOS.map((combo) => (
            <div className="sm-score-row" key={combo.label}>
              <span className="sm-combo-label">{combo.label}</span>
              <span className="sm-combo-score">{combo.score}</span>
            </div>
          ))}
        </div>

        {/* ZONE DE JEU .................................................................................................... */}

        <div className="casino-sm-game">
          <div className="sm-table">
            <div className="sm-reels">
              {REELS.map((reel) => (
                <div className={`sm-reel reel-${reel}`} key={reel}>
                  <div id={`sm-strip-${reel}`} className="sm-strip">
                    {REEL_SYMBOLS.map((symbol, index) => (
                      <img
                        key={`${reel}-${symbol.name}-${index}`}
                        src={`/images/legal/banner-bottom-nyc-games/casino/slot-machine/${symbol.name}.png`}
                        alt={symbol.alt}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIONS ......................................................................................................... */}

        <div className="casino-sm-actions">
          <button className="sm-action-btn">LANCER</button>
          <button className="sm-action-btn">NOUVELLE PARTIE</button>
        </div>

        {/* NOTIFICATIONS ................................................................................................... */}

        <div className="casino-sm-notifications" />
      </div>
    </div>
  );
}