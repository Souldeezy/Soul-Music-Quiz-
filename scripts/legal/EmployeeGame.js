import { addRetiree } from "./MoneyManager.js";

import { playEmployeeSfx } from "./EmployeeGameAudioManager.js";

export default function initEmployeeGame(playerName = "") {
  const banner = document.querySelector(".section-banner.banner-categories");
  if (!banner) return;

  if (banner.dataset.employeeGameInitialized === "true") {
    return;
  }

  banner.dataset.employeeGameInitialized = "true";

  let started = false;

  //  CONFIGURATION GENERALE...........................................................................................................................................//

  const CONFIG = {
    pilesAvantPause: 4,
    pilesAvantLevelUp: 10,
    delaiMaxLevelUp: 600000, // 10 minutes
    delaiEntreWarnings: 300000, // 5 minutes
    bonusArgentLevel: [10, 20, 30, 40, 50],
    vitesseBase: 300,
    retraiteNiveau: 3,
    retraiteCout: 0,
    salaireParPile: [2, 6, 11, 16, 22],
    niveaux: [
      { titre: "Nut Head", pages: 50 },
      { titre: "Trainee", pages: 60 },
      { titre: "Reliable", pages: 70 },
      { titre: "Effective", pages: 80 },
      { titre: "Devoted", pages: 90 },
    ],
  };

  // NOMS EMPLOYEES.....................................................................................................................................................//

  const NOMS_POOL = [
    "Marcus",
    "James",
    "Kevin",
    "Tyrone",
    "Daniel",
    "Jerome",
    "William",
    "DeShawn",
    "Calvin",
    "Andrew",
    "Richard",
    "Lamar",
    "Matthew",
    "Darnell",
    "Charles",
    "Curtis",
    "Joshua",
    "Antoine",
    "Paul",
    "Kendrick",
    "Thomas",
    "Reginald",
    "David",
    "Leroy",
    "Brian",
    "Terrence",
    "Robert",
    "Nathaniel",
    "Michael",
    "Roosevelt",
    "Mark",
    "Bernard",
    "Joseph",
    "Clifton",
    "Christopher",
    "Dewey",
    "Steven",
    "Elroy",
    "Anthony",
    "Franklin",
  ];

  const nomJoueur = playerName
    .replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ '-]/g, "")
    .trim()
    .slice(0, 12);

  const nomsUtilises = nomJoueur ? [nomJoueur] : [];

  function getNomAleatoire() {
    try {
      const cle = "smq_retired_employee_names";

      const historique = JSON.parse(localStorage.getItem(cle) || "[]");

      const sauvegarde = JSON.parse(
        localStorage.getItem("smq_retirees") || "[]",
      );

      const retraites = [
        ...(Array.isArray(sauvegarde) ? sauvegarde : []),
        ...(Array.isArray(window.SMQ_RETRAITES) ? window.SMQ_RETRAITES : []),
      ];

      const exclus = new Set(
        [
          ...(Array.isArray(historique) ? historique : []),
          ...retraites.map((r) => r?.nom),
        ].filter((nom) => typeof nom === "string"),
      );

      localStorage.setItem(cle, JSON.stringify([...exclus]));

      const nomsIndisponibles = new Set(
        [...nomsUtilises, ...exclus].map((nom) => nom.trim().toLowerCase()),
      );

      const dispos = NOMS_POOL.filter(
        (nom) => !nomsIndisponibles.has(nom.toLowerCase()),
      );

      if (!dispos.length) return null;

      const nom = dispos[Math.floor(Math.random() * dispos.length)];

      nomsUtilises.push(nom);

      return nom;
    } catch (erreur) {
      console.error("Impossible de charger les noms disponibles :", erreur);

      return null;
    }
  }

  function laisserPosteVacant(num) {
    const emp = getEmploye(num);

    emp.nom = null;
    emp.fired = true;
    emp.ready = false;
    emp.enRetraite = false;

    clearTimeout(emp.levelTimer);
    clearTimeout(emp.warningTimer);

    const nom = getNameEl(num);
    const argent = getMoneyEl(num);
    const niveau = getLevelEl(num);

    if (nom) nom.textContent = "Poste vacant";
    if (argent) argent.textContent = "";
    if (niveau) niveau.textContent = "";

    const bureau = document.querySelector(`.effet-employee-bureau-${num}`);

    if (bureau) bureau.style.opacity = "0";

    const bonus = document.getElementById(`bonus-window-${num}`);

    if (bonus) bonus.style.display = "none";

    const bouton = document.getElementById(`retraite-btn-${num}`);

    if (bouton) bouton.disabled = true;

    showNotif(num, "Aucun employé disponible.", "orangered");
  }

  // MENU LUNCH.........................................................................................................................................................//

  const MENU = {
    boissons: [
      { id: "cafe", nom: "Café", prix: 2, drunk: false },
      { id: "soda", nom: "Soul Soda", prix: 3, drunk: false },
      { id: "juice", nom: "Funk Juice", prix: 3, drunk: false },
      { id: "beer", nom: "Beer", prix: 3, drunk: true },
    ],
    plats: [
      { id: "chicken", nom: "Fried Chicken", prix: 7 },
      { id: "shrimp", nom: "Shrimp Stew", prix: 9 },
      { id: "mac", nom: "Mac n'Cheese", prix: 5 },
      { id: "dessert", nom: "Dessert", prix: 5 },
    ],
  };

  // LOGIQUE EMOTION ET RENDEMENT TRAVAIL...............................................................................................................................//

  function getEmotion(boissonId, platId) {
    if (!boissonId && !platId)
      return {
        symbole: "sad",
        effet: -0.2,
        label: "-0.2x",
        color: "orangered",
      };
    const boisson = MENU.boissons.find((b) => b.id === boissonId);
    if (boisson && boisson.drunk)
      return {
        symbole: "drunk",
        effet: -0.4,
        label: "-0.4x",
        color: "orangered",
      };
    if (boissonId && platId)
      return {
        symbole: "super",
        effet: +0.4,
        label: "+0.4x",
        color: "#00f9a6",
      };
    if (platId && !boissonId)
      return { symbole: "bien", effet: +0.2, label: "+0.2x", color: "#00f9a6" };
    if (boissonId && !platId)
      return { symbole: "normal", effet: 0, label: "0x", color: "white" };
    return { symbole: "normal", effet: 0, label: "0x", color: "white" };
  }

  // ETAT DES EMPLOYEES.................................................................................................................................................//

  const EMPLOYES = [
    {
      num: 1,
      nom: nomJoueur || getNomAleatoire(),
      niveau: 0,
      argent: 0,
      pilesTotal: 0,
      pilesLevel: 0,
      warnings: 0,
      vitesseBonus: 0,
      enPause: false,
      fired: false,
      ready: true,
      pileSize: 50,
      paperDelay: CONFIG.vitesseBase,
      warningTimer: null,
      levelTimer: null,
    },
    {
      num: 2,
      nom: getNomAleatoire(),
      niveau: 0,
      argent: 0,
      pilesTotal: 0,
      pilesLevel: 0,
      warnings: 0,
      vitesseBonus: 0,
      enPause: false,
      fired: false,
      ready: true,
      pileSize: 50,
      paperDelay: CONFIG.vitesseBase,
      warningTimer: null,
      levelTimer: null,
    },
    {
      num: 3,
      nom: getNomAleatoire(),
      niveau: 0,
      argent: 0,
      pilesTotal: 0,
      pilesLevel: 0,
      warnings: 0,
      vitesseBonus: 0,
      enPause: false,
      fired: false,
      ready: true,
      pileSize: 50,
      paperDelay: CONFIG.vitesseBase,
      warningTimer: null,
      levelTimer: null,
    },
  ];

  const playerNameElement = getNameEl(1);

  if (playerNameElement && nomJoueur) {
    playerNameElement.classList.add("employee-player-name");
  }

  // CONFIGURATION DES 3 BUREAUX........................................................................................................................................//

  const BUREAUX = [
    {
      id: "bureau-1",
      num: 1,
      pileRight: "55%",
      employeeStop: "45%",
      livreurStop: "50%",
      pileInArms: { right: "56%", top: "60%" },
    },
    {
      id: "bureau-2",
      num: 2,
      pileRight: "32%",
      employeeStop: "22%",
      livreurStop: "25.5%",
      pileInArms: { right: "33.2%", top: "65%" },
    },
    {
      id: "bureau-3",
      num: 3,
      pileRight: "9%",
      employeeStop: "-1%",
      livreurStop: "3%",
      pileInArms: { right: "10.2%", top: "65%" },
    },
  ];

  // TIMING PHASES BUREAU...............................................................................................................................................//

  const ARRIVE_DURATION = 2500;
  const PAUSE_BEFORE_PICK = 1000;
  const PAUSE_AFTER_PICK = 1000;
  const DEPART_DURATION = 4000;
  const EXIT_BUFFER = 500;

  /* -------------------------------------------------------- */
  /* COULEURS PAPIERS                                         */
  /* -------------------------------------------------------- */

  const COLOR_DEFAULT = {
    bg: "rgba(238, 238, 238, 0.664)",
    shadow: "0px 0px 2px 0px rgba(255, 255, 255, 0.69)",
  };
  const COLOR_FULL = {
    bg: "rgba(160, 160, 160, 0.6)",
    shadow: "0px 0px 2px 0px rgba(100, 100, 100, 0.7)",
  };

  /* -------------------------------------------------------- */
  /* ELEMENTS DOM                                             */
  /* -------------------------------------------------------- */

  const employeePapers = document.querySelector(".effet-employee-papers-1");
  const livreur = document.querySelector(".effet-livreur-1");
  const bagLivreur = document.querySelector(".effet-bag-livreur-1");

  let employeeBusy = false;
  let livreurBusy = false;
  const pileQueue = [];
  const livreurQueue = [];

  /* -------------------------------------------------------- */
  /* HELPERS                                                  */
  /* -------------------------------------------------------- */

  function getEmploye(num) {
    return EMPLOYES[num - 1];
  }
  function getLevelEl(num) {
    return document.querySelector(`.effet-employee-level-${num} span`);
  }
  function getMoneyEl(num) {
    return document.querySelector(`.effet-employee-money-${num} span`);
  }
  function getNameEl(num) {
    return document.querySelector(`.effet-employee-name-${num}`);
  }
  function getBureauByNum(num) {
    return BUREAUX.find((b) => b.num === num);
  }

  /* -------------------------------------------------------- */
  /* PURGE QUEUES POUR UN EMPLOYE                            */
  /* -------------------------------------------------------- */

  function purgeQueues(num) {
    for (let i = livreurQueue.length - 1; i >= 0; i--) {
      if (livreurQueue[i].config.num === num) livreurQueue.splice(i, 1);
    }
    for (let i = pileQueue.length - 1; i >= 0; i--) {
      if (pileQueue[i].num === num) pileQueue.splice(i, 1);
    }
    const existingPopup = document.getElementById(`lunch-popup-${num}`);
    if (existingPopup) existingPopup.remove();

    // Si le livreur est bloqué sur ce bureau, le faire repartir
    if (livreurBusy) {
      const rightLivreur = parseFloat(livreur.style.right);
      // S'il est arrivé (pas en transit depuis la gauche)
      if (!isNaN(rightLivreur) && rightLivreur > 0 && rightLivreur < 80) {
        departLivreur(null);
      }
    }
  }

  /* -------------------------------------------------------- */
  /* UPDATE STATS                                             */
  /* -------------------------------------------------------- */

  function updateStats(num) {
    const emp = getEmploye(num);
    const titre =
      CONFIG.niveaux[Math.min(emp.niveau, CONFIG.niveaux.length - 1)].titre;
    const lEl = getLevelEl(num);
    const mEl = getMoneyEl(num);
    if (lEl) lEl.textContent = titre;

    const montant =
      emp.argent % 1 === 0
        ? emp.argent.toFixed(0)
        : emp.argent.toFixed(2).replace(".", ",");
    if (mEl) mEl.textContent = montant + " $";

    const btn = document.getElementById(`retraite-btn-${num}`);
    if (btn && !emp.enRetraite) {
      if (emp.niveau >= CONFIG.retraiteNiveau) {
        btn.style.transition = "opacity 3s ease, filter 3s ease";
        btn.style.opacity = "1";
        btn.style.filter = "blur(0px)";
        btn.style.color = "rgba(255,69,0,0.9)";
      } else {
        btn.style.transition = "none";
        btn.style.opacity = "0.5";
        btn.style.filter = "blur(3px)";
        btn.style.color = "rgba(255,69,0,0.4)";
      }
    }

    updateBonusWindow(num);
  }

  /* -------------------------------------------------------- */
  /* FENETRE BONUS MALUS                                      */
  /* -------------------------------------------------------- */

  function updateBonusWindow(num) {
    let bonusEl = document.getElementById(`bonus-window-${num}`);

    if (!bonusEl) {
      bonusEl = document.createElement("div");
      bonusEl.id = `bonus-window-${num}`;
      bonusEl.style.cssText = `
        position: absolute;
        z-index: 15;
        background: rgba(0,0,0,0.85);
        border-left: 2px solid rgba(255,69,0,0.4);
        border-right: 2px solid rgba(255,69,0,0.4);
        border-bottom: 2px solid rgba(255,69,0,0.4);
        border-bottom-left-radius: 3px;
        border-bottom-right-radius: 3px;
        padding: 5px;
        font-family: "Poiret One", sans-serif;
        font-size: 8px;
        pointer-events: none;
        white-space: nowrap;
        text-align: center;
        letter-spacing: 1px;
        width: 100px;
        font-weight: bold;
      `;
      if (num === 1) {
        bonusEl.style.right = "63%";
        bonusEl.style.top = "0%";
      }
      if (num === 2) {
        bonusEl.style.right = "40%";
        bonusEl.style.top = "0%";
      }
      if (num === 3) {
        bonusEl.style.right = "16.9%";
        bonusEl.style.top = "0%";
      }
      banner.appendChild(bonusEl);
    }

    const emp = getEmploye(num);
    const bonus = emp.vitesseBonus;
    const color = bonus > 0 ? "#00f9a6" : bonus < 0 ? "orangered" : "white";
    const absBonus = Math.abs(bonus);
    const bonusStr =
      absBonus === 0 || absBonus % 1 === 0
        ? Math.round(absBonus).toFixed(0)
        : parseFloat(absBonus.toFixed(2)).toString().replace(".", ",");

    bonusEl.innerHTML = `
      <span style="color:#aaa;">Rendement : </span>
      <span style="color:${color};font-weight:bold;">${bonus < 0 ? "- " : ""}${bonusStr}</span>
    `;
  }

  /* -------------------------------------------------------- */
  /* NOTIFICATION                                             */
  /* -------------------------------------------------------- */

  function showNotif(num, message, color) {
    color = color || "rgba(255,69,0,0.4)";
    const msg = document.createElement("div");
    msg.style.cssText = `
      position: absolute;
      z-index: 25;
      background: black;
      border-top: 2px solid rgba(255,69,0,0.4);
      border-left: 2px solid rgba(255,69,0,0.4);
      border-right: 2px solid rgba(255,69,0,0.4);
      color: ${color};
      font-size: 9px;
      font-family: "Poiret One", sans-serif;
      padding: 5px 8px;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      pointer-events: none;
      white-space: nowrap;
      width: 300px;
      font-weight: bold;
      transition: bottom 0.6s ease-out;
    `;
    if (num === 1) {
      msg.style.right = "50%";
      msg.style.bottom = "-15%";
    }
    if (num === 2) {
      msg.style.right = "27.3%";
      msg.style.bottom = "-15%";
    }
    if (num === 3) {
      msg.style.right = "4%";
      msg.style.bottom = "-15%";
    }

    msg.textContent = message;

    if (
      message === "Un retraité est déjà disponible dans la bannière en dessous"
    ) {
      msg.style.textAlign = "center";
    }
    banner.appendChild(msg);

    setTimeout(() => {
      msg.style.bottom = "0%";
      setTimeout(() => {
        msg.style.transition = "bottom 0.6s ease-in";
        msg.style.bottom = "-15%";
        setTimeout(() => msg.remove(), 600);
      }, 4000);
    }, 20);
  }

  /* -------------------------------------------------------- */
  /* BULLE BD                                                 */
  /* -------------------------------------------------------- */

  function showBulle(num, symbole, duree, onComplete) {
    const bulle = document.querySelector(`.effet-bulle-bureau-${num}`);
    const symbols = {
      faim: document.querySelector(`.symbole-faim-${num}`),
      super: document.querySelector(`.symbole-super-${num}`),
      bien: document.querySelector(`.symbole-bien-${num}`),
      normal: document.querySelector(`.symbole-normal-${num}`),
      drunk: document.querySelector(`.symbole-drunk-${num}`),
      sad: document.querySelector(`.symbole-sad-${num}`),
    };

    if (!bulle) {
      if (onComplete) onComplete();
      return;
    }

    Object.values(symbols).forEach((s) => {
      if (s) {
        s.style.transition = "none";
        s.style.opacity = "0";
      }
    });

    const sym = symbols[symbole];
    if (sym) {
      sym.style.transition = "opacity 0.4s ease";
      sym.style.opacity = "1";
    }

    bulle.style.transition = "opacity 0.4s ease";
    bulle.style.opacity = "1";

    setTimeout(() => {
      bulle.style.transition = "opacity 0.5s ease";
      bulle.style.opacity = "0";
      if (sym) {
        sym.style.transition = "opacity 0.5s ease";
        sym.style.opacity = "0";
      }
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }, duree);
  }

  /* -------------------------------------------------------- */
  /* LEVEL UP                                                 */
  /* -------------------------------------------------------- */

  function checkLevelUp(num) {
    const emp = getEmploye(num);
    if (!emp || emp.fired || emp.enRetraite) return;

    clearTimeout(emp.levelTimer);
    clearTimeout(emp.warningTimer);

    emp.levelTimer = null;
    emp.warningTimer = null;
    emp.warnings = 0;

    if (emp.niveau < CONFIG.niveaux.length - 1) {
      emp.pilesLevel++;

      if (emp.pilesLevel >= CONFIG.pilesAvantLevelUp) {
        emp.niveau++;
        emp.pilesLevel = 0;

        const bonus =
          CONFIG.bonusArgentLevel[
            Math.min(emp.niveau - 1, CONFIG.bonusArgentLevel.length - 1)
          ];

        emp.argent += bonus;
        emp.pileSize = CONFIG.niveaux[emp.niveau].pages;

        playEmployeeSfx("LEVEL_UP", "CREDIT_MONEY");

        showNotif(
          num,
          `⬆️ Level Up + ${bonus} $ ( ${CONFIG.niveaux[emp.niveau].titre} )`,
          "#00f9a6",
        );

        updateStats(num);
      }
    }

    emp.levelTimer = setTimeout(() => showWarning(num), CONFIG.delaiMaxLevelUp);
  }

  /* -------------------------------------------------------- */
  /* WARNING                                                  */
  /* -------------------------------------------------------- */

  function showWarning(num) {
    const emp = getEmploye(num);
    if (emp.fired) return;
    emp.warnings++;
    playEmployeeSfx("WARNING");
    const msg =
      emp.warnings >= 3
        ? `⚠️ Warning ${emp.warnings} — DERNIER AVERTISSEMENT !`
        : `⚠️ Warning ${emp.warnings} — Concentrez Vous !`;
    showNotif(num, msg, "orangered");
    if (emp.warnings >= 3) {
      emp.warningTimer = setTimeout(() => fireEmployee(num), 5000);
    } else {
      emp.warningTimer = setTimeout(
        () => showWarning(num),
        CONFIG.delaiEntreWarnings,
      );
    }
  }

  function memoriserNomRetraite(nom) {
    const cle = "smq_retired_employee_names";

    try {
      const sauvegarde = JSON.parse(localStorage.getItem(cle) || "[]");

      const noms = Array.isArray(sauvegarde)
        ? sauvegarde.filter((n) => typeof n === "string")
        : [];

      if (!noms.includes(nom)) {
        noms.push(nom);
      }

      localStorage.setItem(cle, JSON.stringify(noms));
    } catch (erreur) {
      console.error("Impossible de mémoriser le nom du retraité :", erreur);
    }
  }

  // PARTIR RETRAITE......................................................//
  // .....................................................................//
  // .....................................................................//

  function partirRetraite(num) {
    const emp = getEmploye(num);
    const config = getBureauByNum(num);

    if (!emp || emp.fired || emp.enRetraite) {
      return;
    }

    if (emp.niveau < CONFIG.retraiteNiveau) {
      showNotif(
        num,
        `❌ Cette fonction sera disponible au Niveau ${CONFIG.retraiteNiveau}`,
        "orangered",
      );
      return;
    }

    if (
      Array.isArray(window.SMQ_RETRAITES) &&
      window.SMQ_RETRAITES.length > 0
    ) {
      showNotif(
        num,
        "Un retraité est déjà disponible dans la bannière en dessous",
        "orangered",
      );
      return;
    }

    emp.fired = true;
    emp.ready = false;
    emp.enRetraite = true;
    if (emp.levelTimer) clearTimeout(emp.levelTimer);
    if (emp.warningTimer) clearTimeout(emp.warningTimer);
    purgeQueues(num);

    updateStats(num);

    showNotif(num, `🌴 ${emp.nom} a pris sa retraite !`, "#00f9a6");
    setTimeout(() => {
      showNotif(
        num,
        `🎡 Rejoignez ${emp.nom} dans la bannière en dessous !`,
        "#00f9a6",
      );
    }, 2000);

    if (addRetiree(emp.nom, emp.argent)) {
      playEmployeeSfx("RETIREE");
      memoriserNomRetraite(emp.nom);
    }

    const empEl = document.querySelector(`.effet-employee-bureau-${num}`);

    setTimeout(() => {
      showBulle(num, "super", 5000, () => {
        if (empEl) {
          empEl.style.transition = "opacity 2s ease";
          empEl.style.opacity = "0";
        }

        emp.enRetraite = false;
        const btn = document.getElementById(`retraite-btn-${num}`);
        if (btn) {
          btn.style.transition = "opacity 1s ease, filter 1s ease";
          btn.style.opacity = "0.5";
          btn.style.filter = "blur(3px)";
          btn.style.color = "rgba(255,69,0,0.4)";
        }

        setTimeout(() => {
          const nouveauNom = getNomAleatoire();

          if (!nouveauNom) {
            laisserPosteVacant(num);
            return;
          }
          showNotif(
            num,
            `👔 ${nouveauNom} va prendre ses fonctions !`,
            "#00f9a6",
          );

          setTimeout(() => {
            emp.nom = nouveauNom;
            getNameEl(num)?.classList.remove("employee-player-name");
            emp.niveau = 0;
            emp.argent = 0;
            emp.pilesTotal = 0;
            emp.pilesLevel = 0;
            emp.warnings = 0;
            emp.vitesseBonus = 0;
            emp.paperDelay = CONFIG.vitesseBase;
            emp.pileSize = 50;
            emp.enPause = false;
            emp.fired = false;
            emp.ready = false;
            emp.enRetraite = false;
            emp.levelTimer = null;
            emp.warningTimer = null;

            const nameEl = getNameEl(num);
            if (nameEl) nameEl.textContent = nouveauNom;
            updateStats(num);

            if (empEl) {
              empEl.style.transition = "opacity 2s ease";
              empEl.style.opacity = "1";
            }

            setTimeout(() => {
              showBulle(num, "super", 5000, () => {
                setTimeout(() => {
                  if (config) {
                    emp.ready = true;
                    recreatePile(config);
                    startPaperLoop(config);
                  }
                }, 5000);
              });
            }, 5000);
          }, 5000);
        }, 10000);
      });
    }, 5000);
  }



  /* -------------------------------------------------------- */
  /* VIRER EMPLOYE                                            */
  /* -------------------------------------------------------- */

  function fireEmployee(num) {
    const emp = getEmploye(num);
    const config = getBureauByNum(num);

    // Stopper toutes les interactions immédiatement
    emp.fired = true;
    emp.ready = false;
    if (emp.levelTimer) clearTimeout(emp.levelTimer);
    if (emp.warningTimer) clearTimeout(emp.warningTimer);
    purgeQueues(num);

    // Notif licenciement
    showNotif(num, `🚫 ${emp.nom} a été licencié !`, "orangered");
    playEmployeeSfx("FIRED");

    // Faire disparaître la pile de papiers
    if (config) {
      for (let i = 1; i <= emp.pileSize; i++) {
        const papier = document.getElementById(`papier-${config.id}-${i}`);
        if (papier) {
          papier.style.transition = "opacity 1s ease";
          papier.style.opacity = "0";
        }
      }
    }

    const empEl = document.querySelector(`.effet-employee-bureau-${num}`);

    // Attendre 5s puis emoji sad
    setTimeout(() => {
      showBulle(num, "sad", 5000, () => {
        // Fade out employé
        if (empEl) {
          empEl.style.transition = "opacity 2s ease";
          empEl.style.opacity = "0";
        }

        // Remettre le bouton retraite en blur
        const btn = document.getElementById(`retraite-btn-${num}`);
        if (btn) {
          btn.style.transition = "opacity 1s ease, filter 1s ease";
          btn.style.opacity = "0.5";
          btn.style.filter = "blur(3px)";
          btn.style.color = "rgba(255,69,0,0.4)";
        }

        // Attendre 10s puis notif nouvel employé
        setTimeout(() => {
          const nouveauNom = getNomAleatoire();

          if (!nouveauNom) {
            laisserPosteVacant(num);
            return;
          }
          showNotif(
            num,
            `👔 ${nouveauNom} va prendre ses fonctions !`,
            "#00f9a6",
          );

          // Attendre 5s puis faire apparaître le nouvel employé
          setTimeout(() => {
            emp.nom = nouveauNom;
            getNameEl(num)?.classList.remove("employee-player-name");
            emp.niveau = 0;
            emp.argent = 0;
            emp.pilesTotal = 0;
            emp.pilesLevel = 0;
            emp.warnings = 0;
            emp.vitesseBonus = 0;
            emp.paperDelay = CONFIG.vitesseBase;
            emp.pileSize = 50;
            emp.enPause = false;
            emp.fired = false;
            emp.ready = false; // ← pas encore ready
            emp.levelTimer = null;
            emp.warningTimer = null;

            const nameEl = getNameEl(num);
            if (nameEl) nameEl.textContent = nouveauNom;
            updateStats(num);

            // Fade in nouvel employé
            if (empEl) {
              empEl.style.transition = "opacity 2s ease";
              empEl.style.opacity = "1";
            }

            // Attendre 5s puis emoji very happy
            setTimeout(() => {
              showBulle(num, "super", 5000, () => {
                // Attendre 5s puis commencer le travail
                setTimeout(() => {
                  if (config) {
                    emp.ready = true; // ← seulement maintenant il est prêt
                    recreatePile(config);
                    startPaperLoop(config);
                  }
                }, 5000);
              });
            }, 5000);
          }, 5000);
        }, 10000);
      });
    }, 5000);
  }

  /* -------------------------------------------------------- */
  /* PILES                                                    */
  /* -------------------------------------------------------- */

  function createPile(config) {
    const pile = document.getElementById(`pile-${config.id}`);
    if (!pile) return;
    const emp = getEmploye(config.num);
    for (let i = 1; i <= emp.pileSize; i++) {
      const papier = document.createElement("div");
      papier.classList.add("effet-papier");
      papier.id = `papier-${config.id}-${i}`;
      papier.style.right = config.pileRight;
      papier.style.top = 85 - (i - 1) * 0.5 + "%";
      papier.style.zIndex = "5";
      papier.style.backgroundColor = COLOR_DEFAULT.bg;
      papier.style.boxShadow = COLOR_DEFAULT.shadow;
      papier.style.filter = "none";
      papier.style.opacity = "0";
      pile.appendChild(papier);
    }
  }

  function recreatePile(config) {
    const pile = document.getElementById(`pile-${config.id}`);
    if (!pile) return;
    pile.innerHTML = "";
    createPile(config);
  }

  function showPapier(config, num) {
    const papier = document.getElementById(`papier-${config.id}-${num}`);
    if (papier) papier.style.opacity = "1";
  }

  function resetPile(config) {
    const emp = getEmploye(config.num);
    for (let i = 1; i <= emp.pileSize; i++) {
      const papier = document.getElementById(`papier-${config.id}-${i}`);
      if (papier) {
        papier.style.transition = "none";
        papier.style.opacity = "0";
        papier.style.right = config.pileRight;
        papier.style.top = 85 - (i - 1) * 0.5 + "%";
        papier.style.zIndex = "5";
        papier.style.backgroundColor = COLOR_DEFAULT.bg;
        papier.style.boxShadow = COLOR_DEFAULT.shadow;
        papier.style.filter = "none";
      }
    }
  }

  function hidePileInstant(config) {
    const emp = getEmploye(config.num);
    for (let i = 1; i <= emp.pileSize; i++) {
      const papier = document.getElementById(`papier-${config.id}-${i}`);
      if (papier) {
        papier.style.transition = "none";
        papier.style.opacity = "0";
        papier.style.zIndex = "0";
      }
    }
  }

  function showPileInArms(config) {
    const emp = getEmploye(config.num);
    for (let i = 1; i <= emp.pileSize; i++) {
      const papier = document.getElementById(`papier-${config.id}-${i}`);
      if (papier) {
        papier.style.transition = "none";
        papier.style.right = config.pileInArms.right;
        papier.style.top =
          parseFloat(config.pileInArms.top) - (i - 1) * 0.5 + "%";
        papier.style.zIndex = "0";
        papier.style.backgroundColor = COLOR_FULL.bg;
        papier.style.boxShadow = COLOR_FULL.shadow;
        papier.style.filter = "blur(3px)";
        papier.style.opacity = "1";
      }
    }
  }

  /* -------------------------------------------------------- */
  /* PAPERMAN                                                 */
  /* -------------------------------------------------------- */

  function processNextInQueue() {
    if (pileQueue.length === 0) return;
    const available = pileQueue.filter((c) => !getEmploye(c.num).fired);
    if (available.length === 0) {
      pileQueue.length = 0;
      return;
    }
    const idx = Math.floor(Math.random() * available.length);
    const next = available[idx];
    pileQueue.splice(pileQueue.indexOf(next), 1);
    triggerEmployeePapers(next, next._onComplete);
  }

  function triggerEmployeePapers(config, onComplete) {
    if (!employeePapers) return;
    employeeBusy = true;

    employeePapers.style.transition = "none";
    employeePapers.style.right = "-15%";
    employeePapers.style.opacity = "0";

    setTimeout(() => {
      employeePapers.style.transition = `right ${ARRIVE_DURATION}ms linear, opacity 0.5s ease`;
      employeePapers.style.opacity = "0.7";
      employeePapers.style.right = config.employeeStop;

      setTimeout(() => {
        setTimeout(() => {
          hidePileInstant(config);
          showPileInArms(config);
          playEmployeeSfx("PILE_TAKEN");

          const emp = getEmploye(config.num);
          const salaire =
            CONFIG.salaireParPile[
              Math.min(emp.niveau, CONFIG.salaireParPile.length - 1)
            ];
          emp.argent += salaire;
          playEmployeeSfx("CREDIT_MONEY");
          emp.pilesTotal++;
          updateStats(config.num);
          checkLevelUp(config.num);

          setTimeout(() => {
            employeePapers.style.transition = `right ${DEPART_DURATION}ms linear, opacity 0.5s ease`;
            employeePapers.style.right = "105%";

            for (let i = 1; i <= emp.pileSize; i++) {
              const papier = document.getElementById(
                `papier-${config.id}-${i}`,
              );
              if (papier) {
                papier.style.transition = `right ${DEPART_DURATION}ms linear`;
                papier.style.right = "115%";
              }
            }

            setTimeout(() => {
              employeePapers.style.transition = "none";
              employeePapers.style.opacity = "0";
              employeePapers.style.right = "-150%";

              for (let i = 1; i <= emp.pileSize; i++) {
                const papier = document.getElementById(
                  `papier-${config.id}-${i}`,
                );
                if (papier) {
                  papier.style.transition = "none";
                  papier.style.opacity = "0";
                }
              }

              resetPile(config);
              employeeBusy = false;
              processNextInQueue();
              if (onComplete) onComplete();
            }, DEPART_DURATION + EXIT_BUFFER);
          }, PAUSE_AFTER_PICK);
        }, PAUSE_BEFORE_PICK);
      }, ARRIVE_DURATION);
    }, 20);
  }

  /* -------------------------------------------------------- */
  /* POPUP MENU LUNCH                                         */
  /* -------------------------------------------------------- */

  function showLunchMenu(config, onComplete) {
    const emp = getEmploye(config.num);

    if (emp.fired || !emp.ready) {
      departLivreur(onComplete);
      return;
    }

    const existing = document.getElementById(`lunch-popup-${config.num}`);
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.id = `lunch-popup-${config.num}`;
    popup.style.cssText = `
      position: absolute;
      z-index: 30;
      background: black;
      border-right: 1px solid orangered;
      border-radius: 0px;
      padding: 10px 14px;
      color: white;
      font-family: "Poiret One", sans-serif;
      font-size: 10px;
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: flex-start;
      white-space: nowrap;
      width: 350px;
      height: 130px;
      box-sizing: border-box;
      overflow: hidden;
    `;

    let selectedBoisson = null;
    let selectedPlat = null;

    popup.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:2px;min-width:90px;">
        <div style="font-size:10px;">
          <span style="color:orangered;font-weight:bold;">🍽 Lunch :</span>
          <span style="font-family:'Rock Salt', sans-serif;font-size:9px;color:white;margin-left:5px;">${emp.nom}</span>
        </div>
        <div style="font-size:10px;margin-top:5px;">
          <span style="color:orangered;font-weight:bold;">Budget :</span>
          <span style="color:#00f9a6;font-family:'Rock Salt', sans-serif;font-size:13px;margin-left:5px;">${emp.argent % 1 === 0 ? emp.argent.toFixed(0) : emp.argent.toFixed(2).replace(".", ",")}$</span>
        </div>
        <div style="display:flex;gap:4px;margin-top:8px;">
          <button id="lunch-ok-${config.num}" style="
            background:transparent;border:1px solid orangered;color:orangered;
            font-family:'Poiret One',sans-serif;cursor:pointer;padding:2px 8px;
            border-radius:3px;font-size:9px;transition: border-color 0.2s ease, color 0.2s ease;
          ">✅ Valider</button>
          <button id="lunch-stop-${config.num}" style="
            background:transparent;border:1px solid orangered;color:orangered;
            font-family:'Poiret One',sans-serif;cursor:pointer;padding:2px 8px;
            border-radius:3px;font-size:9px;transition: border-color 0.2s ease, color 0.2s ease;
          ">❌ Passer</button>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:3px;">
        <div style="color:#aaa;margin-bottom:2px;">Boisson :</div>
        ${MENU.boissons
          .map(
            (b) => `
          <div class="lunch-choice" data-type="boisson" data-id="${b.id}" data-prix="${b.prix}" data-drunk="${b.drunk}"
            style="cursor:pointer;padding:2px 6px;border-radius:3px;border:1px solid transparent;
            transition: transform 0.15s ease, color 0.15s ease, border-color 0.15s ease, background 0.15s ease;">
            ${b.nom} — ${b.prix}$
          </div>
        `,
          )
          .join("")}
      </div>

      <div style="display:flex;flex-direction:column;gap:3px;">
        <div style="color:#aaa;margin-bottom:2px;">Plat (optionnel) :</div>
        ${MENU.plats
          .map(
            (p) => `
          <div class="lunch-choice" data-type="plat" data-id="${p.id}" data-prix="${p.prix}"
            style="cursor:pointer;padding:2px 6px;border-radius:3px;border:1px solid transparent;
            transition: transform 0.15s ease, color 0.15s ease, border-color 0.15s ease, background 0.15s ease;">
            ${p.nom} — ${p.prix}$
          </div>
        `,
          )
          .join("")}
      </div>
    `;

    banner.appendChild(popup);
    playEmployeeSfx("LUNCH_BOY_ARRIVED");

    const positions = {
      1: { left: "0%", right: "auto", top: "0%" },
      2: { left: "0%", right: "auto", top: "0%" },
      3: { left: "0%", right: "auto", top: "0%" },
    };
    const pos = positions[config.num];
    popup.style.left = pos.left;
    popup.style.right = pos.right;
    popup.style.top = pos.top;

    popup.querySelectorAll(".lunch-choice").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        const isSelected = el.style.borderColor === "rgb(0, 249, 166)";
        if (!isSelected) {
          el.style.transform = "scale(1.05)";
          el.style.color = "#00f9a6";
          el.style.border = "1px solid rgba(0,249,166,0.4)";
          el.style.background = "rgba(0,249,166,0.05)";
        }
      });

      el.addEventListener("mouseleave", () => {
        const isSelected = el.style.borderColor === "rgb(0, 249, 166)";
        if (!isSelected) {
          el.style.transform = "scale(1)";
          el.style.color = "white";
          el.style.border = "1px solid transparent";
          el.style.background = "transparent";
        }
      });

      el.addEventListener("click", () => {
        const type = el.dataset.type;
        const isAlreadySelected = el.style.borderColor === "rgb(0, 249, 166)";

        popup
          .querySelectorAll(`.lunch-choice[data-type="${type}"]`)
          .forEach((e) => {
            e.style.border = "1px solid transparent";
            e.style.background = "transparent";
            e.style.color = "white";
            e.style.transform = "scale(1)";
          });

        if (!isAlreadySelected) {
          playEmployeeSfx("CHOOSE_MENU");
          el.style.border = "1px solid #00f9a6";
          el.style.background = "rgba(0,249,166,0.1)";
          el.style.color = "#00f9a6";
          el.style.transform = "scale(1.05)";
          if (type === "boisson") selectedBoisson = el;
          if (type === "plat") selectedPlat = el;
        } else {
          if (type === "boisson") selectedBoisson = null;
          if (type === "plat") selectedPlat = null;
        }
      });
    });

    const btnOk = document.getElementById(`lunch-ok-${config.num}`);
    const btnStop = document.getElementById(`lunch-stop-${config.num}`);

    btnOk.addEventListener("mouseenter", () => {
      btnOk.style.borderColor = "#00f9a6";
      btnOk.style.color = "#00f9a6";
    });
    btnOk.addEventListener("mouseleave", () => {
      btnOk.style.borderColor = "orangered";
      btnOk.style.color = "orangered";
    });
    btnStop.addEventListener("mouseenter", () => {
      btnStop.style.borderColor = "#aaa";
      btnStop.style.color = "#aaa";
    });
    btnStop.addEventListener("mouseleave", () => {
      btnStop.style.borderColor = "orangered";
      btnStop.style.color = "orangered";
    });

    btnOk.addEventListener("click", () => {
      if (!selectedBoisson && !selectedPlat) {
        showNotif(
          config.num,
          "❌ Choisissez au moins une boisson ou un plat !",
          "orangered",
        );
        return;
      }

      const prixBoisson = selectedBoisson
        ? parseInt(selectedBoisson.dataset.prix)
        : 0;
      const prixPlat = selectedPlat ? parseInt(selectedPlat.dataset.prix) : 0;
      const prixTotal = prixBoisson + prixPlat;

      if (emp.argent < prixTotal) {
        showNotif(
          config.num,
          `❌ Pas assez ! (${prixTotal}$ requis)`,
          "orangered",
        );
        return;
      }

      emp.argent -= prixTotal;
      playEmployeeSfx("LUNCH_MENU_VALIDATE");

      const boissonId = selectedBoisson ? selectedBoisson.dataset.id : null;
      const platId = selectedPlat ? selectedPlat.dataset.id : null;
      const emotion = getEmotion(boissonId, platId);

      emp.vitesseBonus += emotion.effet;

      if (emotion.effet > 0) {
        playEmployeeSfx("RENDEMENT_GOOD");
      } else if (emotion.effet < 0) {
        playEmployeeSfx("RENDEMENT_BAD");
      }
      emp.paperDelay = Math.max(
        100,
        CONFIG.vitesseBase * (1 - emp.vitesseBonus),
      );
      updateStats(config.num);

      showNotif(
        config.num,
        `${emotion.effet > 0 ? "✅" : emotion.effet < 0 ? "⚠️" : "ℹ️"} Rendement ${emotion.label}`,
        emotion.color,
      );

      popup.remove();

      departLivreur(() => {
        showLunchItems(config, boissonId, platId, emotion.symbole, onComplete);
      });
    });

    btnStop.addEventListener("click", () => {
      playEmployeeSfx("LUNCH_PASS");
      popup.remove();

      emp.vitesseBonus -= 0.2;
      playEmployeeSfx("RENDEMENT_BAD");
      emp.paperDelay = Math.max(
        100,
        CONFIG.vitesseBase * (1 - emp.vitesseBonus),
      );
      updateStats(config.num);

      showNotif(config.num, "⚠️ Pause sautée — Rendement -0.2x", "orangered");

      departLivreur(() => {
        showBulle(config.num, "sad", 3000, () => {
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 2000);
        });
      });
    });
  }

  /* -------------------------------------------------------- */
  /* DEPART LIVREUR                                           */
  /* -------------------------------------------------------- */

  function departLivreur(onComplete) {
    if (!livreur) {
      if (onComplete) onComplete();
      return;
    }

    livreur.style.transition = `right ${DEPART_DURATION}ms linear, opacity 0.5s ease`;
    livreur.style.right = "105%";

    setTimeout(() => {
      livreur.style.transition = "none";
      livreur.style.opacity = "0";
      livreur.style.right = "-150%";

      if (bagLivreur) {
        bagLivreur.style.transition = "none";
        bagLivreur.style.opacity = "1";
      }

      livreurBusy = false;

      if (livreurQueue.length > 0) {
        const next = livreurQueue.shift();
        triggerLivreur(next.config, next.onComplete);
      }

      if (onComplete) onComplete();
    }, DEPART_DURATION + EXIT_BUFFER);
  }

  /* -------------------------------------------------------- */
  /* AFFICHER ALIMENTS SUR BUREAU                             */
  /* -------------------------------------------------------- */

  function showLunchItems(config, boissonId, platId, symbole, onComplete) {
    const num = config.num;

    const bag = document.querySelector(`.effet-lunch-bag-${num}`);
    if (bag) {
      bag.style.transition = "opacity 0.5s ease";
      bag.style.opacity = "1";
    }

    if (boissonId) {
      setTimeout(() => {
        const boi = document.querySelector(`.effet-${boissonId}-${num}`);
        if (boi) {
          boi.style.transition = "opacity 0.5s ease";
          boi.style.opacity = "1";

          if (boissonId === "beer") {
            playEmployeeSfx("LUNCH_DRUNK");
          }
        }
      }, 1000);
    }

    if (platId) {
      setTimeout(() => {
        const plt = document.querySelector(`.effet-lunch-${platId}-${num}`);
        if (plt) {
          plt.style.transition = "opacity 0.5s ease";
          plt.style.opacity = "1";

          playEmployeeSfx("LUNCH_EAT", "LUNCH_GOOD");
        }
      }, 2000);
    }

    setTimeout(() => {
      hideLunchItems(config, boissonId, platId, symbole, onComplete);
    }, 30000);
  }

  /* -------------------------------------------------------- */
  /* CACHER ALIMENTS + BULLE FIN REPAS                        */
  /* -------------------------------------------------------- */

  function hideLunchItems(config, boissonId, platId, symbole, onComplete) {
    const num = config.num;
    const items = [
      platId ? document.querySelector(`.effet-lunch-${platId}-${num}`) : null,
      boissonId ? document.querySelector(`.effet-${boissonId}-${num}`) : null,
      document.querySelector(`.effet-lunch-bag-${num}`),
    ].filter(Boolean);

    items.forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = "opacity 0.5s ease";
        el.style.opacity = "0";
      }, i * 500);
    });

    setTimeout(
      () => {
        showBulle(config.num, symbole, 5000, () => {
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 5000);
        });
      },
      items.length * 500 + 1000,
    );
  }

  /* -------------------------------------------------------- */
  /* LIVREUR                                                  */
  /* -------------------------------------------------------- */

  function triggerLivreur(config, onComplete) {
    const emp = getEmploye(config.num);

    // Ne pas livrer si l'employé n'est pas prêt
    if (!emp.ready || emp.fired) {
      if (onComplete) onComplete();
      return;
    }

    if (!livreur) return;
    livreurBusy = true;

    livreur.style.transition = "none";
    livreur.style.right = "-15%";
    livreur.style.opacity = "0";

    setTimeout(() => {
      livreur.style.transition = `right ${ARRIVE_DURATION}ms linear, opacity 0.5s ease`;
      livreur.style.opacity = "0.7";
      livreur.style.right = config.livreurStop;

      setTimeout(() => {
        setTimeout(() => {
          if (bagLivreur) {
            bagLivreur.style.transition = "opacity 0.3s ease";
            bagLivreur.style.opacity = "0";
          }
          showLunchMenu(config, onComplete);
        }, PAUSE_BEFORE_PICK);
      }, ARRIVE_DURATION);
    }, 20);
  }

  /* -------------------------------------------------------- */
  /* SEQUENCE PAUSE DEJEUNER                                  */
  /* -------------------------------------------------------- */

  function startLunchBreak(config, onComplete) {
    const emp = getEmploye(config.num);

    if (emp.enPause || emp.fired || !emp.ready) {
      if (onComplete) onComplete();
      return;
    }

    emp.enPause = true;

    playEmployeeSfx("HUNGRY_LUNCH_BREAK");

    showBulle(config.num, "faim", 5000, () => {
      setTimeout(() => {
        if (!livreurBusy) {
          triggerLivreur(config, () => {
            emp.enPause = false;
            emp.pilesTotal = 0;
            if (onComplete) onComplete();
          });
        } else {
          livreurQueue.push({
            config,
            onComplete: () => {
              emp.enPause = false;
              emp.pilesTotal = 0;
              if (onComplete) onComplete();
            },
          });
        }
      }, 20000);
    });
  }

  /* -------------------------------------------------------- */
  /* BOUCLE PAPIERS PAR BUREAU                               */
  /* -------------------------------------------------------- */

  function startPaperLoop(config) {
    const emp = getEmploye(config.num);
    let currentPapier = 1;
    let paused = false;

    function nextPapier() {
      if (paused) return;
      if (emp.fired || !emp.ready) return;

      if (currentPapier > emp.pileSize) {
        paused = true;
        playEmployeeSfx("PILE_DONE");

        const needsLunch =
          emp.pilesTotal + 1 >= CONFIG.pilesAvantPause && !emp.enPause;

        const afterPaperMan = () => {
          if (emp.fired || !emp.ready) return;
          recreatePile(config);
          if (needsLunch) {
            startLunchBreak(config, () => {
              paused = false;
              currentPapier = 1;
              recreatePile(config);
              setTimeout(() => nextPapier(), 1000);
            });
          } else {
            paused = false;
            currentPapier = 1;
            setTimeout(() => nextPapier(), 1000);
          }
        };

        if (!employeeBusy) {
          triggerEmployeePapers(config, afterPaperMan);
        } else {
          config._onComplete = afterPaperMan;
          pileQueue.push(config);
        }

        return;
      }

      showPapier(config, currentPapier);
      currentPapier++;
      setTimeout(() => nextPapier(), emp.paperDelay);
    }

    nextPapier();
  }

  /* -------------------------------------------------------- */
  /* HORLOGES                                                 */
  /* -------------------------------------------------------- */

  const CLOCKS = [
    { container: ".effet-heure-nyc", tz: "America/New_York" },
    { container: ".effet-heure-paris", tz: "Europe/Paris" },
    { container: ".effet-heure-tokyo", tz: "Asia/Tokyo" },
  ];

  function createClockHands(containerEl) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("clock-hand-container");
    ["hand-hours", "hand-minutes", "hand-seconds", "hand-pivot"].forEach(
      (cls) => {
        const el = document.createElement("div");
        el.classList.add(cls);
        wrapper.appendChild(el);
      },
    );
    containerEl.appendChild(wrapper);
    return {
      handHours: wrapper.querySelector(".hand-hours"),
      handMinutes: wrapper.querySelector(".hand-minutes"),
      handSeconds: wrapper.querySelector(".hand-seconds"),
    };
  }

  function getTimeInTz(tz) {
    const locale = new Date().toLocaleString("en-US", {
      timeZone: tz,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const [h, m, s] = locale.split(":").map(Number);
    return { h: h % 12, m, s };
  }

  function updateClock(hands, tz) {
    const { h, m, s } = getTimeInTz(tz);
    hands.handSeconds.style.transform = `translateX(-50%) rotateZ(${s * 6}deg)`;
    hands.handMinutes.style.transform = `translateX(-50%) rotateZ(${m * 6 + s * 0.1}deg)`;
    hands.handHours.style.transform = `translateX(-50%) rotateZ(${h * 30 + m * 0.5}deg)`;
  }

  function initClocks() {
    CLOCKS.forEach((clock) => {
      const el = document.querySelector(clock.container);
      if (!el) return;
      el.style.position = "relative";
      const hands = createClockHands(el);
      updateClock(hands, clock.tz);
      setInterval(() => updateClock(hands, clock.tz), 1000);
    });
  }

  /* -------------------------------------------------------- */
  /* SMQ HQ LOGO                                              */
  /* -------------------------------------------------------- */

  function initSmqLogo() {
    const logo = document.querySelector(".effet-smq-hq-logo");
    if (!logo) return;
    let pos = -65;
    setInterval(() => {
      pos += 0.08;
      if (pos > 100) pos = -65;
      logo.style.left = pos + "%";
    }, 16);
  }

  /* -------------------------------------------------------- */
  /* HEARTBEAT MONEY                                          */
  /* -------------------------------------------------------- */

  function initHeartbeat() {
    setTimeout(() => {
      [1, 2, 3].forEach((num) => {
        const el = document.querySelector(`.effet-employee-money-${num} span`);
        if (el) el.style.animation = "heartbeat 5s ease-in-out infinite";
      });
    }, 5000);
  }

  /* -------------------------------------------------------- */
  /* BOUTON RETRAITE                                          */
  /* -------------------------------------------------------- */

  function initRetraiteButtons() {
    [1, 2, 3].forEach((num) => {
      const btn = document.createElement("button");
      btn.id = `retraite-btn-${num}`;
      btn.style.cssText = `
        display: block;
        position: absolute;
        z-index: 19;
        background: rgba(0,0,0,0.85);
        border-left: 2px solid rgba(255,69,0,0.4);
        border-right: 2px solid rgba(255,69,0,0.4);
        border-bottom: 2px solid rgba(255,69,0,0.4);
        border-bottom-left-radius: 3px;
        border-bottom-right-radius: 3px;
        color: rgba(255,69,0,0.4);
        font-family: "Poiret One", sans-serif;
        font-size: 8px;
        font-weight: bold;
        letter-spacing: 1px;
        cursor: pointer;
        padding: 5px;
        white-space: nowrap;
        text-align: center;
        width: 100px;
        box-sizing: border-box;
        opacity: 0.5;
        top: -2%;
        filter: blur(3px);
      `;
      if (num === 1) btn.style.right = "56.6%";
      if (num === 2) btn.style.right = "33.55%";
      if (num === 3) btn.style.right = "10.45%";

      btn.textContent = "🌴 Retraite";

      btn.addEventListener("mouseenter", () => {
        btn.style.background = "orangered";
        btn.style.color = "black";
        btn.style.fontWeight = "bold";

        btn.style.transition =
          "background 0.1s ease-in-out, color 0.1s ease-in-out";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.background = "rgba(0,0,0,0.85)";
        btn.style.color = "rgba(255,69,0,0.4)";
        btn.style.fontWeight = "bold";

        btn.style.transition =
          "background 0.1s ease-in-out, color 0.1s ease-in-out";
      });

      btn.addEventListener("click", () => partirRetraite(num));
      banner.appendChild(btn);
    });
  }

  /* -------------------------------------------------------- */
  /* INTERSECTION OBSERVER                                    */
  /* -------------------------------------------------------- */

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;

          BUREAUX.forEach((config) => createPile(config));
          BUREAUX.forEach((config, index) => {
            setTimeout(() => startPaperLoop(config), index * 1500);
          });

          initClocks();
          initSmqLogo();
          initHeartbeat();
          initRetraiteButtons();
          EMPLOYES.forEach((emp) => {
            if (!emp.nom) {
              laisserPosteVacant(emp.num);
              return;
            }

            const nameEl = getNameEl(emp.num);

            if (nameEl) {
              nameEl.textContent = emp.nom;
            }

            updateBonusWindow(emp.num);
          });

          observer.unobserve(banner);
          observer.disconnect();
        }
      });
    },
    { threshold: 0.1 },
  );

  observer.observe(banner);

  /* PAUSE HORS ECRAN ET CHANGEMENT D'ONGLET */

  const gameTimers = new Map();
  const pausedAnimations = new Set();
  let nextTimerId = 1;
  let gamePaused = false;
  let bannerVisible = false;

  function armGameTimer(timer) {
    timer.startedAt = performance.now();

    timer.nativeId = window.setTimeout(() => {
      if (document.hidden || !bannerVisible) {
        pauseGame();
        return;
      }

      timer.nativeId = null;

      if (timer.repeat) {
        timer.remaining = timer.delay;
      } else {
        gameTimers.delete(timer.id);
      }

      try {
        timer.callback(...timer.args);
      } finally {
        if (timer.repeat && gameTimers.has(timer.id) && !gamePaused) {
          armGameTimer(timer);
        }
      }
    }, timer.remaining);
  }

  function createGameTimer(callback, delay, repeat, args) {
    const timer = {
      id: nextTimerId++,
      callback,
      args,
      delay: Math.max(repeat ? 1 : 0, Number(delay) || 0),
      repeat,
      nativeId: null,
      startedAt: 0,
      remaining: 0,
    };

    timer.remaining = timer.delay;
    gameTimers.set(timer.id, timer);

    if (!gamePaused) armGameTimer(timer);

    return timer.id;
  }

  function setTimeout(callback, delay = 0, ...args) {
    return createGameTimer(callback, delay, false, args);
  }

  function setInterval(callback, delay = 0, ...args) {
    return createGameTimer(callback, delay, true, args);
  }

  function clearTimeout(id) {
    const timer = gameTimers.get(id);
    if (!timer) return;

    window.clearTimeout(timer.nativeId);
    gameTimers.delete(id);
  }

  function pauseGame() {
    if (gamePaused) return;
    gamePaused = true;

    const now = performance.now();

    gameTimers.forEach((timer) => {
      if (timer.nativeId === null) return;

      window.clearTimeout(timer.nativeId);

      timer.remaining = Math.max(0, timer.remaining - (now - timer.startedAt));

      timer.nativeId = null;
    });

    banner.getAnimations({ subtree: true }).forEach((animation) => {
      if (animation.playState !== "running") return;

      const time = animation.currentTime ?? 0;

      animation.pause();
      animation.currentTime = time;
      pausedAnimations.add(animation);
    });
  }

  function resumeGame() {
    if (!gamePaused) return;
    gamePaused = false;

    pausedAnimations.forEach((animation) => {
      if (animation.playState === "paused") {
        animation.play();
      }
    });

    pausedAnimations.clear();

    gameTimers.forEach((timer) => armGameTimer(timer));
  }

  function updateGameVisibility() {
    if (document.hidden || !bannerVisible) {
      pauseGame();
    } else {
      resumeGame();
    }
  }

  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      bannerVisible = entries[entries.length - 1].isIntersecting;
      updateGameVisibility();
    },
    { threshold: 0 },
  );

  document.addEventListener("visibilitychange", updateGameVisibility);

  visibilityObserver.observe(banner);
  updateGameVisibility();
}
