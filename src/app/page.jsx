"use client";

import { useContext } from "react";
import Link from "next/link";
import { AppContext } from "@/app/providers";

const NAV_LINKS = [
  { href: "/", label: "home" },
  { href: "/blogs/view", label: "blog" },
  { href: "/chat", label: "chat" },
];

const TIMELINE_ITEMS = [
  {
    title: "I build products as DevSG",
    description: (
      <>
        Developer at{" "}
        <a
          href="https://zalient.me/"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          Zalient
        </a>
        , crafting AI-first experiences.
      </>
    ),
  },
  {
    title: "I share backend systems in public",
    description: (
      <>
        Drop by{" "}
        <a
          href="https://x.com/shumanh_"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          @shumanh_
        </a>
        {" "}for daily notes on infrastructure and tooling.
      </>
    ),
  },
  {
    title: "Let's build together",
    description: (
      <>
        Reach me at{" "}
        <a href="mailto:theshumanhere@gmail.com" className="underline underline-offset-4">
          theshumanhere@gmail.com
        </a>
        {" "}or browse code on{" "}
        <a
          href="https://github.com/Shumanh"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          GitHub
        </a>
        .
      </>
    ),
  },
];

export default function Home() {
  const { font } = useContext(AppContext);
  return (
    <div className={`min-h-screen bg-white text-gray-900 font-default ${font}`}>
      <header className="border-b border-gray-200">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-8 text-sm lowercase tracking-wide text-gray-700 font-title">
          {NAV_LINKS.map(({ href, label, external }) =>
            external ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="transition-colors duration-150 hover:text-gray-900"
              >
                {label}
              </a>
            ) : (
              <Link key={label} href={href} className="transition-colors duration-150 hover:text-gray-900">
                {label}
              </Link>
            ),
          )}
        </nav>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-16 px-6 pb-16 pt-20 md:flex-row md:items-start md:gap-24">
        <section className="flex-1">
          <h1 className="text-4xl font-light tracking-tight text-gray-900 sm:text-5xl font-title">Hi, I'm DevSG</h1>

          <div className="relative mt-12 flex flex-col gap-12 border-l border-gray-200 pl-8">
            {TIMELINE_ITEMS.map((item, idx) => (
              <article key={idx} className="group relative">
                <span className="absolute -left-[33px] top-2 block h-3 w-3 rounded-full border border-gray-300 bg-white shadow-sm" />
                <h2 className="text-2xl font-semibold text-gray-700 group-hover:text-gray-900 sm:text-[2.1rem]">
                  {item.title}
                </h2>
                <p className="mt-3 max-w-xl text-base text-gray-500 sm:text-lg">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="flex w-full max-w-sm flex-col gap-12 md:w-72">
          <a
            href="https://x.com/shumanh_"
            target="_blank"
            rel="noreferrer"
            className="flex h-40 w-40 items-center justify-center rounded-3xl bg-black text-6xl font-semibold uppercase text-white shadow-lg transition-transform duration-200 hover:-translate-y-1 md:h-48 md:w-48"
            aria-label="DevSG on X"
          >
            x
          </a>

          <a
            href="https://github.com/Shumanh"
            target="_blank"
            rel="noreferrer"
            className="flex h-40 w-40 items-center justify-center rounded-3xl bg-gray-900 text-5xl font-semibold uppercase text-white shadow-lg transition-transform duration-200 hover:-translate-y-1 md:h-48 md:w-48"
            aria-label="DevSG on GitHub"
          >
            gh
          </a>

        </aside>
      </main>
    </div>
  );
}

