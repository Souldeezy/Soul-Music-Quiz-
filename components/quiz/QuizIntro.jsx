import { QUIZ_LEVELS as LEVELS } from "../../data/quizzes/quizConfig";
import styles from "../../styles/quiz/CaliforniaSoulPage.module.css";

export default function QuizIntro({ quizName, selectedLevel, isLeaving, onRequestBack, onStart }) {
  return (
    <div className={`${styles.quizWrapper} ${isLeaving ? styles.quizScreenFadingOut : ""}`}>
      <button type="button" className={styles.backToLevels} onClick={onRequestBack}>Retour à la sélection de niveau</button>
      <div className={`${styles.quizIntro} ${styles[selectedLevel.level] || ""}`}>
        <div className={styles.introImage} style={{ backgroundImage: `url(/svg/quiz/common/${LEVELS.find((item) => item[0] === selectedLevel.level)?.[2]})` }} aria-hidden="true" />
        <div className={styles.h2Wrapper}>
          <h2 className={styles.quizTitle}>{quizName}</h2>
          <p>{selectedLevel.name}</p>
        </div>
        <button type="button" className={`${styles.action} ${styles.startButton}`} onClick={onStart}>Commencer le Quiz</button>
      </div>
    </div>
  );
}
