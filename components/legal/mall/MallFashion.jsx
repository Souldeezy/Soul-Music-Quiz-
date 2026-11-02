"use client";

import { useRef, useState } from "react";

const FASHION_ITEMS_PER_PAGE = 3;
const FASHION_SWIPE_THRESHOLD = 80;

const FASHION_ITEMS = [
  {
    id: 1,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/fashion/aretha-franklin-queen-of-soul-tshirt.webp",
    artist: "T-SHIRT Aretha Franklin",
    track:
      "T-shirt officiel en coton premium.\nHommage à la Reine de la Soul.",
    link:
      "https://shop.arethafranklin.net/collections/t-shirts",
  },
  {
    id: 2,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/fashion/marvin-gaye-classic-tshirt.jpg",
    artist: "T-SHIRT Marvin Gaye",
    track:
      "T-shirt officiel en coton premium.\nIllustration vintage de Marvin Gaye.",
    link:
      "https://www.redbubble.com/i/t-shirt/Marvin-Gaye-by-ourkid/157911830.QUQES",
  },
  {
    id: 3,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/fashion/otis-redding-king-of-soul-tshirt.jpg",
    artist: "T-SHIRT Otis Redding",
    track:
      "T-shirt officiel en coton premium.\nPortrait vintage du King of Soul.",
    link:
      "https://www.redbubble.com/i/t-shirt/Otis-Redding-The-King-Of-Soul-Vintage-by-GerardLabbe/121371193.FB110",
  },
  {
    id: 4,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/fashion/james-brown-cap.webp",
    artist: "CASQUETTE James Brown",
    track:
      "Modèle trucker ou baseball réglable.\nVisuel Soul Brother No. 1 imprimé à l’avant.",
    link:
      "https://www.teepublic.com/hat/88061184-soul-brother-no-1-james-brown",
  },
  {
    id: 5,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/fashion/marvin-gaye-cap.webp",
    artist: "CASQUETTE Marvin Gaye",
    track:
      "Visière incurvée en coton premium.\nRéglable pour un maintien confortable.",
    link:
      "https://www.teepublic.com/hat/36413185-marvin-gaye",
  },
  {
    id: 6,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/fashion/aretha-franklin-cap.webp",
    artist: "CASQUETTE Aretha Franklin",
    track:
      "Visière incurvée en coton premium.\nHommage à la Reine de la Soul.",
    link:
      "https://www.teepublic.com/hat/67848354-aretha-franklin",
  },
  {
    id: 7,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/fashion/sam-cooke-mug.webp",
    artist: "MUG Sam Cooke",
    track:
      "Mug en céramique haute qualité.\nVisuel vintage de Sam Cooke.",
    link:
      "https://www.teepublic.com/mug/24835166-sam-cooke",
  },
  {
    id: 8,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/fashion/bill-withers-mug.webp",
    artist: "MUG Bill Withers",
    track:
      "Mug en céramique de 350 ml.\nCompatible micro-ondes et lave-vaisselle.",
    link:
      "https://www.redbubble.com/i/mug/Bill-Withers-70s-Funky-Soul-by-eyepoo/130332996/7yqg",
  },
  {
    id: 9,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/fashion/earth-wind-fire-mug.webp",
    artist: "MUG Earth, Wind & Fire",
    track:
      "Mug en céramique premium.\nCompatible micro-ondes et lave-vaisselle.",
    link:
      "https://www.teepublic.com/mug/63784494",
  },
  {
    id: 10,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/fashion/otis-redding-tote-bag.webp",
    artist: "SAC Otis Redding",
    track:
      "Sac en toile 100 % coton.\nImpression vintage résistante.",
    link:
      "https://www.redbubble.com/i/tote-bag/Otis-Redding-by-RickyTromps/173481073/xd4m",
  },
  {
    id: 11,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/fashion/rare-soul-vinyl-tote-bag.jpg",
    artist: "SAC Rare Soul Music",
    track:
      "Sac robuste avec impression double face.\nDesign vinyle 45 tours pour collectionneurs.",
    link:
      "https://www.redbubble.com/i/tote-bag/Rare-Soul-Music-7-Inch-45-RPM-Vinyl-Label-by-SoulVisible/44186075/xd4m",
  },
  {
    id: 12,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/fashion/curtis-mayfield-poster.webp",
    artist: "POSTER Curtis Mayfield",
    track:
      "Poster haute qualité semi-brillant.\nIllustration vintage de Curtis Mayfield.",
    link:
      "https://www.redbubble.com/i/poster/Curtis-Mayfield-Move-On-Up-by-eyepoo/52321997.LVTDI",
  },
  {
    id: 13,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/fashion/bobby-womack-poster.webp",
    artist: "POSTER Bobby Womack",
    track:
      "Poster premium semi-brillant.\nIllustration vintage de Bobby Womack.",
    link:
      "https://www.teepublic.com/poster-and-art/26144206-bobby-womack",
  },
  {
    id: 14,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/fashion/soul-funk-sticker.webp",
    artist: "STICKER Curtis Mayfield",
    track:
      "Sticker vinyle haute résistance.\nFinition mate imperméable.",
    link:
      "https://www.redbubble.com/i/sticker/Funk-Disco-and-Soul-by-modernistdesign/38824360/7sgk",
  },
  {
    id: 15,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/fashion/motown-baseball-cap.webp",
    artist: "CASQUETTE Motown Records",
    track:
      "Casquette noire brodée premium.\nVisière incurvée et fermeture réglable.",
    link:
      "https://www.redbubble.com/i/hat/The-Fire-by-Ogzyananci/107653951/4sgw",
  },
];

const FASHION_PAGE_COUNT = Math.ceil(
  FASHION_ITEMS.length / FASHION_ITEMS_PER_PAGE,
);

const FASHION_PAGES = Array.from(
  { length: FASHION_PAGE_COUNT },
  (_, index) => index,
);

export default function MallFashion() {
  const [currentPage, setCurrentPage] = useState(0);
  const startX = useRef(null);
  const suppressSwipeClick = useRef(false);

  const showPreviousPage = () => {
    setCurrentPage(
      (page) =>
        (page - 1 + FASHION_PAGE_COUNT) % FASHION_PAGE_COUNT,
    );
  };

  const showNextPage = () => {
    setCurrentPage(
      (page) => (page + 1) % FASHION_PAGE_COUNT,
    );
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

    if (delta > FASHION_SWIPE_THRESHOLD) {
      suppressSwipeClick.current = true;
      showPreviousPage();
    }

    if (delta < -FASHION_SWIPE_THRESHOLD) {
      suppressSwipeClick.current = true;
      showNextPage();
    }
  };

  const firstFashionIndex =
    currentPage * FASHION_ITEMS_PER_PAGE;

  const currentFashion = FASHION_ITEMS.slice(
    firstFashionIndex,
    firstFashionIndex + FASHION_ITEMS_PER_PAGE,
  );

  return (
    <div id="seq3-fashion" className="seq3-content">
      {/* CAROUSEL................................................................................................... */}

      <div className="fashion-carousel-container">
        <button
          type="button"
          className="fashion-btn-prev"
          onClick={showPreviousPage}
        >
          ‹
          <span className="fashion-arrow-label">
            Précédent
          </span>
        </button>

        <div
          className="fashion-carousel"
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
          {currentFashion.map((fashionItem) => (
            <div
              className="mall-card"
              key={fashionItem.id}
            >
              <div className="mall-card-cover">
                <img
                  src={fashionItem.image}
                  loading="lazy"
                  alt={fashionItem.artist}
                />
              </div>

              <div className="mall-card-overlay">
                <h3 className="mall-card-title">
                  {fashionItem.artist}
                </h3>

                <p className="mall-card-subtitle">
                  {fashionItem.track}
                </p>

                <a
                  href={fashionItem.link}
                  className="mall-card-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Voir l’item
                </a>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="fashion-btn-next"
          onClick={showNextPage}
        >
          ›
          <span className="fashion-arrow-label">
            Suivant
          </span>
        </button>
      </div>

      {/* PAGINATION................................................................................................. */}

      <div className="fashion-dots">
        {FASHION_PAGES.map((page) => (
          <button
            type="button"
            key={page}
            className={`fashion-dot ${
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
