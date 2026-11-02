import styles from "../../styles/quiz/CaliforniaSoulPage.module.css";

export default function ScoreDashboard({ quizName, last, best, visible }) {
  return (
    <div className={`${styles.scoreDashboard} ${visible ? styles.scoreVisible : ""}`}>
      <div><b>Dernier score</b><strong>{last ? `${last.score} / ${last.total}` : "-"}</strong><small>{last ? <>{`Quiz ${quizName} `}<span className={styles.scoreLevel}>{last.levelName}</span></> : "-"}</small></div>
      <span />
      <div><b>Meilleur score</b><strong>{best ? `${best.score} / ${best.total}` : "-"}</strong><small>{best ? <>{`Quiz ${quizName} `}<span className={styles.scoreLevel}>{best.levelName}</span></> : "-"}</small></div>
    </div>
  );
}
