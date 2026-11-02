import styles from "../../styles/quiz/CaliforniaSoulPage.module.css";

export function QuitQuizDialog({ titleId, closing, onConfirm, onCancel }) {
  return (
    <div className={`${styles.modalOverlay} ${closing ? styles.modalClosing : ""}`} role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onCancel();
    }}>
      <div className={styles.modalContent} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h4 id={titleId}>Quitter le quiz ?</h4>
        <p>Votre progression sera perdue. Êtes-vous sûr de vouloir continuer ?</p>
        <div className={styles.modalButtons}>
          <button type="button" className={`${styles.action} ${styles.modalConfirm}`} onClick={onConfirm}>Oui, quitter</button>
          <button type="button" className={`${styles.action} ${styles.modalCancel}`} onClick={onCancel}>Non, continuer</button>
        </div>
      </div>
    </div>
  );
}

export function MissingAnswerDialog({ titleId, closing, onClose }) {
  return (
    <div className={`${styles.modalOverlay} ${closing ? styles.modalClosing : ""}`} role="presentation">
      <div className={styles.modalContent} role="alertdialog" aria-modal="true" aria-labelledby={titleId}>
        <h4 id={titleId}>Réponse requise</h4>
        <p>Veuillez sélectionner une réponse avant de valider.</p>
        <div className={styles.modalButtons}>
          <button type="button" className={`${styles.action} ${styles.modalCancel}`} onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}
