"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { BANNER_FALLBACK_MESSAGE, BANNER_VIEWPORT_QUERY } from "../shared/bannerFallbackMessage";
import styles from "../../styles/quiz/DetroitSoulBanner.module.css";
import quizStyles from "../../styles/quiz/QuizPage.module.css";

const cx = (...names) => names.map((name) => styles[name]).filter(Boolean).join(" ");
const KEYS = ["w", "x", "c", "v", "q", "s", "d", "f", "a", "z", "e", "r", "t", "y", "u", "i"];
const STREET = ["coney-store-1", "graf-line-1", "coney-man-1", "coney-waiter", "coney-woman-1", "coney-woman-2", "coney-boy-painting", "coney-kids-running", "coney-drinking-man", "coney-ladder-1", "coney-ladder-2", "coney-ladder-3", "coney-trash", "table-coney"];
function subscribeViewport(callback) {
  const query = window.matchMedia(BANNER_VIEWPORT_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getViewport = () => window.matchMedia(BANNER_VIEWPORT_QUERY).matches;
const getServerViewport = () => false;

function DesktopBanner({ bottom }) {
  const ref = useRef(null);
  useEffect(() => {
    const banner = ref.current;
    const title = banner.querySelector("h2");
    const icons = banner.querySelector(`.${styles["banner-bar"]}`);
    const letters = [...banner.querySelectorAll(`.${styles["effet-graf-1"]} span`)];
    const pads = [...banner.querySelectorAll("[data-sound]")];
    const record = banner.querySelector("[data-record]");
    const audio = new Map();
    const timers = new Set();
    let ready = false, recording = false, countdown = null;
    const later = (fn, ms) => {
      const id = window.setTimeout(() => { timers.delete(id); fn(); }, ms);
      timers.add(id);
      return id;
    };
    const resetRecording = () => {
      recording = false;
      window.clearTimeout(countdown);
      timers.delete(countdown);
      record?.classList.remove(styles["is-recording"], styles["is-flashing"]);
      record?.setAttribute("aria-pressed", "false");
    };
    const play = (sound) => {
      if (!ready) return;
      const pad = pads.find((item) => Number(item.dataset.sound) === sound);
      if (!pad) return;
      if (!audio.has(sound)) audio.set(sound, new Audio(`/sounds/quiz/detroit/banner-bottom-mpc/sound${String(sound).padStart(2, "0")}.wav`));
      const sample = audio.get(sound);
      sample.currentTime = 0;
      void sample.play().catch(() => {});
      pad.classList.add(styles["pad-active"]);
      later(() => pad.classList.remove(styles["pad-active"]), 100);
    };
    const click = (event) => {
      const pad = event.target.closest("[data-sound]");
      if (pad) { play(Number(pad.dataset.sound)); return; }
      if (!event.target.closest("[data-record]")) return;
      if (recording) { resetRecording(); ready = true; return; }
      if (!ready) return;
      // Vanilla provides a visual record/countdown mode, not audio recording/export.
      recording = true;
      ready = false;
      record.classList.add(styles["is-recording"]);
      record.setAttribute("aria-pressed", "true");
      countdown = later(() => { ready = true; record.classList.add(styles["is-flashing"]); }, 3000);
    };
    const keydown = (event) => {
      if (event.ctrlKey || event.altKey || event.metaKey || event.target.closest("input, textarea, select, [contenteditable=true]")) return;
      const index = KEYS.indexOf(event.key.toLowerCase());
      if (index >= 0 && ready) { event.preventDefault(); play(index + 1); }
    };
    const bootFinished = (event) => {
      if (event.target.classList.contains(styles["light-1"]) && banner.classList.contains(styles["is-booting"])) ready = true;
    };
    const titleObserver = new IntersectionObserver(([entry]) => {
      title.classList.toggle(styles.play, entry.isIntersecting);
      icons.classList.toggle(styles.play, entry.isIntersecting);
    }, { threshold: 0.45 });
    titleObserver.observe(banner);
    const sceneObserver = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting;
      if (bottom) {
        banner.classList.toggle(styles["is-booting"], visible);
        if (!visible) {
          ready = false;
          resetRecording();
          audio.forEach((sample) => { sample.pause(); sample.currentTime = 0; });
        }
      } else {
        let delay = 0;
        [4, 3, 2, 1, 8, 7, 6, 5, 12, 11, 10, 9].forEach((number) => {
          delay += 800 + Math.random() * 4200;
          banner.querySelector(`.${styles[`dog-${number}`]}`).style.transitionDelay = visible ? `${delay}ms` : "0ms";
        });
        banner.classList.toggle(styles["animation-active"], visible);
      }
    }, { threshold: 0.5 });
    sceneObserver.observe(banner);
    const graffitiObserver = new IntersectionObserver(([entry]) => {
      banner.classList.toggle(styles["is-visible"], entry.isIntersecting);
      if (entry.isIntersecting) letters.forEach((letter, index) => later(() => letter.classList.add(styles["is-visible"]), index * 8000 / letters.length));
      else {
        timers.forEach(window.clearTimeout);
        timers.clear();
        letters.forEach((letter) => letter.classList.remove(styles["is-visible"]));
      }
    }, { threshold: 0.4 });
    if (!bottom) graffitiObserver.observe(banner);
    banner.addEventListener("click", click);
    banner.addEventListener("animationend", bootFinished);
    if (bottom) window.addEventListener("keydown", keydown);
    return () => {
      titleObserver.disconnect(); sceneObserver.disconnect(); graffitiObserver.disconnect();
      timers.forEach(window.clearTimeout);
      audio.forEach((sample) => { sample.pause(); sample.removeAttribute("src"); sample.load(); });
      banner.removeEventListener("click", click);
      banner.removeEventListener("animationend", bootFinished);
      window.removeEventListener("keydown", keydown);
    };
  }, [bottom]);

  return <div ref={ref} className={cx("section-banner", "banner-legal")}>
    <h2>{bottom ? "SoulMusicQuiz" : "Detroit Soul"}</h2>
    {bottom ? <>
      <div className={styles["cont-legendes-mpc"]}>
        <p className={styles["legende-1"]}>Amusez-vous avec notre MPC interactive !</p>
        <p className={styles["legende-2"]}><strong>Allumez la MPC</strong> en appuyant sur le bouton rond <br /><strong>Interagissez avec les 16 pads</strong> du cote gauche votre clavier ( de W à V pour le pad 1 à 4, de Q à F pour les pads 5 à 8 etc ) et composez un beat !</p>
      </div>
      <div className={styles["effet-mpc"]} aria-hidden="true" />
      <button type="button" data-record className={styles["effet-mpc-smq"]} aria-label="Mode enregistrement MPC" aria-pressed="false" />
      {Array.from({ length: 16 }, (_, index) => {
        const light = index + 1;
        const sound = Math.floor(index / 4) * 4 + 4 - index % 4;
        return <button type="button" key={light} data-sound={sound} className={cx("effet-mpc-light", `light-${light}`)} aria-label={`Pad ${sound} — touche ${KEYS[sound - 1].toUpperCase()}`} />;
      })}
    </> : <>
      {Array.from({ length: 12 }, (_, index) => <div key={`dog-${index}`} className={cx("effet-coney-dog", `dog-${index + 1}`)} aria-hidden="true" />)}
      {Array.from({ length: 78 }, (_, index) => <div key={`brick-${index}`} className={styles[`effet-bricks-wall-${index + 1}`]} aria-hidden="true" />)}
      {Array.from({ length: 8 }, (_, index) => <div key={`window-${index}`} className={styles[`effet-windows-${index + 1}`]} aria-hidden="true" />)}
      <div className={styles["effet-graf-1"]} aria-hidden="true">{[..."SoulMusicQuiz"].map((letter, index) => <span key={index}>{letter}</span>)}</div>
      {STREET.map((name) => <div key={name} className={styles[`effet-${name}`]} aria-hidden="true" />)}
    </>}
    <div className={styles["banner-bar"]} aria-hidden="true"><i className="fa-solid fa-rss" /><i className="fa-solid fa-record-vinyl" /><i className="fa-solid fa-music" /></div>
  </div>;
}

export default function DetroitSoulBanner({ bottom = false }) {
  const enabled = useSyncExternalStore(subscribeViewport, getViewport, getServerViewport);
  return enabled ? <DesktopBanner bottom={bottom} /> : <div className={quizStyles.placeholder}><p>{BANNER_FALLBACK_MESSAGE}</p></div>;
}
