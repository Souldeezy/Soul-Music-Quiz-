"use client";

import { useEffect, useState } from "react";
import { BANNER_FALLBACK_MESSAGE, BANNER_VIEWPORT_QUERY } from "../../shared/bannerFallbackMessage";

import EmployeeGame from "./EmployeeGame";

import {
  pauseEmployeeAudio,
  playEmployeeMusic,
  playEmployeeSfx,
  resetEmployeeAudio,
  resumeEmployeeAudio,
} from "../../../scripts/legal/EmployeeGameAudioManager";

const EMPLOYEE_RULES = [
  <>
    Vos employés travaillent et gagnent de l’
    <span className="employee-rule-highlight">argent</span>.
  </>,
  <>
    Choisissez leurs repas pour améliorer leur{" "}
    <span className="employee-rule-highlight">rendement</span>.
  </>,
  <>
    Au niveau <span className="employee-rule-highlight">Effective</span>, vous
    pouvez les envoyer à la{" "}
    <span className="employee-rule-highlight">retraite</span>.
  </>,
  <>
    Retrouvez votre retraité dans la bannière du dessous pour profiter des jeux
    avec son <span className="employee-rule-highlight">argent</span> !
  </>,
];

function useLargeBannerViewport() {
  const [isLargeViewport, setIsLargeViewport] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(BANNER_VIEWPORT_QUERY);
    const updateViewport = () => setIsLargeViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  return isLargeViewport;
}

export default function LegalBannerTop() {
  const isLargeViewport = useLargeBannerViewport();

  if (!isLargeViewport) {
    return (
      <div className="legal-banner-placeholder">
        <p>{BANNER_FALLBACK_MESSAGE}</p>
      </div>
    );
  }

  return <LegalBannerTopContent />;
}

function LegalBannerTopContent() {
  const [step, setStep] = useState("welcome");
  const [ruleIndex, setRuleIndex] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [nameError, setNameError] = useState("");

  const employeeGameStarted = step === "playing";

  /* PLAYER NAME VALIDATION........................................................................................... */

  function startWithPlayerName(event) {
    event.preventDefault();

    const name = playerName.trim();

    if (name.length < 2) return;

    try {
      const savedRetirees = JSON.parse(
        localStorage.getItem("smq_retirees") || "[]",
      );

      const retirees = Array.isArray(window.SMQ_RETRAITES)
        ? window.SMQ_RETRAITES
        : Array.isArray(savedRetirees)
          ? savedRetirees
          : [];

      const alreadyAvailable = retirees.some(
        (retiree) =>
          typeof retiree?.nom === "string" &&
          Number.isFinite(retiree.argent) &&
          retiree.argent >= 5 &&
          retiree.nom.trim().toLowerCase() === name.toLowerCase(),
      );

      if (alreadyAvailable) {
        setNameError(
          "Un retraité encore disponible dans la bannière du dessous porte ce nom.",
        );

        return;
      }

      setPlayerName(name);
      setNameError("");

      playEmployeeSfx("BUTTON_ENTER_AFTER_NAME");
      playEmployeeMusic("MUSIC_GAME");

      setStep("playing");
    } catch {
      setNameError("Impossible de vérifier ce nom. Réessayez.");
    }
  }

  /* START BUTTON..................................................................................................... */

  function handleStartClick() {
    playEmployeeSfx("BUTTON_NEW_GAME");
    playEmployeeMusic("MUSIC_INTRO");

    setRuleIndex(0);
    setStep("welcome-exit");
  }

  /* PLAYER NAME INPUT................................................................................................ */

  function handlePlayerNameChange(event) {
    const nextName = event.target.value
      .replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ '-]/g, "")
      .toUpperCase()
      .slice(0, 12);

    if (nextName.length > playerName.length) {
      playEmployeeSfx("WRITE_NAME");
    }

    setPlayerName(nextName);
    setNameError("");
  }

  /* AUDIO VISIBILITY................................................................................................. */

  useEffect(() => {
    const banner = document.getElementById("first-banner");

    if (!banner) return;

    let bannerVisible = false;

    function updateAudioVisibility() {
      if (bannerVisible && !document.hidden) {
        resumeEmployeeAudio();
      } else {
        pauseEmployeeAudio();
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        bannerVisible = entry.isIntersecting;
        updateAudioVisibility();
      },
      { threshold: 0 },
    );

    pauseEmployeeAudio();

    observer.observe(banner);

    document.addEventListener(
      "visibilitychange",
      updateAudioVisibility,
    );

    return () => {
      observer.disconnect();

      document.removeEventListener(
        "visibilitychange",
        updateAudioVisibility,
      );

      resetEmployeeAudio();
    };
  }, []);

  /* RULES SEQUENCE................................................................................................... */

  useEffect(() => {
    if (step === "welcome-exit") {
      const timer = window.setTimeout(() => {
        setStep("rules");
      }, 500);

      return () => window.clearTimeout(timer);
    }

    if (step !== "rules") return;

    const timer = window.setTimeout(() => {
      if (ruleIndex < EMPLOYEE_RULES.length - 1) {
        setRuleIndex((index) => index + 1);
      } else {
        setStep("continue");
      }
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [step, ruleIndex]);

  /* INPUT FOCUS...................................................................................................... */

  useEffect(() => {
    if (step !== "continue") return;

    const banner = document.getElementById("first-banner");
    const input = document.getElementById("employee-player-name");

    if (!banner || !input) return;

    let bannerVisible = false;

    function updateInputFocus() {
      if (bannerVisible && !document.hidden) {
        input.focus({ preventScroll: true });
      } else if (document.activeElement === input) {
        input.blur();
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        bannerVisible =
          entry.isIntersecting && entry.intersectionRatio >= 0.5;

        updateInputFocus();
      },
      { threshold: [0, 0.5] },
    );

    observer.observe(banner);

    document.addEventListener("visibilitychange", updateInputFocus);

    return () => {
      observer.disconnect();

      document.removeEventListener(
        "visibilitychange",
        updateInputFocus,
      );
    };
  }, [step]);

  return (
    <div className="section-banner banner-categories" id="first-banner">

      {/* BANNER HEADER.............................................................................................. */}

      <h2>Sections</h2>

      <div className="banner-bar">
        <i className="fa-solid fa-rss" aria-hidden="true"></i>
        <i className="fa-solid fa-record-vinyl" aria-hidden="true"></i>
        <i className="fa-solid fa-music" aria-hidden="true"></i>
      </div>

      {/* EMPLOYEE GAME.............................................................................................. */}

      <EmployeeGame
        started={employeeGameStarted}
        playerName={playerName}
      />

      {/* ENTRY OVERLAY.............................................................................................. */}

      <div
        className={`employee-game-entry ${
          employeeGameStarted ? "is-hidden" : ""
        }`}
        aria-hidden={employeeGameStarted}
      >
        {/* WELCOME.................................................................................................. */}

        {(step === "welcome" || step === "welcome-exit") && (
          <div
            className={`employee-game-entry-content ${
              step === "welcome-exit" ? "employee-welcome-exit" : ""
            }`}
          >
            <p>
              Bienvenue dans <span>Employee Game</span> !
            </p>

            <p>Voulez-vous commencer une partie ?</p>

            <div className="employee-game-entry-actions">
              <button
                type="button"
                disabled={step === "welcome-exit"}
                onClick={handleStartClick}
              >
                COMMENCER
              </button>
            </div>
          </div>
        )}

        {/* RULES.................................................................................................... */}

        {step === "rules" && (
          <div className="employee-game-rules-screen">
            <p
              key={ruleIndex}
              className="employee-game-rule"
              role="status"
            >
              {EMPLOYEE_RULES[ruleIndex]}
            </p>
          </div>
        )}

        {/* PLAYER NAME.............................................................................................. */}

        {step === "continue" && (
          <div className="employee-game-rules-screen">
            <form
              className="employee-game-name-form"
              onSubmit={startWithPlayerName}
            >
              <label htmlFor="employee-player-name">
                Choisissez le nom de votre employé
              </label>

              <div className="employee-game-name-row">
                <div className="employee-game-name-field">
                  <div
                    className="employee-game-name-slots"
                    aria-hidden="true"
                  >
                    {Array.from({ length: 12 }, (_, index) => (
                      <span
                        key={index}
                        className={
                          index === playerName.length
                            ? "employee-name-blink"
                            : ""
                        }
                      >
                        {playerName[index] || "\u00A0"}
                      </span>
                    ))}
                  </div>

                  <input
                    id="employee-player-name"
                    type="text"
                    value={playerName}
                    maxLength={12}
                    autoComplete="off"
                    spellCheck={false}
                    aria-describedby="employee-name-message"
                    aria-invalid={Boolean(nameError)}
                    onChange={handlePlayerNameChange}
                  />
                </div>
              </div>

              <p
                id="employee-name-message"
                className="employee-game-name-message"
                role="status"
              >
                {nameError || (
                  <>
                    De 2 à 12 caractères. Appuyez sur{" "}
                    <strong className="employee-name-enter">
                      ENTRÉE
                    </strong>{" "}
                    quand votre nom est saisi.
                  </>
                )}
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
