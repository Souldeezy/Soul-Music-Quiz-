"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { QUIZ_LEVELS as LEVELS } from "../../data/quizzes/quizConfig";
import QuizMenu from "./QuizMenu";
import QuizIntro from "./QuizIntro";
import QuizResult from "./QuizResult";
import QuizRunner from "./QuizRunner";
import ScoreDashboard from "./ScoreDashboard";
import { MissingAnswerDialog, QuitQuizDialog } from "./QuizDialogs";
import { BANNER_FALLBACK_MESSAGE, BANNER_VIEWPORT_QUERY } from "../shared/bannerFallbackMessage";
import styles from "../../styles/quiz/CaliforniaSoulPage.module.css";
import quizStyles from "../../styles/quiz/QuizPage.module.css";

let californiaSoulQuestionsPromise;

function loadCaliforniaSoulQuestions() {
  californiaSoulQuestionsPromise ??= import("../../data/quizzes/california-soul")
    .then(({ californiaSoulQuestions }) => californiaSoulQuestions);
  return californiaSoulQuestionsPromise;
}

function CaliforniaSoulHero() {
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
    <section ref={heroRef} className={styles.heroMenuQuiz}>
      <QuizMenu />
      <div className={`${quizStyles["logo-wrapper"]} ${styles.californiaHeroLogo}`}>
        <div className={quizStyles["logo-spin"]} />
      </div>
      <div className={styles.heroCopy}>
        <h1 ref={titleRef} className={styles.heroTitle}>California Soul<span className="sr-only"> : Quizzes sur le thème de la California Soul</span></h1>
        <p className={styles.heroTexte}>Découvrez la scène Soul de la West Coast</p>
      </div>
      <div className={`${quizStyles["hero-scroll-down"]} ${styles.californiaHeroScroll}`}>
        <i className="fa-solid fa-chevron-down" />
        <p>Faire défiler pour voir le quiz</p>
        <i className="fa-solid fa-chevron-down" />
      </div>
    </section>
  );
}

function CaliforniaSoulBanner({ bottom = false }) {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(BANNER_VIEWPORT_QUERY);
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const ref = (node) => {
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(node);
  };

  if (!enabled) {
    return <div className={quizStyles.placeholder}><p>{BANNER_FALLBACK_MESSAGE}</p></div>;
  }

  if (!bottom) {
    return (
      <div ref={ref} className={`${styles.firstBanner} ${visible ? styles.firstBannerVisible : ""}`}>
        <h2 className={styles.firstBannerTitle}>California Soul</h2>
        <div className={styles.cadillacEffect} aria-hidden="true" />
        <div className={styles.lightsContainer} aria-hidden="true">
          <div className={styles.lightsEffect1} />
          <div className={styles.lightsEffect2} />
          <div className={styles.lightsEffect3} />
          <div className={styles.lightsEffect4} />
        </div>
        <div className={styles.firstBannerBar} aria-hidden="true">
          <i className="fa-solid fa-rss" />
          <i className="fa-solid fa-record-vinyl" />
          <i className="fa-solid fa-music" />
        </div>
      </div>
    );
  }

  return (
    <section ref={ref} className={`${styles.banner} ${bottom ? styles.bannerBeach : styles.bannerCadillac} ${visible ? styles.bannerVisible : ""}`}>
      <h2>{bottom ? "SoulMusicQuiz" : "California Soul"}</h2>
      {!bottom ? (
        <>
          <div className={styles.cadillac} aria-hidden="true" />
          <div className={styles.headlights} aria-hidden="true"><i /><i /><i /><i /></div>
        </>
      ) : (
        <div className={styles.beachObjects} aria-hidden="true">
          {[1, 2, 3, 4, 5, 6].map((number) => <i key={`palm-${number}`} className={`${styles.palm} ${styles[`palm${number}`]}`} />)}
          <i className={styles.cabin} /><i className={styles.shop} /><i className={styles.store} />
          <i className={styles.vendor} /><i className={styles.parasol} /><i className={styles.van} />
          <i className={styles.surf} /><i className={styles.bbq} /><i className={styles.bbqman} />
          <i className={styles.surfer} /><i className={styles.direction} />
          <span>Welcome to Venice Beach</span>
        </div>
      )}
      <div className={styles.bannerIcons} aria-hidden="true"><i className="fa-solid fa-rss" /><i className="fa-solid fa-record-vinyl" /><i className="fa-solid fa-music" /></div>
    </section>
  );
}


function subscribeToQuizScores(onChange) {
  window.addEventListener("storage", onChange);
  window.addEventListener("quiz-scores-updated", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("quiz-scores-updated", onChange);
  };
}

function readLastScoreSnapshot() {
  try {
    return window.sessionStorage.getItem("lastScore");
  } catch {
    return null;
  }
}

function readBestScoreSnapshot() {
  try {
    return window.sessionStorage.getItem("bestScore");
  } catch {
    return null;
  }
}

function parseScoreSnapshot(snapshot) {
  try {
    return snapshot ? JSON.parse(snapshot) : null;
  } catch {
    return null;
  }
}

function CaliforniaSoulQuiz() {
  const quizSectionRef = useRef(null);
  const last = parseScoreSnapshot(useSyncExternalStore(subscribeToQuizScores, readLastScoreSnapshot, () => null));
  const best = parseScoreSnapshot(useSyncExternalStore(subscribeToQuizScores, readBestScoreSnapshot, () => null));
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
    void loadCaliforniaSoulQuestions();
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
    sessionStorage.setItem("lastScore", JSON.stringify(data));
    if (!best || score > best.score) sessionStorage.setItem("bestScore", JSON.stringify(data));
    window.dispatchEvent(new Event("quiz-scores-updated"));
    setResult(data); setDashboardVisible(true); setScreen("result");
  };

  return (
    <section ref={quizSectionRef} className={`${styles.quizSection} ${screen === "runner" ? styles.quizRunning : ""}`}>
      <ScoreDashboard quizName="California Soul" last={last} best={best} visible={dashboardVisible} />
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
          quizName="California Soul"
          selectedLevel={selectedLevel}
          isLeaving={quittingQuiz}
          onRequestBack={requestLevelSelection}
          onStart={() => setScreen("runner")}
        />
      )}
      {screen === "runner" && selectedLevel && <QuizRunner level={selectedLevel.level} levelName={selectedLevel.name} onRequestBack={requestLevelSelection} onMissingAnswer={() => setMissingAnswerOpen(true)} onComplete={complete} isLeaving={quittingQuiz} loadQuestions={loadCaliforniaSoulQuestions} />}
      {screen === "result" && result && (
        <QuizResult
          result={result}
          onRestart={() => setScreen("intro")}
          onReturnToMenu={() => { setLevelSelectionEntering(true); setDashboardVisible(true); setScreen("levels"); }}
        />
      )}
      {confirmOpen && (
        <QuitQuizDialog
          titleId="california-quit-title"
          closing={closingModal === "confirm"}
          onConfirm={confirmLevelSelection}
          onCancel={cancelLevelSelection}
        />
      )}
      {missingAnswerOpen && (
        <MissingAnswerDialog
          titleId="california-answer-required-title"
          closing={closingModal === "missingAnswer"}
          onClose={closeMissingAnswer}
        />
      )}
    </section>
  );
}

export default function CaliforniaSoulPage() {
  return <>
    <CaliforniaSoulHero />
    <CaliforniaSoulBanner />
    <CaliforniaSoulQuiz />
    <CaliforniaSoulBanner bottom />
  </>;
}
