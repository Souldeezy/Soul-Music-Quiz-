# Intégration Detroit Soul

## Route et périmètre
- Route : `/quiz/detroit-soul` (route statique explicite).
- Ajouts uniquement : aucun fichier existant modifié pendant cette mission.
- Les modifications déjà présentes à l'arrivée dans California et Chicago ont été conservées.
- Retour arrière possible en retirant uniquement les huit fichiers ci-dessous ; la route dynamique existante retrouverait alors son placeholder Detroit.

## Fichiers créés
1. `app/quiz/detroit-soul/page.jsx` : route, métadonnées Detroit, préchargement du hero, Header/CTA/Footer existants.
2. `components/quiz/DetroitSoulPage.jsx` : structure et interactions du California actuel, avec identité et banque Detroit ; scores isolés.
3. `components/quiz/DetroitSoulBanner.jsx` : scène de rue et MPC propres à Detroit ; observers, audio et timers nettoyés au démontage.
4. `styles/quiz/DetroitSoulPage.module.css` : uniquement les deux images de fond hero/CTA.
5. `styles/quiz/DetroitSoulBanner.module.css` : CSS vanilla des bannières, isolé par CSS Modules et chemins internes.
6. `data/quizzes/detroit-soul.js` : 50 questions, réponses et explications importées à l'identique, dix par difficulté.
7. `scripts/quiz/audit-detroit.cjs` : tests navigateur de production reproductibles.
8. `docs/detroit-soul-integration.md` : ce compte rendu.

## Réutilisation du template
La page reprend le JSX actuel de California, son moteur pur `scripts/quiz/californiaSoulQuiz.js` et son CSS `styles/quiz/CaliforniaSoulPage.module.css`, sans les modifier. Les dimensions et tous les breakpoints viennent donc directement du template, sans une deuxième série de règles responsive divergentes.
Le Header, le Footer, la CTA, les styles du logo/faire défiler et les bannières de remplacement sont réutilisés.
Les seules références California conservées sont ces imports/classes structurels et le lien du menu vers California. Le lien Chicago reste naturellement dans le même menu.
Aucun contenu de leurs bannières n'est rendu dans Detroit.

Le texte du hero, y compris ses guillemets, les deux images de fond, la scène de rue, les textes MPC et toutes les données de questions viennent du Detroit vanilla.
Aucune image associée à une question n'existe dans sa banque source.
Les messages de fin vanilla sont identiques à ceux du moteur commun.

Scores : `smq:detroit-soul:lastScore` et `smq:detroit-soul:bestScore` dans sessionStorage ; aucune écriture dans les clés California/Chicago.

## Bannières
Même sélection exacte que California : largeur 1440 px, ou de 1500 à 1536 px inclus. Les autres largeurs utilisent le composant et les styles de remplacement existants (y compris 1920/2580).
La scène de rue conserve les 78 briques, huit fenêtres, douze hot-dogs, personnages et graffiti progressif.
La MPC conserve les 16 WAV, les positions des pads, leur séquence d'allumage et la correspondance clavier W/X/C/V, Q/S/D/F, A/Z/E/R, T/Y/U/I.
Les sons ne sont instanciés qu'à la première interaction, et la MPC ne monte pas aux largeurs de remplacement.
Les pads sont de vrais boutons accessibles au clavier, sans changer leur géométrie.
Les titres, icônes et animations se redéclenchent au retour dans le viewport, comme dans la source.

### Limite héritée de la source
La fonction d'enregistrement audio/export de beat n'était pas implémentée dans le vanilla (TODO). Le bouton rond conserve son mode visuel, son décompte de trois secondes et son clignotement ; aucun enregistreur fictif n'a été ajouté.
Le bloc CSS Jay Dee, absent du HTML vanilla, et une configuration sonore inutilisée en fin de script n'ont pas été importés.
Le chemin source obsolète `PICTURES/Logo SMQ.webp` est résolu vers le logo réel `PICTURES/Logo-smq.webp`, identique au logo partagé.

## Vérifications effectuées
- `npm run build` : succès, route Detroit prérendue.
- ESLint ciblé sur tous les nouveaux fichiers JS/JSX : succès.
- Banque de données : égalité JSON exacte avec le vanilla, 50 questions.
- Ressources ci-dessous : toutes présentes ; SHA-256 identique à leur original.
- 320×600, 375×600, 768×600, 1024×768, 1280×800, 1366×768, 1440×900, 1536×864, 1920×1080, 2580×1440 : dimensions hero/titre/quiz/onglets/CTA/bannières identiques à California, absence de débordement horizontal, sélection orangered et fenêtres de confirmation.
- Contrôle des limites de bannières : 1439, 1440, 1441, 1499, 1500, 1536 et 1537 px.
- Dix parties complètes : cinq difficultés sur mobile375 et desktop1440, résultat attendu 9/10, chaque explication vérifiée, recommencement, retour et isolation des scores.
- MPC : 16 pads au clic et 16 raccourcis clavier, mapping exact, HTTP200 pour les 16 WAV, décompte et arrêt du mode visuel.
- Contrôle complémentaire : lecture/décodage réel d'un WAV, clavier inactif une fois la MPC hors viewport, fermeture du menu par son bouton et clic extérieur ; captures des heros mobile/desktop après animation.
- Captures vérifiées : bannières rue/MPC, page mobile ; artefacts sous `.next/detroit-audit/`.
- Aucune erreur applicative dans les tests. Le kit Font Awesome existant était bloqué par le réseau du sandbox ; un contrôle navigateur hors sandbox a chargé les trois icônes sans erreur (capture `banner-street-icons.png`).
- Tous les fichiers suivis par Git existaient déjà avant la mission : empreinte agrégée inchangée `8cccc8765fa83a56d96b452d0d878f57aade80e81d8a19cd0027a3a294606795`.
- Aucun score Lighthouse n'est annoncé : cette mission n'a pas exécuté Lighthouse.

## Relancer l'audit
Démarrer le build de production sur le port3100 (`PORT=3100` dans l'environnement, puis `npm run start`).
Définir `SMQ_PLAYWRIGHT` vers un module Playwright installé, puis lancer `node scripts/quiz/audit-detroit.cjs`.
`SMQ_AUDIT_URL` permet un autre port ; `SMQ_AUDIT_PHASE=games` limite aux parties/limites de bannières.

## Ressources réutilisées — aucune copie, aucun remplacement
Les 32 ressources nécessaires existaient déjà dans public. Correspondance vérifiée ci-dessous (lecture vanilla uniquement pour les ressources Detroit).

| Source vanilla | Ressource public SMQ |
|---|---|
| `SVG/window.svg` | `svg/quiz/detroit/banner-top-detroit-street/detroit-street-window.svg` |
| `SVG/wallsbricks.svg` | `svg/quiz/detroit/banner-top-detroit-street/detroit-street-wall-bricks.svg` |
| `SVG/walkingAfroMan.webp` | `svg/quiz/detroit/banner-top-detroit-street/detroit-street-walking-afro-man.webp` |
| `SVG/trashbin.svg` | `svg/quiz/detroit/banner-top-detroit-street/detroit-street-trashbin.svg` |
| `SVG/walkingAfroWoman.webp` | `svg/quiz/detroit/banner-top-detroit-street/detroit-street-standing-afro-woman.webp` |
| `SVG/manwalkindrinkin.png` | `svg/quiz/detroit/banner-top-detroit-street/detroit-street-man-walkin-drinkin.png` |
| `SVG/ladder.svg` | `svg/quiz/detroit/banner-top-detroit-street/detroit-street-ladder.svg` |
| `SVG/kidsrunning.png` | `svg/quiz/detroit/banner-top-detroit-street/detroit-street-kids-running.png` |
| `SVG/coneydog.png` | `svg/quiz/detroit/banner-top-detroit-street/detroit-street-hot-dog.png` |
| `SVG/coneystore.svg` | `svg/quiz/detroit/banner-top-detroit-street/detroit-street-food-store.svg` |
| `SVG/cookingMama2.PNG` | `svg/quiz/detroit/banner-top-detroit-street/detroit-street-food-store-seller.png` |
| `SVG/boygraffing.png` | `svg/quiz/detroit/banner-top-detroit-street/detroit-street-boy-painting.png` |
| `SVG/MPC.png` | `svg/quiz/detroit/banner-bottom-mpc/mpc-machine.png` |
| `PICTURES/Logo-smq.webp` | `images/shared/logo-smq.webp` |
| `PICTURES/theD.webp` | `images/quiz/detroit/cta-detroit.webp` |
| `PICTURES/theD2.webp` | `images/quiz/detroit/hero-detroit.webp` |
| `SOUNDS/sound1.wav` | `sounds/quiz/detroit/banner-bottom-mpc/sound01.wav` |
| `SOUNDS/sound2.wav` | `sounds/quiz/detroit/banner-bottom-mpc/sound02.wav` |
| `SOUNDS/sound3.wav` | `sounds/quiz/detroit/banner-bottom-mpc/sound03.wav` |
| `SOUNDS/sound4.wav` | `sounds/quiz/detroit/banner-bottom-mpc/sound04.wav` |
| `SOUNDS/sound5.wav` | `sounds/quiz/detroit/banner-bottom-mpc/sound05.wav` |
| `SOUNDS/sound6.wav` | `sounds/quiz/detroit/banner-bottom-mpc/sound06.wav` |
| `SOUNDS/sound7.wav` | `sounds/quiz/detroit/banner-bottom-mpc/sound07.wav` |
| `SOUNDS/sound8.wav` | `sounds/quiz/detroit/banner-bottom-mpc/sound08.wav` |
| `SOUNDS/sound9.wav` | `sounds/quiz/detroit/banner-bottom-mpc/sound09.wav` |
| `SOUNDS/sound10.wav` | `sounds/quiz/detroit/banner-bottom-mpc/sound10.wav` |
| `SOUNDS/sound11.wav` | `sounds/quiz/detroit/banner-bottom-mpc/sound11.wav` |
| `SOUNDS/sound12.wav` | `sounds/quiz/detroit/banner-bottom-mpc/sound12.wav` |
| `SOUNDS/sound13.wav` | `sounds/quiz/detroit/banner-bottom-mpc/sound13.wav` |
| `SOUNDS/sound14.wav` | `sounds/quiz/detroit/banner-bottom-mpc/sound14.wav` |
| `SOUNDS/sound15.wav` | `sounds/quiz/detroit/banner-bottom-mpc/sound15.wav` |
| `SOUNDS/sound16.wav` | `sounds/quiz/detroit/banner-bottom-mpc/sound16.wav` |
