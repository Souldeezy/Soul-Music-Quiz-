"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { temporarySearchItems } from "../../data/search/temporarySearchItems";

function HighlightedTitle({ title, search }) {
  const start = title.toLocaleLowerCase("fr").indexOf(search.toLocaleLowerCase("fr"));

  if (start < 0) return title;

  return <>
    {title.slice(0, start)}
    <mark>{title.slice(start, start + search.length)}</mark>
    {title.slice(start + search.length)}
  </>;
}

export default function HeaderSearch({ mobile = false, onNavigate }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const resultsId = useId();
  const search = query.trim();
  const results = search
    ? temporarySearchItems.filter((item) => [item.title, ...(item.aliases ?? [])].some((term) => term.toLocaleLowerCase("fr").includes(search.toLocaleLowerCase("fr")))).slice(0, 5)
    : [];
  const showResults = isOpen && results.length > 0;

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [isOpen]);

  return (
    <div
      ref={rootRef}
      className={`header-search ${mobile ? "header-search-mobile" : "header-search-desktop"}`}
      role="search"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <label htmlFor={resultsId} className="sr-only">Rechercher un artiste ou un article</label>
      <div className="header-search-field">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 5 5" />
        </svg>
        <input
          ref={inputRef}
          id={resultsId}
          type="search"
          value={query}
          placeholder="Rechercher"
          autoComplete="off"
          aria-controls={showResults ? `${resultsId}-results` : undefined}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsOpen(false);
              event.stopPropagation();
            }
            if (event.key === "ArrowDown" && showResults) {
              event.preventDefault();
              rootRef.current?.querySelector(".header-search-result")?.focus();
            }
          }}
        />
        {query && (
          <button
            type="button"
            className="header-search-clear"
            aria-label="Effacer la recherche"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
          >
            ×
          </button>
        )}
      </div>
      {showResults && (
        <div id={`${resultsId}-results`} className="header-search-results" aria-label="Suggestions de recherche">
          {results.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="header-search-result"
              onClick={() => {
                setIsOpen(false);
                onNavigate?.();
              }}
            >
              <span className="header-search-result-title"><HighlightedTitle title={item.title} search={search} /></span>
              <span className="header-search-result-type">{item.section}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
