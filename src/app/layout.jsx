import "@/styles/globals.css";
import "@/styles/prosemirror.css";
// import "katex/dist/katex.min.css"; // Removed to avoid CSS ESM loader error

import Providers from "@/app/providers";
import { playfair, montserrat, cal, inter, ysabeau } from "@/styles/fonts";
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
      <html
      lang="en"
      className={`${montserrat.variable} ${playfair.variable} ${inter.variable} ${cal.variable} ${ysabeau.variable}`}
      suppressHydrationWarning
    >
      <body className="font-default bg-white min-h-screen flex flex-col" suppressHydrationWarning>
        {/* Globally load Twitter widgets to ensure availability on blog pages */}
        <Script src="https://platform.twitter.com/widgets.js" strategy="afterInteractive" />
        <Providers>
          <div className="flex-1 flex flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
