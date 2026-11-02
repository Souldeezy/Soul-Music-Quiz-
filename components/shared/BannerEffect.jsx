"use client";

import { useEffect, useState } from "react";

const BANNER_SELECTOR =
  ".section-banner.banner-categories, .section-banner.banner-legal";

const BANNER_ANIMATION_THRESHOLD = 0.45;
const LARGE_BANNER_QUERY = "(width: 1440px)";

export default function BannerEffect() {
  const [isLargeViewport, setIsLargeViewport] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(LARGE_BANNER_QUERY);
    const updateViewport = () => setIsLargeViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  if (!isLargeViewport) return null;

  return <ActiveBannerEffect />;
}

function ActiveBannerEffect() {
  useEffect(() => {
    const banners = document.querySelectorAll(BANNER_SELECTOR);

    const bannerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const title = entry.target.querySelector("h2");
          const bar = entry.target.querySelector(".banner-bar");
          const action = entry.isIntersecting ? "add" : "remove";

          title?.classList[action]("play");
          bar?.classList[action]("play");
        });
      },
      { threshold: BANNER_ANIMATION_THRESHOLD },
    );

    banners.forEach((banner) => {
      bannerObserver.observe(banner);
    });

    return () => {
      bannerObserver.disconnect();
    };
  }, []);

  return null;
}
