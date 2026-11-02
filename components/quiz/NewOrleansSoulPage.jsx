"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { QUIZ_LEVELS as LEVELS } from "../../data/quizzes/quizConfig";
import QuizMenu from "./QuizMenu";
import QuizIntro from "./QuizIntro";
import QuizResult from "./QuizResult";
import QuizRunner from "./QuizRunner";
import ScoreDashboard from "./ScoreDashboard";
import { MissingAnswerDialog, QuitQuizDialog } from "./QuizDialogs";
import NewOrleansSoulBanner from "./NewOrleansSoulBanner";
import identity from "../../styles/quiz/NewOrleansSoulPage.module.css";
import styles from "../../styles/quiz/CaliforniaSoulPage.module.css";
import quizStyles from "../../styles/quiz/QuizPage.module.css";

let newOrleansSoulQuestionsPromise;

function loadNewOrleansSoulQuestions() {
  newOrleansSoulQuestionsPromise ??= import("../../data/quizzes/new-orleans-soul")
    .then(({ newOrleansSoulQuestions }) => newOrleansSoulQuestions);
  return newOrleansSoulQuestionsPromise;
}

function NewOrleansSoulHero() {
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
    <section ref={heroRef} className={`${styles.heroMenuQuiz} ${identity.hero}`}>
      <QuizMenu />
      <div className={`${quizStyles["logo-wrapper"]} ${styles.californiaHeroLogo}`}>
        <div className={quizStyles["logo-spin"]} />
      </div>
      <div className={styles.heroCopy}>
        <h1 ref={titleRef} className={styles.heroTitle}>New Orleans Soul<span className="sr-only"> : Quizzes sur le thème de la New Orleans Soul</span></h1>
        <p className={styles.heroTexte}>Découvrez la Southern Soul du Big Easy</p>
      </div>
      <div className={`${quizStyles["hero-scroll-down"]} ${styles.californiaHeroScroll}`}>
        <i className="fa-solid fa-chevron-down" />
        <p>Faire défiler pour voir le quiz</p>
        <i className="fa-solid fa-chevron-down" />
      </div>
    </section>
  );
}


const SCORE_EVENT = "smq:new-orleans-soul:scores";
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
function NewOrleansSoulQuiz() {
  const quizSectionRef = useRef(null);
  const last = useStoredScore("smq:new-orleans-soul:lastScore");
  const best = useStoredScore("smq:new-orleans-soul:bestScore");
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
    void loadNewOrleansSoulQuestions();
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
    sessionStorage.setItem("smq:new-orleans-soul:lastScore", JSON.stringify(data));
    if (!best || score > best.score) { sessionStorage.setItem("smq:new-orleans-soul:bestScore", JSON.stringify(data)); }
    window.dispatchEvent(new Event(SCORE_EVENT)); setResult(data); setDashboardVisible(true); setScreen("result");
  };

  return (
    <section ref={quizSectionRef} className={`${styles.quizSection} ${screen === "runner" ? styles.quizRunning : ""}`}>
      <ScoreDashboard quizName="New Orleans Soul" last={last} best={best} visible={dashboardVisible} />
      {screen === "levels" && <div className={`${styles.levelState} ${levelSelectionEntering ? styles.levelStateEntering : ""}`}>
        <div className={styles.quizLogo} aria-hidden="true" />
        <div className={`${styles.levelMenu} ${quizVisible ? styles.levelMenuVisible : ""}`}>
          <h2>Choix du niveau</h2>
          {LEVELS.map(([level, name, image], index) => (
            <button type="button" key={level} onClick={() => selectLevel(level, name)}>
              <span>{name}</span>
              <picture className={styles.levelArtPicture}>
                <source media="(min-width: 768px)" srcSet={`/svg/quiz/common/${image}`} />
                <img
                  className={`${styles.levelArt} ${[styles.kidEffect, styles.teenEffect, styles.manEffect, styles.mamaEffect, styles.singerEffect][index]}`}
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
          quizName="New Orleans Soul"
          selectedLevel={selectedLevel}
          isLeaving={quittingQuiz}
          onRequestBack={requestLevelSelection}
          onStart={() => setScreen("runner")}
        />
      )}
      {screen === "runner" && selectedLevel && <QuizRunner level={selectedLevel.level} levelName={selectedLevel.name} onRequestBack={requestLevelSelection} onMissingAnswer={() => setMissingAnswerOpen(true)} onComplete={complete} isLeaving={quittingQuiz} loadQuestions={loadNewOrleansSoulQuestions} indexedOptionKeys />}
      {screen === "result" && result && (
        <QuizResult
          result={result}
          onRestart={() => setScreen("intro")}
          onReturnToMenu={() => { setLevelSelectionEntering(true); setDashboardVisible(true); setScreen("levels"); }}
        />
      )}
      {confirmOpen && (
        <QuitQuizDialog
          titleId="new-orleans-quit-title"
          closing={closingModal === "confirm"}
          onConfirm={confirmLevelSelection}
          onCancel={cancelLevelSelection}
        />
      )}
      {missingAnswerOpen && (
        <MissingAnswerDialog
          titleId="new-orleans-answer-required-title"
          closing={closingModal === "missingAnswer"}
          onClose={closeMissingAnswer}
        />
      )}
    </section>
  );
}

export default function NewOrleansSoulPage() {
  return <>
    <NewOrleansSoulHero />
    <NewOrleansSoulBanner />
    <NewOrleansSoulQuiz />
    <NewOrleansSoulBanner bottom />
  </>;
}
