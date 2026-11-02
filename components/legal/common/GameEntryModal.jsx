export default function GameEntryModal() {
  return (
    <div
      id="game-entry-modal"
      className="game-entry-modal"
      aria-hidden="true"
    >
      <div className="game-entry-modal-content">
        {/* QUESTION................................................................................................ */}

        <div className="game-entry-modal-question">
          Voulez-vous faire une partie de{" "}
          <span id="game-entry-modal-name"></span> ?
        </div>

        {/* PRICE.................................................................................................... */}

        <div
          id="game-entry-modal-price"
          className="game-entry-modal-price"
        >
          0 $
        </div>

        {/* ERROR.................................................................................................... */}

        <div
          id="game-entry-modal-error"
          className="game-entry-modal-error"
        ></div>

        {/* ACTIONS.................................................................................................. */}

        <div className="game-entry-modal-actions">
          <button
            id="game-entry-modal-confirm"
            className="game-entry-modal-btn game-entry-modal-confirm"
            type="button"
          >
            OUI
          </button>

          <button
            id="game-entry-modal-cancel"
            className="game-entry-modal-btn game-entry-modal-cancel"
            type="button"
          >
            NON
          </button>
        </div>
      </div>
    </div>
  );
}