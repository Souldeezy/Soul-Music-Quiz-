"use client";

import { useEffect } from "react";

export default function ReloadCurrentPageLink() {
  useEffect(() => {
    const reloadCurrentPage = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = event.target.closest("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const destination = new URL(link.href, window.location.href);
      const current = new URL(window.location.href);

      if (destination.origin !== current.origin || destination.hash || destination.pathname !== current.pathname || destination.search !== current.search) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.reload();
    };

    document.addEventListener("click", reloadCurrentPage, true);
    return () => document.removeEventListener("click", reloadCurrentPage, true);
  }, []);

  return null;
}
