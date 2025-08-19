// styles/fonts.ts
import { Inter } from "next/font/google";

/**
 * Font self-hosted prin next/font (fără link-uri Google în <head>)
 * - preload automat
 * - display: swap (zero FOIT)
 */
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // ajustează dacă folosești alte greutăți
  display: "swap",
  variable: "--font-inter",
});
