"use client";

import { Fragment, useEffect } from "react";

import initEmployeeGame from "../../../scripts/legal/EmployeeGame";

const EMPLOYEE_IDS = [1, 2, 3];

const MOODS = ["faim", "super", "bien", "normal", "drunk", "sad"];

const LUNCH_ITEMS = [
  "lunch-bag",
  "cafe",
  "soda",
  "juice",
  "beer",
  "lunch-chicken",
  "lunch-shrimp",
  "lunch-mac",
  "lunch-dessert",
];

const CLOCKS = [
  { city: "nyc", label: "New York" },
  { city: "paris", label: "Paris" },
  { city: "tokyo", label: "Tokyo" },
];

const DEFAULT_EMPLOYEE_NAMES = ["Donte", "Cornelius", "Buck"];

export default function EmployeeGame({ started, playerName }) {
  useEffect(() => {
    if (!started) return;

    initEmployeeGame(playerName);
  }, [started, playerName]);

  return (
    <>
      {/* DELIVERY................................................................................................... */}

      <div className="effet-employee-papers-1"></div>

      <div className="effet-livreur-1">
        <div className="effet-bag-livreur-1"></div>
      </div>

      {/* PAPER STACKS............................................................................................... */}

      {EMPLOYEE_IDS.map((employeeId) => (
        <div id={`pile-bureau-${employeeId}`} key={employeeId}></div>
      ))}

      {/* SPEECH BUBBLES............................................................................................. */}

      {EMPLOYEE_IDS.map((employeeId) => (
        <div
          className={`effet-bulle-bureau-${employeeId}`}
          key={employeeId}
        >
          {MOODS.map((mood) => (
            <div
              className={`symbole-${mood}-${employeeId}`}
              key={mood}
            ></div>
          ))}
        </div>
      ))}

      {/* LUNCH ITEMS................................................................................................ */}

      {EMPLOYEE_IDS.map((employeeId) => (
        <Fragment key={employeeId}>
          {LUNCH_ITEMS.map((item) => (
            <div className={`effet-${item}-${employeeId}`} key={item}></div>
          ))}
        </Fragment>
      ))}

      {/* CLOCKS..................................................................................................... */}

      <div className="effet-mur-bureau-1">
        <div className="effet-smq-hq-logo">SMQ headquarters</div>
      </div>

      {CLOCKS.map(({ city, label }) => (
        <div className={`effet-horloge-${city}`} key={city}>
          <div className={`effet-ecrito-${city}`}>{label}</div>
          <div className={`effet-heure-${city}`}></div>
        </div>
      ))}

      {/* EMPLOYEES.................................................................................................. */}

      {EMPLOYEE_IDS.map((employeeId, index) => (
        <Fragment key={employeeId}>
          <div className={`effet-bureau-${employeeId}`}></div>
          <div className={`effet-employee-bureau-${employeeId}`}></div>

          <div className={`effet-employee-stats-${employeeId}`}>
            <div className={`effet-employee-name-${employeeId}`}>
              {DEFAULT_EMPLOYEE_NAMES[index]}
            </div>

            <div className={`effet-employee-level-${employeeId}`}>
              Niveau: <span>Nut Head</span>
            </div>

            <div className={`effet-employee-money-${employeeId}`}>
              Money: <span>0 $</span>
            </div>
          </div>
        </Fragment>
      ))}
    </>
  );
}