// Local adaptation of the vanilla New York restaurant script.
// Runs only while the New York desktop banner is mounted.
export function mountNewYorkFoodGame(foodBanner) {
  const timers = new Set();
  const frames = new Set();
  const listeners = [];
  const schedule = (callback, ms) => { const id = window.setTimeout(() => { timers.delete(id); callback(); }, ms); timers.add(id); return id; };
  const frame = (callback) => { const id = window.requestAnimationFrame(() => { frames.delete(id); callback(); }); frames.add(id); return id; };
  const listen = (target, event, handler) => { target.addEventListener(event, handler); listeners.push(() => target.removeEventListener(event, handler)); };
  const clearPendingWork = () => {
    timers.forEach(id => window.clearTimeout(id));
    timers.clear();
    frames.forEach(id => window.cancelAnimationFrame(id));
    frames.clear();
  };

const welcomeScreen      = foodBanner.querySelector("#" + 'welcome-screen');
    const welcomeText        = foodBanner.querySelector("#" + 'welcome-text');
    const enterButton        = foodBanner.querySelector("#" + 'enter-button');
    const welcomeLogo        = welcomeScreen.querySelector('.effet-logo-welcome');
    const actionMenu         = foodBanner.querySelector("#" + 'action-menu');
    const moneyLeftDisplay   = foodBanner.querySelector("#" + 'money-left');
    const tooltip            = foodBanner.querySelector("#" + 'food-tooltip');
    const rulesGame          = foodBanner.querySelector('.rules-game');
    const validerBtn         = foodBanner.querySelector("#" + 'valider-btn');
    const quitterBtn         = foodBanner.querySelector('.action-button:not(#valider-btn)');

    /* -------------------------------------------------- */
    /* ETAT DU JEU                                        */
    /* -------------------------------------------------- */
    const bagStatus     = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false };
    const purchaseCount = {};
    const kindCount     = {};
    let animationHasPlayed = false;
    let moneyLeft          = 50;
    let isGameActive       = false;
    let totalItems         = 0;

    /* -------------------------------------------------- */
    /* MESSAGES FINAUX PAR FOOD KIND                      */
    /* -------------------------------------------------- */
    const kindMessages = {
        'OG Soul Food': "Soul Food Connoisseur ! Real recognizes real things !",
        'Fast-Food':    "You're a real Fast-food lover, don't you ?",
        'Seafood':      "I know everything about Shrimp fishing...",
        'Sweet':        "Sweet tooth! Life's too short to skip dessert!",
        'Drink':        "Just came for a drink at Connie's !",
        'Drunk':        "Connie's beer hits different, watch out!"
    };

    /* -------------------------------------------------- */
    /* FOOD DATA                                          */
    /* -------------------------------------------------- */
    const foodData = {
        'fried-chicken':    { name: "Connie's Fried Chicken",     cat: "Plat",    kind: ["OG Soul Food", "Fast-Food"],  price: 5,  bags: [1, 2] },
        'shrimp-fritters':  { name: "Shrimp Fritters",   cat: "Side",    kind: ["Seafood", "Fast-Food"],       price: 6,  bags: [3, 4] },
        'shrimp-stew':      { name: "Shrimp Stew",       cat: "Plat",    kind: ["Seafood", "OG Soul Food"],    price: 8,  bags: [1, 2] },
        'shrimp':           { name: "Tiger Prawn",     cat: "Plat",    kind: ["Seafood", "OG Soul Food"],    price: 7,  bags: [1, 2] },
        'mac-cheese':       { name: "Connie's Mac N Cheese",     cat: "Side",    kind: ["OG Soul Food"],               price: 4,  bags: [3, 4] },
        'drink-soul':       { name: "Soda SOUL",         cat: "Boisson", kind: ["Drink", "Sweet"],             price: 2,  bags: [7, 8] },
        'drink-funk':       { name: "Juice FUNK",        cat: "Boisson", kind: ["Drink", "Sweet"],             price: 2,  bags: [7, 8] },
        'lemonade':         { name: "Connie's Lemonade", cat: "Boisson", kind: ["Drink", "Sweet"],             price: 3,  bags: [7, 8] },
        'beer':             { name: "Beer",         cat: "Boisson", kind: ["Drunk"],                      price: 4,  bags: [7, 8] },
        'oj':               { name: "Homemade Orange Juice",      cat: "Boisson", kind: ["Drink", "Sweet"],             price: 2,  bags: [7, 8] },
        'cranberries':      { name: "Homemade Cranberry Juice",   cat: "Boisson", kind: ["Drink", "Sweet"],             price: 2,  bags: [7, 8] },
        'milk-shake':       { name: "Milkshake",         cat: "Dessert", kind: ["Fast-Food", "Sweet"],         price: 5,  bags: [5, 6] },
        'banana-pudding':   { name: "Banana Pudding",    cat: "Dessert", kind: ["Sweet", "OG Soul Food"],      price: 4,  bags: [5, 6] },
        'pumpkin-pie':      { name: "Pumpkin Pie",       cat: "Dessert", kind: ["Sweet", "OG Soul Food"],      price: 5,  bags: [5, 6] },
        'sweet-potato-pie': { name: "Sweet Potato Pie",  cat: "Dessert", kind: ["Sweet", "OG Soul Food"],      price: 5,  bags: [5, 6] },
        'waffle':           { name: "Connie's Waffles",      cat: "Dessert", kind: ["Sweet", "OG Soul Food"],      price: 6,  bags: [5, 6] },
        'peach-cobbler':    { name: "Peach Cobbler",     cat: "Dessert", kind: ["Sweet", "OG Soul Food"],      price: 5,  bags: [5, 6] }
    };

    /* -------------------------------------------------- */
    /* SELECTIONS DOM                                     */
    /* -------------------------------------------------- */
    const allFoodItemsForCascade = foodBanner.querySelectorAll(
        '[class*="effet-fried-chicken"], [class*="effet-shrimp"], [class*="effet-mac-cheese"], [class*="effet-drink"], [class*="effet-lemonade"], [class*="effet-beer"], [class*="effet-oj"], [class*="effet-cranberries"], [class*="effet-milk-shake"], [class*="effet-banana-pudding"], [class*="effet-pumpkin-pie"], [class*="effet-sweet-potato-pie"], [class*="effet-waffle"], [class*="effet-peach-cobbler"], [class*="effet-package-bag"], [class*="effet-menu-bag"]'
    );

    const playableItems = foodBanner.querySelectorAll(
        '[class*="effet-fried-chicken"], [class*="effet-shrimp"], [class*="effet-mac-cheese"], [class*="effet-drink"], [class*="effet-lemonade"], [class*="effet-beer"], [class*="effet-oj"], [class*="effet-cranberries"], [class*="effet-milk-shake"], [class*="effet-banana-pudding"], [class*="effet-pumpkin-pie"], [class*="effet-sweet-potato-pie"], [class*="effet-waffle"], [class*="effet-peach-cobbler"]'
    );

    const decorElements = [
        foodBanner.querySelector('.effet-deck-self'),
        foodBanner.querySelector('.effet-vitrine-self-1'),
        foodBanner.querySelector('.effet-vitrine-self-2'),
        foodBanner.querySelector('.effet-vitrine-self-3'),
        foodBanner.querySelector('.effet-vitrine-self-4'),
        foodBanner.querySelector('.effet-vitrine-self-5')
    ];

    /* -------------------------------------------------- */
    /* ATTACHER FOOD DATA AUX ELEMENTS                    */
    /* -------------------------------------------------- */
    playableItems.forEach(item => {
        item.style.pointerEvents = 'none';

        const className = item.className;
        const foodKey   = Object.keys(foodData)
            .filter(key => className.includes(key))
            .sort((a, b) => b.length - a.length)[0];

        if (!foodKey) return;
        item._foodKey = foodKey;
        item._data    = foodData[foodKey];
    });

    /* -------------------------------------------------- */
    /* HELPER : ELEMENT SOUS LA SOURIS                    */
    /* -------------------------------------------------- */
    function getItemUnderMouse(e) {
        let found = null;

        playableItems.forEach(item => {
            if (item.style.opacity === '0') return;

            const rect     = item.getBoundingClientRect();
            const computed = window.getComputedStyle(item);
            const matrix   = new DOMMatrix(computed.transform);
            const scaleX   = Math.abs(matrix.a) || 1;
            const scaleY   = Math.abs(matrix.d) || 1;

            const cx = rect.left + rect.width  / 2;
            const cy = rect.top  + rect.height / 2;
            const hw = (rect.width  * scaleX) / 2;
            const hh = (rect.height * scaleY) / 2;

            if (
                e.clientX >= cx - hw &&
                e.clientX <= cx + hw &&
                e.clientY >= cy - hh &&
                e.clientY <= cy + hh
            ) {
                found = item;
            }
        });

        return found;
    }

    /* -------------------------------------------------- */
    /* HELPER : FOOD KIND MAJORITAIRE                     */
    /* -------------------------------------------------- */
    function getDominantKind() {
        let max     = 0;
        let winners = [];

        Object.keys(kindCount).forEach(kind => {
            if (kindCount[kind] > max) {
                max     = kindCount[kind];
                winners = [kind];
            } else if (kindCount[kind] === max) {
                winners.push(kind);
            }
        });

        return winners[Math.floor(Math.random() * winners.length)];
    }

    /* -------------------------------------------------- */
    /* SURVOL GLOBAL                                      */
    /* -------------------------------------------------- */
    listen(foodBanner, 'mousemove', (e) => {
        if (!isGameActive) return;

        const found = getItemUnderMouse(e);

        if (found && found._data) {
            const data = found._data;
            tooltip.innerHTML = `
                ${data.name}
                <small>${data.cat}</small>
                <span>Prix: ${data.price}$</span>
            `;
            tooltip.style.opacity   = 1;
            const bannerRect = foodBanner.getBoundingClientRect();
            const pointerX = e.clientX - bannerRect.left;
            const pointerY = e.clientY - bannerRect.top;
            const tooltipX = Math.min(pointerX + 15, bannerRect.width - tooltip.offsetWidth - 8);
            const tooltipY = pointerY + 15 + tooltip.offsetHeight <= bannerRect.height
                ? pointerY + 15
                : pointerY - tooltip.offsetHeight - 10;
            tooltip.style.left = Math.max(8, tooltipX) + 'px';
            tooltip.style.top = Math.max(8, Math.min(tooltipY, bannerRect.height - tooltip.offsetHeight - 8)) + 'px';
            foodBanner.style.cursor = 'pointer';

            playableItems.forEach(i => { i.style.filter = 'none'; });
            found.style.filter = 'brightness(1.5) drop-shadow(0 0 10px rgb(0, 249, 166))';

        } else {
            tooltip.style.opacity   = 0;
            foodBanner.style.cursor = 'default';
            playableItems.forEach(i => { i.style.filter = 'none'; });
        }
    });

    listen(foodBanner, 'mouseleave', () => {
        tooltip.style.opacity = 0;
        playableItems.forEach(i => { i.style.filter = 'none'; });
    });

    /* -------------------------------------------------- */
    /* CLIC GLOBAL                                        */
    /* -------------------------------------------------- */
    listen(foodBanner, 'click', (e) => {
        if (!isGameActive) return;

        const found = getItemUnderMouse(e);
        if (!found || !found._foodKey) return;

        const foodKey = found._foodKey;
        const data    = found._data;

        if (!purchaseCount[foodKey]) purchaseCount[foodKey] = 0;

        /* limite 2 par food type */
        const catCount = Object.keys(purchaseCount).reduce((total, key) => {
            if (foodData[key] && foodData[key].cat === data.cat) {
                total += purchaseCount[key];
            }
            return total;
        }, 0);

        if (catCount >= 2) {
            rulesGame.style.color         = 'orangered';
            rulesGame.style.textTransform = 'uppercase';
            rulesGame.style.fontWeight    = 'bold';
            rulesGame.style.animation     = 'ny-shake-error 0.5s ease-in-out';
            schedule(() => {
                rulesGame.style.color         = '';
                rulesGame.style.textTransform = '';
                rulesGame.style.fontWeight    = '';
                rulesGame.style.animation     = '';
            }, 2000);
            return;
        }

        /* limite 8 aliments total */
        if (totalItems >= 8) {
            rulesGame.style.color         = 'orangered';
            rulesGame.style.textTransform = 'uppercase';
            rulesGame.style.fontWeight    = 'bold';
            rulesGame.style.animation     = 'ny-shake-error 0.5s ease-in-out';
            schedule(() => {
                rulesGame.style.color         = '';
                rulesGame.style.textTransform = '';
                rulesGame.style.fontWeight    = '';
                rulesGame.style.animation     = '';
            }, 2000);
            return;
        }

        /* argent insuffisant */
        if (moneyLeft < data.price) {
            moneyLeftDisplay.style.animation  = 'ny-shake-error 0.5s ease-in-out';
            moneyLeftDisplay.style.color      = 'orangered';
            moneyLeftDisplay.style.textShadow = '0 0 10px orangered';
            schedule(() => {
                moneyLeftDisplay.style.animation  = 'ny-heartbeat 3s infinite';
                moneyLeftDisplay.style.color      = 'rgb(0, 249, 166)';
                moneyLeftDisplay.style.textShadow = '0 0 10px rgb(0, 249, 166)';
            }, 2000);
            return;
        }

        /* achat valide */
        purchaseCount[foodKey]++;
        totalItems++;
        moneyLeft -= data.price;
        moneyLeftDisplay.textContent = moneyLeft + '$';

        /* comptage food kind */
        data.kind.forEach(k => {
            kindCount[k] = (kindCount[k] || 0) + 1;
        });

        /* couleur rouge si argent épuisé */
        if (moneyLeft <= 0) {
            moneyLeftDisplay.style.color      = 'orangered';
            moneyLeftDisplay.style.textShadow = '0 0 10px orangered';
            moneyLeftDisplay.style.animation  = 'ny-shake-error 0.5s ease-in-out';
        }

        found.style.opacity       = '0';
        found.style.pointerEvents = 'none';
        found.style.filter        = 'none';

        const bagToLight = data.bags.find(num => !bagStatus[num]);
        if (bagToLight) {
            const bagEl = foodBanner.querySelector(`.effet-bag-paid-${bagToLight}`);
            if (bagEl) {
                bagEl.style.opacity   = 1;
                bagEl.style.animation = 'ny-heartbeat 0.5s ease-out';
                bagStatus[bagToLight] = true;
            }
        }

        tooltip.style.opacity = 0;
    });

    /* -------------------------------------------------- */
    /* VALIDATION PANIER                                  */
    /* -------------------------------------------------- */
    if (validerBtn) {
        listen(validerBtn, 'click', () => {
            if (!isGameActive) return;
            if (totalItems === 0) return;

            isGameActive = false;

            /* message final calculé avant animation */
            const dominantKind = getDominantKind();
            const finalMessage  = kindMessages[dominantKind] || "Thanks for dining at Connie's!";

            /* sacs visibles triés du plus à gauche au plus à droite */
            const activeBags = [];
            for (let i = 1; i <= 8; i++) {
                if (bagStatus[i]) {
                    const bagEl = foodBanner.querySelector(`.effet-bag-paid-${i}`);
                    if (bagEl) activeBags.push({ num: i, el: bagEl });
                }
            }

            /* déplacement des sacs vers la gauche hors bannière */
            activeBags.forEach((bag, index) => {
                schedule(() => {
                    bag.el.style.transition = 'left 1s linear';
                    bag.el.style.left       = '-25%';
                }, index * 300);
            });

            /* message final après que tous les sacs soient partis */
            const totalDelay = activeBags.length * 300 + 1200;

schedule(() => {
                const msgEl       = document.createElement('div');
                msgEl.id          = 'final-message';
                msgEl.textContent = finalMessage;
                msgEl.style.cssText = `
                    position: absolute;
                    left: 1%;
                    top: 50%;
                    transform: translateY(-50%);
                    font-family: 'Rock Salt', sans-serif;
                    font-size: 8px;
                    color: rgb(255, 255, 255);
                    letter-spacing: 2px;
                    z-index: 20;
                    opacity: 0;
                    max-width: 20%;
                    line-height: 1.6;
                    transition: opacity 5s ease-in;
                `;
                foodBanner.appendChild(msgEl);

                frame(() => {
                    frame(() => {
                        msgEl.style.opacity = '1';
                    });
                });

            }, totalDelay);
        });
    }

/* -------------------------------------------------- */
    /* RESET COMPLET                                      */
    /* -------------------------------------------------- */
    function resetAll() {
        // Cancel the entrance cascade (and any checkout animation) before hiding its elements.
        // Otherwise delayed callbacks can reveal food and bags over the welcome screen.
        clearPendingWork();

        /* état */
        Object.keys(bagStatus).forEach(k    => { bagStatus[k]      = false; });
        Object.keys(purchaseCount).forEach(k => { delete purchaseCount[k];  });
        Object.keys(kindCount).forEach(k     => { delete kindCount[k];       });
        totalItems   = 0;
        moneyLeft    = 50;
        isGameActive = false;

        /* message final */
        const msgEl = foodBanner.querySelector("#" + 'final-message');
        if (msgEl) msgEl.remove();

        /* sacs payés (bag-paid 1 à 8) */
        for (let i = 1; i <= 8; i++) {
            const bagEl = foodBanner.querySelector(`.effet-bag-paid-${i}`);
            if (bagEl) {
                bagEl.style.transition = 'none';
                bagEl.style.opacity    = '0';
                bagEl.style.left       = '';
            }
        }

        /* packages vitrines 4 et 5 */
        const packageSelectors = [
            '.effet-package-bag-1',  '.effet-package-bag-2',  '.effet-package-bag-3',
            '.effet-package-bag-4',  '.effet-package-bag-5',  '.effet-package-bag-6',
            '.effet-menu-bag-1',     '.effet-menu-bag-2',     '.effet-menu-bag-3',
            '.effet-menu-bag-4',     '.effet-menu-bag-5',     '.effet-menu-bag-6',
            '.effet-package-bag-7',  '.effet-package-bag-8',  '.effet-package-bag-9',
            '.effet-package-bag-10', '.effet-package-bag-11', '.effet-package-bag-12',
            '.effet-package-bag-13', '.effet-package-bag-14', '.effet-package-bag-15',
            '.effet-package-bag-16', '.effet-package-bag-17', '.effet-package-bag-18'
        ];
        packageSelectors.forEach(sel => {
            const el = foodBanner.querySelector(sel);
            if (el) {
                el.style.transition = 'none';
                el.style.opacity    = '0';
            }
        });

        /* tous les aliments cascade */
        allFoodItemsForCascade.forEach(item => {
            if (item) {
                item.style.transition = 'none';
                item.style.opacity    = '0';
            }
        });

        /* aliments jouables */
        playableItems.forEach(item => {
            item.style.opacity       = '0';
            item.style.pointerEvents = 'none';
            item.style.filter        = 'none';
        });

        /* decor : deck + vitrines */
        decorElements.forEach(el => { if (el) el.style.opacity = '0'; });

        /* money */
        moneyLeftDisplay.textContent      = '50$';
        moneyLeftDisplay.style.color      = 'rgb(0, 249, 166)';
        moneyLeftDisplay.style.textShadow = '0 0 10px rgb(0, 249, 166)';
        moneyLeftDisplay.style.animation  = 'none';

        /* action menu */
        actionMenu.style.animation = 'none';
        actionMenu.style.transform = 'translateX(100%)';
        actionMenu.style.opacity   = '0';

        /* welcome screen */
        welcomeScreen.style.animation     = 'none';
        welcomeScreen.style.opacity       = '0';
        welcomeScreen.style.visibility    = 'hidden';
        welcomeScreen.style.pointerEvents = 'auto';
        if (welcomeText) { welcomeText.style.animation = 'none'; welcomeText.style.opacity = '0'; }
        if (enterButton) { enterButton.style.animation = 'none'; enterButton.style.opacity = '0'; }
        if (welcomeLogo) { welcomeLogo.style.animation = 'none'; }

        /* tooltip */
        tooltip.style.opacity = '0';
        foodBanner.style.cursor = 'default';
        rulesGame.style.color = '';
        rulesGame.style.textTransform = '';
        rulesGame.style.fontWeight = '';
        rulesGame.style.animation = '';

        /* relancer */
        schedule(() => {
            animationHasPlayed = false;
            startWelcomeSequence();
        }, 300);
    }

    /* -------------------------------------------------- */
    /* BOUTON QUITTER                                     */
    /* -------------------------------------------------- */
    if (quitterBtn) {
        listen(quitterBtn, 'click', () => resetAll());
    }

    /* -------------------------------------------------- */
    /* WELCOME SEQUENCE                                   */
    /* -------------------------------------------------- */
    function startWelcomeSequence() {
        const logoDuration = 3000;
        schedule(() => {
            welcomeScreen.style.visibility = 'visible';
            welcomeScreen.style.opacity    = 1;
            if (welcomeLogo) welcomeLogo.style.animation = `ny-blurThenZoom ${logoDuration / 1000}s ease-out forwards`;

            schedule(() => {
                if (welcomeText) welcomeText.style.animation = 'ny-blurOutFadeIn 3s ease-out forwards';
                schedule(() => {
                    if (enterButton) enterButton.style.animation = 'ny-slideInFromRight 1.5s ease-out forwards';
                }, 300);
            }, logoDuration);
        }, 500);
    }

    /* -------------------------------------------------- */
    /* MAIN SEQUENCE                                      */
    /* -------------------------------------------------- */
    function startMainSequence() {
        if (welcomeScreen) {
            welcomeScreen.style.animation = 'ny-fadeOut 0.5s ease-out forwards';
            schedule(() => { welcomeScreen.style.pointerEvents = 'none'; }, 500);
        }

        schedule(() => {

            /* deck + vitrines */
            decorElements.forEach((el, index) => {
                if (el) schedule(() => { el.style.opacity = 1; }, index * 150);
            });

            const decorTime = decorElements.length * 150;

            /* aliments cascade */
            schedule(() => {
                allFoodItemsForCascade.forEach((item, index) => {
                    if (item) schedule(() => { item.style.opacity = 1; }, index * 60);
                });

                const foodTime = allFoodItemsForCascade.length * 60;

                /* action menu */
                schedule(() => {
                    if (actionMenu) {
                        actionMenu.style.animation = 'ny-slideInFromRight 2s forwards';
                        schedule(() => {
                            if (moneyLeftDisplay) moneyLeftDisplay.style.animation = 'ny-heartbeat 3s infinite';
                        }, 800);
                    }

                    /* activer le jeu */
                    schedule(() => {
                        isGameActive = true;
                    }, 1000);

                }, foodTime - 2500);

            }, decorTime);

        }, 500);
    }

    /* -------------------------------------------------- */
    /* BOUTON ENTRER                                      */
    /* -------------------------------------------------- */
    if (enterButton) {
        listen(enterButton, 'click', (e) => {
            e.preventDefault();
            startMainSequence();
        });
    }

    /* -------------------------------------------------- */
    /* INTERSECTION OBSERVER                              */
    /* -------------------------------------------------- */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationHasPlayed) {
                animationHasPlayed = true;
                startWelcomeSequence();
                observer.unobserve(foodBanner);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(foodBanner);
  return () => { observer.disconnect(); clearPendingWork(); listeners.forEach(dispose => dispose()); };
}
