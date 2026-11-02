import { getEndMessage } from "../../scripts/quiz/californiaSoulQuiz";
import styles from "../../styles/quiz/CaliforniaSoulPage.module.css";

export default function QuizResult({ result, onRestart, onReturnToMenu }) {
  return (
    <div className={styles.result}>
      <h2 className={styles.endTitle}>Quiz terminé</h2><p className={styles.finalScore}>Votre score est de : {result.score} sur {result.total}</p>
      <p className={styles.endMessage}>{getEndMessage(result.level, result.score)}</p>
      <div><button type="button" className={styles.action} onClick={onRestart}>Recommencer</button><button type="button" className={styles.action} onClick={onReturnToMenu}>Retour au menu</button></div>
    </div>
  );
}
