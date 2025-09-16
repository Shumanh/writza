import { Crimson_Text, Inconsolata, Inter, Playfair_Display, Montserrat } from "next/font/google";
// Local CalSans is not present; map title font to premium fonts
export const cal = Playfair_Display({ 
  variable: "--font-title", 
  subsets: ["latin"],
  display: "swap"
});

export const crimsonBold = Crimson_Text({
  weight: "700",
  variable: "--font-title",
  subsets: ["latin"],
});

export const inter = Montserrat({
  variable: "--font-default",
  subsets: ["latin"],
  display: "swap"
});

export const inconsolataBold = Inconsolata({
  weight: "700",
  variable: "--font-title",
  subsets: ["latin"],
});

export const crimson = Crimson_Text({
  weight: "400",
  variable: "--font-default",
  subsets: ["latin"],
});

export const inconsolata = Inconsolata({
  variable: "--font-default",
  subsets: ["latin"],
});

export const playfair = Playfair_Display({
  variable: "--font-premium-title",
  subsets: ["latin"],
  display: "swap"
});

export const montserrat = Montserrat({
  variable: "--font-premium-body",
  subsets: ["latin"],
  display: "swap"
});

export const titleFontMapper = {
  Default: cal.variable,
  Serif: crimsonBold.variable,
  Mono: inconsolataBold.variable,
  Premium: playfair.variable
};

export const defaultFontMapper = {
  Default: inter.variable,
  Serif: crimson.variable,
  Mono: inconsolata.variable,
  Premium: montserrat.variable
};