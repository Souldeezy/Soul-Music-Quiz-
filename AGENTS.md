<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Artist-catalogue workflow (SMQ)

When adding an artist profile, follow this checklist and keep the existing page design unchanged:

1. Take the exact display name and position from `components/artistes/artistsData.js`; classify the act as a solo artist or group using reliable sources. The catalogue has 298 entries, so work only on the artist requested and do not reorder or bulk-edit the index.
2. Research biographical and career facts before writing. Prefer reliable contemporary/primary sources and established music references. Do not invent member names, dates, credits, discographies, or claim a YouTube video is official unless verified. If a detail cannot be established, omit it or state the uncertainty. For every YouTube link, verify the page resolves and inspect its YouTube metadata/title (for example, the oEmbed endpoint) to confirm both the artist and the specific track match the displayed entry. A URL copied from a search result, playlist, collector post, or similar track is not sufficient on its own. Never fabricate links; when a match cannot be verified, leave that track out.
3. Add the content under the exact `artistSlug(name)` key in `components/artistes/artistProfiles.js`. Populate all four existing sections: `parcours` (tab 2), `carriere` (tab 3), and `tracks` (tab 4), plus the info fields (tab 1). Preserve the common Aretha-based template and its visuals; do not create a separate template or per-artist medallion image. The artists carousel uses the shared SMQ logo.
4. For solo artists, use their documented birth date and birthplace. For groups, repurpose the birth-date row with `birthDateLabel: "Label :"` and put the documented record label or labels in `birthDate` (never a first-single or formation year); set `birthPlaceLabel` to `"Lieu d’origine :"` and provide a documented place of origin in `birthPlace` where available. Keep `country` accurate.
5. Add one matching artist entry to `data/search/temporarySearchItems.js` with the exact profile name and `/artistes/<slug>` URL. Add only useful, defensible `aliases` when needed so common search wording finds the canonical result; do not create duplicate result entries.
6. Validate each addition with `npm run validate:artists` and `npm run lint`. At a milestone or before committing, run `npm run build`. Confirm the profile route and header-search result resolve to the same artist. Keep user changes and unrelated files untouched.

For factual claims based on browsing, provide the user with concise source links in the completion message. Keep each profile readable and specific rather than padding it with uncertain details.
