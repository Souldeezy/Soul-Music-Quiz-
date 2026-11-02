const MAZE_HUD_STATS = [
  { label: "Temps :", id: "maze-time" },
  { label: "SOUL :", id: "maze-soul" },
  { label: "Etage :", id: "maze-floor" },
  { label: "Clés :", id: "maze-secrets" },
  { label: "Poulet :", id: "maze-chicken" },
  { label: "Fromage :", id: "maze-cheese" },
  { label: "Echelle :", id: "maze-ladder" },
];

export default function ConeyMazeGame() {
  return (
    <div id="seq3-maze" className="seq3-content">

      {/* MAP........................................................................................................ */}

      <div className="cont-left">
        <div id="maze-map" className="map-maze"></div>
      </div>

      {/* GAME....................................................................................................... */}

      <div className="cont-center">
        <div className="grid-maze">
          <div id="maze-track"></div>
          <div id="maze-player" className="maze-player"></div>
        </div>

        <div className="cont-notif">
          Bienvenue dans le Soul Motel
        </div>

        <button id="maze-move-btn" type="button">
          Avancer
        </button>
      </div>

      {/* HUD........................................................................................................ */}

      <div className="cont-right">
        <div id="maze-global-hud" className="cont-infos">
          {MAZE_HUD_STATS.map((stat) => (
            <div className="ligne-stat-hud-1" key={stat.id}>
              <div className="ligne-stat-label-1">{stat.label}</div>
              <div
                id={stat.id}
                className="ligne-stat-valeur-1"
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}