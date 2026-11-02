"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { QUIZ_LEVELS as LEVELS } from "../../data/quizzes/quizConfig";
import QuizMenu from "./QuizMenu";
import QuizIntro from "./QuizIntro";
import QuizResult from "./QuizResult";
import QuizRunner from "./QuizRunner";
import ScoreDashboard from "./ScoreDashboard";
import { MissingAnswerDialog, QuitQuizDialog } from "./QuizDialogs";
import ChicagoSoulBanner from "./ChicagoSoulBanner";
import chicagoStyles from "../../styles/quiz/ChicagoSoulPage.module.css";
// Deliberately reuse the frozen template CSS; only Chicago identity is overridden.
import styles from "../../styles/quiz/CaliforniaSoulPage.module.css";
import quizStyles from "../../styles/quiz/QuizPage.module.css";

let chicagoSoulQuestionsPromise;

function loadChicagoSoulQuestions() {
  chicagoSoulQuestionsPromise ??= import("../../data/quizzes/chicago-soul")
    .then(({ chicagoSoulQuestions }) => chicagoSoulQuestions);
  return chicagoSoulQuestionsPromise;
}

function ChicagoSoulHero() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    if (!hero || !title) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        title.classList.add(quizStyles["is-visible"]);
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={heroRef} className={`${styles.heroMenuQuiz} ${chicagoStyles.hero}`}>
      <QuizMenu />
      <div className={`${quizStyles["logo-wrapper"]} ${styles.californiaHeroLogo}`}>
        <div className={quizStyles["logo-spin"]} />
      </div>
      <div className={styles.heroCopy}>
        <h1 ref={titleRef} className={styles.heroTitle}>Chicago Soul<span className="sr-only"> : Quizzes sur le thème de Chicago</span></h1>
        <p className={styles.heroTexte}>Bienvenue dans la scène Soul de la Windy City</p>
      </div>
      <div className={`${quizStyles["hero-scroll-down"]} ${styles.californiaHeroScroll}`}>
        <i className="fa-solid fa-chevron-down" />
        <p>Faire défiler pour voir le quiz</p>
        <i className="fa-solid fa-chevron-down" />
      </div>
    </section>
  );
}


const SCORE_EVENT = "smq:chicago-soul:scores";
function subscribeScores(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(SCORE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SCORE_EVENT, callback);
  };
}
function useStoredScore(key) {
  const raw = useSyncExternalStore(subscribeScores, () => {
    try { return sessionStorage.getItem(key); } catch { return null; }
  }, () => null);
  return useMemo(() => {
    try { return JSON.parse(raw); } catch { return null; }
  }, [raw]);
}

// Local controller preserves California unchanged; the pure quiz engine is shared.
function ChicagoSoulQuiz() {
  const quizSectionRef = useRef(null);
  const last = useStoredScore("smq:chicago-soul:lastScore");
  const best = useStoredScore("smq:chicago-soul:bestScore");
  const [quizVisible, setQuizVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [screen, setScreen] = useState("levels");
  const [result, setResult] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [missingAnswerOpen, setMissingAnswerOpen] = useState(false);
  const [closingModal, setClosingModal] = useState(null);
  const [quittingQuiz, setQuittingQuiz] = useState(false);
  const [levelSelectionEntering, setLevelSelectionEntering] = useState(false);
  const [dashboardVisible, setDashboardVisible] = useState(true);

  useEffect(() => {
    const section = quizSectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setQuizVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const selectLevel = (level, name) => {
    void loadChicagoSoulQuestions();
    setQuittingQuiz(false);
    setLevelSelectionEntering(false);
    setDashboardVisible(false);
    setSelectedLevel({ level, name });
    setScreen("intro");
  };
  const requestLevelSelection = () => setConfirmOpen(true);
  const cancelLevelSelection = () => {
    setClosingModal("confirm");
    window.setTimeout(() => {
      setConfirmOpen(false);
      setClosingModal(null);
    }, 500);
  };
  const confirmLevelSelection = () => {
    setQuittingQuiz(true);
    setClosingModal("confirm");
    window.setTimeout(() => {
      setConfirmOpen(false);
      setClosingModal(null);
      setQuittingQuiz(false);
      setLevelSelectionEntering(true);
      setDashboardVisible(true);
      setScreen("levels");
      setSelectedLevel(null);
      setResult(null);
    }, 500);
  };
  const closeMissingAnswer = () => {
    setClosingModal("missingAnswer");
    window.setTimeout(() => {
      setMissingAnswerOpen(false);
      setClosingModal(null);
    }, 500);
  };
  const complete = (score, total, levelName, level) => {
    const data = { score, total, levelName, level };
    try {
      sessionStorage.setItem("smq:chicago-soul:lastScore", JSON.stringify(data));
      if (!best || score > best.score) sessionStorage.setItem("smq:chicago-soul:bestScore", JSON.stringify(data));
      window.dispatchEvent(new Event(SCORE_EVENT));
    } catch { /* The quiz can still finish when browser storage is unavailable. */ }
    setResult(data); setDashboardVisible(true); setScreen("result");
  };

  return (
    <section ref={quizSectionRef} className={`${styles.quizSection} ${screen === "runner" ? styles.quizRunning : ""}`}>
      <ScoreDashboard quizName="Chicago Soul" last={last} best={best} visible={dashboardVisible} />
      {screen === "levels" && <div className={`${styles.levelState} ${levelSelectionEntering ? styles.levelStateEntering : ""}`}>
        <div className={styles.quizLogo} aria-hidden="true" />
        <div className={`${styles.levelMenu} ${quizVisible ? styles.levelMenuVisible : ""}`}>
          <h2>Choix du niveau</h2>
          {LEVELS.map(([level, name, image], index) => (
            <button type="button" key={level} onClick={() => selectLevel(level, name)}>
              <span>{name}</span>
              <picture className={`${styles.levelArtPicture} ${chicagoStyles.levelArtPicture}`}>
                <source media="(min-width: 768px)" srcSet={`/svg/quiz/common/${image}`} />
                <img
                  className={`${styles.levelArt} ${[styles.kidEffect, styles.teenEffect, styles.manEffect, styles.mamaEffect, styles.singerEffect][index]} ${index === 1 ? chicagoStyles.levelArtTeen : ""}`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  aria-hidden="true"
                />
              </picture>
            </button>
          ))}
        </div>
      </div>}
      {screen === "intro" && selectedLevel && (
        <QuizIntro
          quizName="Chicago Soul"
          selectedLevel={selectedLevel}
          isLeaving={quittingQuiz}
          onRequestBack={requestLevelSelection}
          onStart={() => setScreen("runner")}
        />
      )}
      {screen === "runner" && selectedLevel && <QuizRunner level={selectedLevel.level} levelName={selectedLevel.name} onRequestBack={requestLevelSelection} onMissingAnswer={() => setMissingAnswerOpen(true)} onComplete={complete} isLeaving={quittingQuiz} loadQuestions={loadChicagoSoulQuestions} />}
      {screen === "result" && result && (
        <QuizResult
          result={result}
          onRestart={() => setScreen("intro")}
          onReturnToMenu={() => { setLevelSelectionEntering(true); setDashboardVisible(true); setScreen("levels"); }}
        />
      )}
      {confirmOpen && (
        <QuitQuizDialog
          titleId="chicago-quit-title"
          closing={closingModal === "confirm"}
          onConfirm={confirmLevelSelection}
          onCancel={cancelLevelSelection}
        />
      )}
      {missingAnswerOpen && (
        <MissingAnswerDialog
          titleId="chicago-answer-required-title"
          closing={closingModal === "missingAnswer"}
          onClose={closeMissingAnswer}
        />
      )}
    </section>
  );
}

export default function ChicagoSoulPage() {
  return <>
    <ChicagoSoulHero />
    <ChicagoSoulBanner />
    <ChicagoSoulQuiz />
    <ChicagoSoulBanner bottom />
  </>;
}
