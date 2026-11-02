const CONEY_GAMES = [
  {
    key: "darts",
    name: "Darts",
    bestScore: "Meilleur temps : --",
  },
  {
    key: "tetris",
    name: "Tetris Game",
    bestScore: "Meilleur score :",
  },
  {
    key: "memory",
    name: "Memory Game",
    bestScore: "Meilleur temps :",
  },
  {
    key: "maze",
    name: "Soul Motel",
    bestScore: "Meilleur score :",
  },
];

export default function Coney() {
  return (
    <div id="seq2-coney" className="seq2-content">
      {/* MAP........................................................................................................ */}

      <div className="effet-map-coney"></div>

      {/* BEST SCORES................................................................................................ */}

      {CONEY_GAMES.map((game) => (
        <div
          className={`effet-coney-best-score-${game.key}`}
          id={`best-score-${game.key}`}
          key={game.key}
        >
          {game.bestScore}
        </div>
      ))}

      {/* GAMES...................................................................................................... */}

      {CONEY_GAMES.map((game) => (
        <a
          href={`#${game.key}-game`}
          className={`effet-coney-game-${game.key}`}
          key={game.key}
        >
          {game.name}
        </a>
      ))}
    </div>
  );
}
