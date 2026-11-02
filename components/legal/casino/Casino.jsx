/* HUB CASINO ........................................................................................................ */

export default function Casino() {
  return (
    <div id="seq2-casino" className="seq2-content">
      
      {/* DÉCOR ..................................................................................................... */}

      <div className="effet-map-casino" />
      <div className="effet-map-casino-overlay" />

      {/* MEILLEURS SCORES .......................................................................................... */}

      <div
        id="best-score-videoPoker"
        className="effet-casino-best-score-videoPoker"
      />

      <div
        id="best-score-slotMachine"
        className="effet-casino-best-score-slotMachine"
      />

      <div
        id="best-score-luckyWheel"
        className="effet-casino-best-score-luckyWheel"
      />

      <div
        id="best-score-dice"
        className="effet-casino-best-score-dice"
      />

      {/* JEUX ...................................................................................................... */}

      <a href="#casino-video-poker" className="effet-casino-game-videoPoker">Video Poker</a>
      <a href="#casino-slot-machine" className="effet-casino-game-slotMachine">Slot Machine</a>
      <a href="#casino-lucky-wheel" className="effet-casino-game-luckyWheel">Lucky Wheel</a>
      <a href="#casino-dice" className="effet-casino-game-dice">Dice Game</a>

      {/* EMPLACEMENT FERMÉ ......................................................................................... */}

      <div className="effet-casino-vide">Fermé</div>
    </div>
  );
}
