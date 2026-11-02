"use client";

import { useEffect, useState } from "react";
import { BANNER_FALLBACK_MESSAGE, BANNER_VIEWPORT_QUERY } from "../../shared/bannerFallbackMessage";

import initMallSystem from "../../../scripts/legal/MallSystem";

import DestinationHub from "./DestinationHub";
import GameEntryModal from "./GameEntryModal";

import Coney from "../coney/Coney";
import ConeyDartsGame from "../coney/ConeyDartsGame";
import ConeyMazeGame from "../coney/ConeyMazeGame";
import ConeyMemoryGame from "../coney/ConeyMemoryGame";
import ConeyTetrisGame from "../coney/ConeyTetrisGame";

import Mall from "../mall/Mall";
import MallAudio from "../mall/MallAudio";
import MallBooks from "../mall/MallBooks";
import MallFashion from "../mall/MallFashion";
import MallVinyls from "../mall/MallVinyls";

import Casino from "../casino/Casino";
import CasinoDice from "../casino/CasinoDice";
import CasinoLuckyWheel from "../casino/CasinoLuckyWheel";
import CasinoSlotMachine from "../casino/CasinoSlotMachine";
import CasinoVideoPoker from "../casino/CasinoVideoPoker";

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

export default function LegalBannerBottom() {
  const isLargeViewport = useLargeBannerViewport();

  if (!isLargeViewport) {
    return (
      <div className="legal-banner-placeholder">
        <p>{BANNER_FALLBACK_MESSAGE}</p>
      </div>
    );
  }

  return <LegalBannerBottomContent />;
}

function LegalBannerBottomContent() {
  useEffect(() => {
    initMallSystem();
  }, []);

  return (
    <div className="section-banner banner-legal" id="second-banner">

      {/* BANNER HEADER.............................................................................................. */}

      <h2>SoulMusicQuiz</h2>

      <div className="banner-bar">
        <i className="fa-solid fa-rss" aria-hidden="true"></i>
        <i className="fa-solid fa-record-vinyl" aria-hidden="true"></i>
        <i className="fa-solid fa-music" aria-hidden="true"></i>
      </div>

      {/* DESTINATION HUB............................................................................................ */}

      <DestinationHub />

      {/* DESTINATION AND GAME CONTAINER............................................................................. */}

      <div id="mall-seq2">
        <div id="seq2-bg"></div>
        <div id="mall-seq2-nom"></div>

        {/* NAVIGATION............................................................................................... */}

        <a id="mall-sortir">Revenir en arrière</a>
        <a id="start-game">Commencer le jeu</a>

        {/* PLAYER INFORMATION....................................................................................... */}

        <div id="player-name-container">
          <div className="player-label">Retraité :</div>
          <div className="player-name"></div>
        </div>

        <div id="player-money-container">
          <div className="money-label">Argent :</div>
          <div className="player-money"></div>
        </div>

        {/* CONEY.................................................................................................... */}

        <Coney />
        <ConeyDartsGame />
        <ConeyTetrisGame />
        <ConeyMemoryGame />
        <ConeyMazeGame />

        {/* MALL..................................................................................................... */}

        <Mall />
        <MallVinyls />
        <MallBooks />
        <MallAudio />
        <MallFashion />

        {/* CASINO................................................................................................... */}

        <Casino />
        <CasinoVideoPoker />
        <CasinoSlotMachine />
        <CasinoLuckyWheel />
        <CasinoDice />
      </div>

      {/* GAME ENTRY MODAL........................................................................................... */}

      <GameEntryModal />
    </div>
  );
}
