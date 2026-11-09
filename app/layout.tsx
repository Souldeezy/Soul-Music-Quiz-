/* IMPORTS ........................................................................................................... */

import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Alfa_Slab_One, Meow_Script, Rock_Salt } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import ReloadCurrentPageLink from "../components/shared/ReloadCurrentPageLink";
import ResetLocalScoresOnce from "../components/shared/ResetLocalScoresOnce";
import ScrollToTop from "../components/shared/ScrollToTop";
import TypographicLineBreaks from "../components/shared/TypographicLineBreaks";
import "./globals.css";
import "../styles/shared/backToTop.css";

const poiret = localFont({ src: "../public/fonts/poiret-one.woff2", display: "block", variable: "--font-poiret" });
const alfa = Alfa_Slab_One({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-alfa" });
const meow = Meow_Script({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-meow" });
const rock = Rock_Salt({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-rock" });

/* MÉTADONNÉES .......................................................................................................... */

export const metadata: Metadata = {
  title: {
    default: "Soul Music Quiz",
    template: "%s | Soul Music Quiz",
  },
  description: "Quiz, artistes et articles consacrés à la Golden Era de la Soul Music.",
};

/* LAYOUT PRINCIPAL .................................................................................................. */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>

      </head>

      <body className={`${poiret.variable} ${alfa.variable} ${meow.variable} ${rock.variable}`}>
        <ScrollToTop />
        <ReloadCurrentPageLink />
        <ResetLocalScoresOnce />
        <TypographicLineBreaks />
        <Script
          src="https://kit.fontawesome.com/5274ecb80f.js"
          crossOrigin="anonymous"
          data-auto-replace-svg="nest"
          strategy="afterInteractive"
        />

        {children}
        <Analytics />
      </body>
    </html>
  );
}
