"use client";

import { useEffect } from "react";

const RESET_VERSION = "2026-10-17-v1";
const QUIZ_SCORE_KEYS = [
  "lastScore",
  "bestScore",
  "smq:chicago-soul:lastScore",
  "smq:chicago-soul:bestScore",
  "smq:detroit-soul:lastScore",
  "smq:detroit-soul:bestScore",
  "smq:memphis-soul:lastScore",
  "smq:memphis-soul:bestScore",
  "smq:new-orleans-soul:lastScore",
  "smq:new-orleans-soul:bestScore",
  "smq:new-york-soul:lastScore",
  "smq:new-york-soul:bestScore",
];

const GAME_RECORD_KEYS = [
  "darts_best_time",
  "darts_best_player",
  "tetris_best_score",
  "tetris_best_player",
  "memory_best_time",
  "memory_best_player",
  "maze_best_score",
  "maze_best_player",
  "casino_videoPoker_best_gain",
  "casino_videoPoker_best_player",
  "casino_slotMachine_best_gain",
  "casino_slotMachine_best_player",
  "casino_luckyWheel_best_gain",
  "casino_luckyWheel_best_player",
  "casino_dice_best_gain",
  "casino_dice_best_player",
];

export default function ResetLocalScoresOnce() {
  useEffect(() => {
    // This is a one-time reset for the local preview, not a production behavior.
    if (process.env.NODE_ENV !== "development") return;

    let removedScores = false;
    const sessionResetKey = `smq:score-reset:${RESET_VERSION}`;
    const localResetKey = `smq:game-record-reset:${RESET_VERSION}`;
    const legalTestResetKey = "smq:legal-test-retiree-reset:v1";

    if (sessionStorage.getItem(sessionResetKey) !== "done") {
      for (const key of QUIZ_SCORE_KEYS) {
        if (sessionStorage.getItem(key) !== null) removedScores = true;
        sessionStorage.removeItem(key);
      }
      sessionStorage.setItem(sessionResetKey, "done");
    }

    if (localStorage.getItem(localResetKey) !== RESET_VERSION) {
      for (const key of GAME_RECORD_KEYS) {
        if (localStorage.getItem(key) !== null) removedScores = true;
        localStorage.removeItem(key);
      }
      localStorage.setItem(localResetKey, RESET_VERSION);
    }

    // Remove the temporary local test retiree so NYC games are locked again
    // until a player earns and retires an employee in Employee Game.
    if (localStorage.getItem(legalTestResetKey) !== "done") {
      localStorage.setItem("smq_retirees", "[]");
      window.SMQ_RETRAITES = [];
      localStorage.setItem(legalTestResetKey, "done");
      removedScores = true;
    }

    if (removedScores) window.location.reload();
  }, []);

  return null;
}
