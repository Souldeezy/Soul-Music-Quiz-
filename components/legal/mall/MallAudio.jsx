"use client";

import { useRef, useState } from "react";

const AUDIO_ITEMS_PER_PAGE = 3;
const AUDIO_SWIPE_THRESHOLD = 80;

const AUDIO_ITEMS = [
  {
    id: 1,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/audio-equipment/audio-technica-at-lp140xp-black.webp",
    artist: "Platine vinyle AUDIO-TECHNICA",
    track:
      "Entraînement direct, bras en S, 33/45/78 tours, qualité DJ professionnelle",
    link:
      "https://www.thomann.fr/audio_technica_at_lp140xp_black.htm",
  },
  {
    id: 2,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/audio-equipment/pro-ject-recordmaster-ii-black.jpg",
    artist: "Platine vinyle PRO-JECT",
    track:
      "Entraînement par courroie, USB, préampli phono, cellule Ortofon OM5e",
    link:
      "https://www.thomann.fr/pro_ject_debut_recordmaster_hgb.htm",
  },
  {
    id: 3,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/audio-equipment/dual-dtj-301-1-usb.webp",
    artist: "Platine vinyle DUAL",
    track:
      "Entraînement direct, USB, bras en S, cellule Audio-Technica",
    link:
      "https://www.thomann.fr/search_GF_turntables.html?price-first=200&price-last=300",
  },
  {
    id: 4,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/audio-equipment/focusrite-scarlett-2i2-4th-generation.webp",
    artist: "Interface audio FOCUSRITE",
    track:
      "2 entrées, USB-C, 24 bits / 192 kHz, préamplis Scarlett, home studio",
    link:
      "https://www.thomann.fr/focusrite_scarlett_2i2_4th_generation.htm",
  },
  {
    id: 5,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/audio-equipment/arturia-minifuse-2-black.webp",
    artist: "Interface audio ARTURIA",
    track:
      "2 entrées, USB-C, 24 bits / 192 kHz, monitoring direct, home studio",
    link:
      "https://www.thomann.fr/search_dir.html?sw=Arturia+MiniFuse+2",
  },
  {
    id: 6,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/audio-equipment/presonus-studio-24c.webp",
    artist: "Interface audio PRESONUS",
    track:
      "2 entrées, USB-C, 24 bits / 192 kHz, faible latence, home studio",
    link:
      "https://www.thomann.fr/search_dir.html?sw=PreSonus+Studio+24c",
  },
  {
    id: 7,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/audio-equipment/yamaha-hs5.webp",
    artist: "Moniteur studio YAMAHA",
    track:
      "5 pouces, réponse neutre, bi-amplifié, monitoring précis, home studio",
    link:
      "https://www.thomann.fr/search_dir.html?sw=Yamaha+HS5",
  },
  {
    id: 8,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/audio-equipment/krk-rokit-rp5-g5.webp",
    artist: "Moniteur studio KRK",
    track:
      "5 pouces, DSP intégré, graves puissants, monitoring précis, home studio",
    link:
      "https://www.thomann.fr/search_dir.html?sw=KRK+Rokit+RP5+G5",
  },
  {
    id: 9,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/audio-equipment/adam-audio-t5v.webp",
    artist: "Moniteur studio ADAM AUDIO",
    track:
      "Tweeter à ruban, 5 pouces, précision exceptionnelle, mixage, home studio",
    link:
      "https://www.thomann.fr/search_dir.html?sw=Adam+Audio+T5V",
  },
  {
    id: 10,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/audio-equipment/sennheiser-hd650.webp",
    artist: "Casque SENNHEISER",
    track:
      "Ouvert, audiophile, haute fidélité, confort longue durée, écoute précise",
    link:
      "https://www.thomann.fr/search_dir.html?sw=Sennheiser+HD650",
  },
  {
    id: 11,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/audio-equipment/beyerdynamic-dt-770-pro.webp",
    artist: "Casque BEYERDYNAMIC",
    track:
      "Fermé, studio, isolation, confort, monitoring professionnel",
    link:
      "https://www.thomann.fr/search_dir.html?sw=Beyerdynamic+DT+770+Pro",
  },
  {
    id: 12,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/audio-equipment/audio-technica-ath-m50x.webp",
    artist: "Casque AUDIO-TECHNICA",
    track:
      "Studio, fermé, haute précision, confort, référence home studio",
    link:
      "https://www.thomann.fr/search_dir.html?sw=Audio-Technica+ATH-M50X",
  },
  {
    id: 13,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/audio-equipment/shure-sm7b.webp",
    artist: "Microphone SHURE",
    track:
      "Dynamique, broadcast, podcast, studio, voix professionnelles, légendaire",
    link:
      "https://www.thomann.fr/search_dir.html?sw=Shure+SM7B",
  },
  {
    id: 14,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/audio-equipment/rode-nt1-signature.webp",
    artist: "Microphone RØDE",
    track:
      "Condensateur, studio, ultra silencieux, voix, instruments, haute définition",
    link:
      "https://www.thomann.fr/search_dir.html?sw=Rode+NT1+Signature",
  },
  {
    id: 15,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/audio-equipment/audio-technica-at2020.webp",
    artist: "Microphone AUDIO-TECHNICA",
    track:
      "Condensateur, studio, excellent rapport qualité-prix, voix, streaming, podcast",
    link:
      "https://www.thomann.fr/search_dir.html?sw=Audio-Technica+AT2020",
  },
];

const AUDIO_PAGE_COUNT = Math.ceil(
  AUDIO_ITEMS.length / AUDIO_ITEMS_PER_PAGE,
);

const AUDIO_PAGES = Array.from(
  { length: AUDIO_PAGE_COUNT },
  (_, index) => index,
);

export default function MallAudio() {
  const [currentPage, setCurrentPage] = useState(0);
  const startX = useRef(null);
  const suppressSwipeClick = useRef(false);

  const showPreviousPage = () => {
    setCurrentPage(
      (page) => (page - 1 + AUDIO_PAGE_COUNT) % AUDIO_PAGE_COUNT,
    );
  };

  const showNextPage = () => {
    setCurrentPage((page) => (page + 1) % AUDIO_PAGE_COUNT);
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    startX.current = { id: event.pointerId, x: event.clientX };
    suppressSwipeClick.current = false;
  };

  const handlePointerUp = (event) => {
    if (!startX.current || startX.current.id !== event.pointerId) return;
    const delta = event.clientX - startX.current.x;
    startX.current = null;

    if (delta > AUDIO_SWIPE_THRESHOLD) {
      suppressSwipeClick.current = true;
      showPreviousPage();
    }

    if (delta < -AUDIO_SWIPE_THRESHOLD) {
      suppressSwipeClick.current = true;
      showNextPage();
    }
  };

  const firstAudioIndex = currentPage * AUDIO_ITEMS_PER_PAGE;

  const currentAudio = AUDIO_ITEMS.slice(
    firstAudioIndex,
    firstAudioIndex + AUDIO_ITEMS_PER_PAGE,
  );

  return (
    <div id="seq3-audio" className="seq3-content">
      {/* CAROUSEL................................................................................................... */}

      <div className="audio-carousel-container">
        <button
          type="button"
          className="audio-btn-prev"
          onClick={showPreviousPage}
        >
          ‹
          <span className="audio-arrow-label">
            Précédent
          </span>
        </button>

        <div
          className="audio-carousel"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { startX.current = null; }}
          onClickCapture={(event) => {
            if (!suppressSwipeClick.current || event.detail === 0) return;
            event.preventDefault();
            event.stopPropagation();
            suppressSwipeClick.current = false;
          }}
        >
          {currentAudio.map((audioItem) => (
            <div className="mall-card" key={audioItem.id}>
              <div className="mall-card-cover">
                <img
                  src={audioItem.image}
                  alt={audioItem.artist}
                />
              </div>

              <div className="mall-card-overlay">
                <h3 className="mall-card-title">
                  {audioItem.artist}
                </h3>

                <p className="mall-card-subtitle">
                  {audioItem.track}
                </p>

                <a
                  href={audioItem.link}
                  className="mall-card-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Voir le disque
                </a>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="audio-btn-next"
          onClick={showNextPage}
        >
          ›
          <span className="audio-arrow-label">
            Suivant
          </span>
        </button>
      </div>

      {/* PAGINATION................................................................................................. */}

      <div className="audio-dots">
        {AUDIO_PAGES.map((page) => (
          <button
            type="button"
            key={page}
            className={`audio-dot ${
              currentPage === page ? "active" : ""
            }`}
            onClick={() => setCurrentPage(page)}
            aria-label={`Afficher la page ${page + 1}`}
            aria-current={currentPage === page ? "true" : undefined}
          ></button>
        ))}
      </div>
    </div>
  );
}
