"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QuizRichText from "./QuizRichText";
import { evaluateAnswer, prepareOptions, prepareQuiz } from "../../scripts/quiz/californiaSoulQuiz";
import styles from "../../styles/quiz/CaliforniaSoulPage.module.css";

export default function QuizRunner({ level, levelName, onRequestBack, onMissingAnswer, onComplete, isLeaving, loadQuestions, indexedOptionKeys = false }) {
  const [questionBank, setQuestionBank] = useState(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [validated, setValidated] = useState(false);
  const [questionTransition, setQuestionTransition] = useState("");
  const transitionTimer = useRef(null);

  useEffect(() => {
    let active = true;
    loadQuestions().then((loadedQuestions) => {
      if (active) setQuestionBank(loadedQuestions);
    });
    return () => { active = false; };
  }, [loadQuestions]);

  const questions = useMemo(
    () => (questionBank ? prepareQuiz(questionBank, level) : []),
    [questionBank, level],
  );
  const question = questions[index];
  const options = useMemo(() => (question ? prepareOptions(question) : []), [question]);

  useEffect(() => () => window.clearTimeout(transitionTimer.current), []);

  const validate = () => {
    if (!selected) {
      onMissingAnswer();
      return;
    }

    if (!validated) {
      const evaluation = evaluateAnswer(question, selected);
      if (evaluation.isCorrect) setScore((value) => value + evaluation.scoreDelta);
      setValidated(true);
      return;
    }

    if (index === questions.length - 1) {
      onComplete(score, questions.length, levelName, level);
      return;
    }

    setQuestionTransition("fadeOut");
    window.clearTimeout(transitionTimer.current);
    transitionTimer.current = window.setTimeout(() => {
      setIndex((value) => value + 1);
      setSelected(null);
      setValidated(false);
      setQuestionTransition("fadeIn");
      transitionTimer.current = window.setTimeout(() => setQuestionTransition(""), 450);
    }, 300);
  };

  const evaluation = validated ? evaluateAnswer(question, selected) : null;
  const transitionClass = questionTransition === "fadeOut"
    ? styles.questionFadeOut
    : questionTransition === "fadeIn"
      ? styles.questionFadeIn
      : "";

  if (!question) {
    return <div className={styles.runner}><p>Chargement du quiz…</p></div>;
  }

  return (
    <div className={`${styles.runner} ${isLeaving ? styles.quizScreenFadingOut : ""}`}>
      <button type="button" className={styles.backToLevels} onClick={onRequestBack}>Retour à la sélection de niveau</button>
      <div className={`${styles.questionHeader} ${transitionClass}`}>
        <p className={styles.questionCounter}>Question {index + 1} / {questions.length}</p>
        <p className={styles.scoreText}>Score: {score}</p>
      </div>
      <div className={`${styles.questionText} ${transitionClass}`}><span className={styles.questionContent}><QuizRichText>{question.question}</QuizRichText></span></div>
      <div className={`${styles.options} ${question.type === "vraiFaux" ? styles.trueFalse : ""} ${transitionClass}`}>
        {options.map((option, optionIndex) => {
          const isCorrectOption = option === question.answer;
          const isSelectedOption = option === selected;
          const state = validated
            ? isCorrectOption
              ? styles.correct
              : isSelectedOption
                ? styles.wrong
                : ""
            : isSelectedOption
              ? styles.selected
              : "";
          return <button key={indexedOptionKeys ? `${option}-${optionIndex}` : option} type="button" className={`${styles.option} ${state} ${validated ? styles.disabled : ""}`} onClick={() => !validated && setSelected(option)}><QuizRichText>{option}</QuizRichText></button>;
        })}
      </div>
      <div className={`${styles.feedback} ${validated ? styles.feedbackVisible : styles.feedbackEmpty} ${transitionClass}`} aria-live="polite">
        {validated && <>
          <b className={`${styles.feedbackTitle} ${evaluation.isCorrect ? styles.good : styles.bad}`}>{evaluation.isCorrect ? "VRAI" : "FAUX"}</b>
          <p>{!evaluation.isCorrect && <>La bonne réponse était : <strong><QuizRichText>{evaluation.correctAnswer}</QuizRichText></strong>. </>}<QuizRichText>{evaluation.explanation}</QuizRichText></p>
        </>}
      </div>
      <button type="button" className={`${styles.action} ${styles.nextButton} ${transitionClass}`} onClick={validate}>{validated ? "Suivant" : "Valider"}</button>
    </div>
  );
}
