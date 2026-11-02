"use client";

import { useEffect } from "react";

const LEADING_PUNCTUATION = /([\p{Ps}\p{Pi}\p{Pd}\p{S}"'`])([\t ]+)/gu;
const TRAILING_PUNCTUATION = /([\t ]+)([\p{Pe}\p{Pf}\p{Po}\p{S}"'`])/gu;
const NON_BREAKING_SPACE = "\u00a0";
const EXCLUDED_TEXT = "script, style, noscript, textarea, pre, code, [contenteditable='true']";

function normalizeTextNode(node) {
  if (!node?.nodeValue || node.parentElement?.closest(EXCLUDED_TEXT)) return;

  const normalized = node.nodeValue
    .replace(LEADING_PUNCTUATION, `$1${NON_BREAKING_SPACE}`)
    .replace(TRAILING_PUNCTUATION, `${NON_BREAKING_SPACE}$2`);

  if (normalized !== node.nodeValue) node.nodeValue = normalized;
}

function normalizeSubtree(root) {
  if (root.nodeType === Node.TEXT_NODE) {
    normalizeTextNode(root);
    return;
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) normalizeTextNode(walker.currentNode);
}

export default function TypographicLineBreaks() {
  useEffect(() => {
    normalizeSubtree(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          normalizeTextNode(mutation.target);
          continue;
        }

        for (const node of mutation.addedNodes) normalizeSubtree(node);
      }
    });

    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
