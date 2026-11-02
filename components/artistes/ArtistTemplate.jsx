"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { artistSlug } from "./artistSlug";
import styles from "../../styles/artistes/ArtistTemplate.module.css";

const tabs = [
  { id: "infos", label: "Infos" },
  { id: "parcours", label: "Parcours" },
  { id: "carriere", label: "Carrière" },
  { id: "ecouter", label: "Ecouter" },
];

function formatBiographyText(text) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    return part;
  });
}

export default function ArtistTemplate({ artist }) {
  const [activeTab, setActiveTab] = useState(0);
  const [leavingTab, setLeavingTab] = useState(null);
  const [entering, setEntering] = useState(false);
  const transitionTimer = useRef(null);
  const swipeRef = useRef(null);
  const suppressSwipeClickRef = useRef(false);

  useEffect(() => () => {
    window.clearTimeout(transitionTimer.current);
    const swipe = swipeRef.current;
    if (!swipe) return;
    window.removeEventListener("pointermove", swipe.onMove, true);
    window.removeEventListener("pointerup", swipe.onUp, true);
    window.removeEventListener("pointercancel", swipe.onCancel, true);
  }, []);

  function selectTab(index) {
    if (index === activeTab) return;
    window.clearTimeout(transitionTimer.current);
    setLeavingTab(activeTab);
    setEntering(false);
    const exitDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 500;
    transitionTimer.current = window.setTimeout(() => {
      setActiveTab(index);
      setLeavingTab(null);
      setEntering(true);
      const enterDuration = index === 3 ? 1200 : 500;
      transitionTimer.current = window.setTimeout(() => setEntering(false), enterDuration);
    }, exitDuration);
  }

  function panelClass(index) {
    return [
      styles.tabContent,
      index === activeTab ? styles.active : "",
      index === activeTab && entering ? (index === 3 ? styles.fadeEntering : styles.entering) : "",
      index === leavingTab ? styles.exiting : "",
    ].filter(Boolean).join(" ");
  }

  function startPointerSwipe(event) {
    if (event.button !== 0 || swipeRef.current) return;
    suppressSwipeClickRef.current = false;
    const swipe = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      startTab: activeTab,
      pointerType: event.pointerType,
      dragging: false,
      panel: event.currentTarget,
    };
    swipe.onMove = (moveEvent) => {
      if (swipeRef.current !== swipe || moveEvent.pointerId !== swipe.id) return;
      const distanceX = moveEvent.clientX - swipe.x;
      const distanceY = moveEvent.clientY - swipe.y;
      if (!swipe.dragging) {
        if (Math.abs(distanceX) < 10 || Math.abs(distanceX) <= Math.abs(distanceY)) return;
        swipe.dragging = true;
        suppressSwipeClickRef.current = true;
        swipe.panel.classList.add(styles.dragging);
      }
      if (swipe.pointerType === "mouse") moveEvent.preventDefault();
    };
    swipe.onUp = (upEvent) => finishPointerSwipe(upEvent, false);
    swipe.onCancel = (cancelEvent) => finishPointerSwipe(cancelEvent, true);
    swipeRef.current = swipe;
    window.addEventListener("pointermove", swipe.onMove, { capture: true, passive: false });
    window.addEventListener("pointerup", swipe.onUp, true);
    window.addEventListener("pointercancel", swipe.onCancel, true);
  }

  function finishPointerSwipe(event, cancelled) {
    const swipe = swipeRef.current;
    if (!swipe || swipe.id !== event.pointerId) return;
    swipeRef.current = null;
    window.removeEventListener("pointermove", swipe.onMove, true);
    window.removeEventListener("pointerup", swipe.onUp, true);
    window.removeEventListener("pointercancel", swipe.onCancel, true);
    swipe.panel.classList.remove(styles.dragging);
    if (!cancelled && swipe.dragging) {
      const distanceX = event.clientX - swipe.x;
      if (Math.abs(distanceX) >= 45) selectTab((swipe.startTab + (distanceX < 0 ? 1 : -1) + tabs.length) % tabs.length);
    }
  }

  return <section className={styles.dossier} aria-label={`Fiche de ${artist.name}`} onPointerDown={startPointerSwipe} onClickCapture={(event) => { if (suppressSwipeClickRef.current && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); suppressSwipeClickRef.current = false; } }} onDragStart={(event) => event.preventDefault()}>
    <div className={styles.tabs} role="tablist" aria-label="Rubriques de la fiche artiste">
      {tabs.map((tab, index) => <button
        type="button"
        key={tab.id}
        id={`artist-tab-${tab.id}`}
        className={`${styles.tab} ${styles[`tab${index + 1}`]} ${index === activeTab ? styles.selected : ""}`}
        role="tab"
        aria-selected={index === activeTab}
        aria-controls={`artist-panel-${tab.id}`}
        onClick={() => selectTab(index)}
      >{tab.label}</button>)}
    </div>

    <div className={styles.center}>
      <div id="artist-panel-infos" role="tabpanel" aria-labelledby="artist-tab-infos" aria-hidden={activeTab !== 0} className={`${panelClass(0)} ${styles.infoPanel}`}>
        <div className={styles.infoRows}>
          <div className={styles.statLine}><p className={styles.statTitle}>Nom :</p><h1 className={styles.artistName}>{artist.name}</h1></div>
          <div className={styles.statLine}><p className={styles.statTitle}>{artist.birthDateLabel ?? "Date de naissance :"}</p><p className={`${styles.statValue} ${artist.birthDateLabel === "Label :" ? styles.recordLabelValue : ""}`}>{artist.birthDate}</p></div>
          <div className={styles.statLine}><p className={styles.statTitle}>{artist.birthPlaceLabel ?? "Lieu de naissance :"}</p><p className={styles.statValue}>{artist.birthPlace}</p></div>
          <div className={styles.statLine}><p className={styles.statTitle}>Pays :</p><p className={styles.statValue}>{artist.country}</p></div>
        </div>
      </div>

      {[1, 2].map((index) => <div
        key={tabs[index].id}
        id={`artist-panel-${tabs[index].id}`}
        role="tabpanel"
        aria-labelledby={`artist-tab-${tabs[index].id}`}
        aria-hidden={activeTab !== index}
        className={`${panelClass(index)} ${styles.biographyPanel}`}
      >
        <div className={styles.backgroundImage} aria-hidden="true" />
        <h2 className={styles.panelTitle}>{tabs[index].label}</h2>
        <div className={styles.biography}>
          {artist[tabs[index].id].map((paragraph) => <p key={paragraph}>{formatBiographyText(paragraph)}</p>)}
        </div>
      </div>)}

      <div id="artist-panel-ecouter" role="tabpanel" aria-labelledby="artist-tab-ecouter" aria-hidden={activeTab !== 3} className={panelClass(3)}>
        <h2 className={styles.panelTitle}>Ecouter</h2>
        <div className={styles.links}>
          {artist.tracks.map((track) => <div className={styles.musicLine} key={track.title}>
              <div className={styles.headphones} aria-hidden="true" />
              <a href={track.url} className={styles.musicLink} target="_blank" rel="noopener noreferrer">
                <span className={styles.trackArtist}>{artist.name}</span><span className={styles.trackName}>{track.title}</span>
                <em>{track.album} · {track.year}</em><span className={styles.trackSource}>{track.sourceLabel ?? "Vidéo officielle sur YouTube ↗"}</span>
              </a>
            </div>)}
        </div>
      </div>

      <div className={styles.controls} aria-label="Navigation entre les rubriques">
        <button type="button" className={styles.previous} onClick={() => selectTab((activeTab - 1 + tabs.length) % tabs.length)} aria-label="Onglet précédent"><span className={styles.arrowLabel}>Précédent</span><span className={styles.arrowIcon} aria-hidden="true" /></button>
        <div className={styles.dots} role="group" aria-label="Choisir une rubrique">
          {tabs.map((tab, index) => <button key={tab.id} type="button" className={`${styles.dot} ${index === activeTab ? styles.currentDot : ""}`} onClick={() => selectTab(index)} aria-label={`${tab.label} (${index + 1} sur ${tabs.length})`} aria-current={index === activeTab ? "true" : undefined} />)}
        </div>
        <button type="button" className={styles.next} onClick={() => selectTab((activeTab + 1) % tabs.length)} aria-label="Onglet suivant">
          <span className={styles.arrowIcon} aria-hidden="true" /><span className={styles.arrowLabel}>Suivant</span>
        </button>
      </div>

      <Link className={styles.returnLink} href={`/artistes?returnArtist=${artistSlug(artist.name)}`} scroll={false}>Retour au Menu Artistes</Link>
    </div>
  </section>;
}
