import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Activity, Droplets, Languages, Mail, Menu, Moon, Phone, Sun, X } from "lucide-react";
import type { Lang } from "@/lib/rakta-copy";
import { copy } from "@/lib/rakta-copy";

export function RaktaLayout({ children, lang, setLang, dark, setDark }: { children: React.ReactNode; lang: Lang; setLang: (lang: Lang) => void; dark: boolean; setDark: (dark: boolean) => void }) {
  const t = copy[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const saved = window.localStorage.getItem("rakta-theme");
    if (saved) setDark(saved === "dark");
  }, [setDark]);

  useEffect(() => {
    window.localStorage.setItem("rakta-theme", dark ? "dark" : "light");
  }, [dark]);

  const navLinks = [
    ["/donors", t.nav.donors],
    ["/register", t.nav.register],
    ["/request", t.nav.request],
    ["/dashboard", t.nav.dashboard],
  ] as const;

  return (
    <div className={dark ? "dark page-shell" : "page-shell"}>
      <header className="topbar fixed inset-x-0 top-0 z-50 border-b border-border/80 backdrop-blur-2xl">
        <nav className="container-rakta flex h-16 items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 font-black tracking-tight text-foreground">
            <span className="pulse-ring flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground"><Droplets size={20} /></span>
            <span>Rakta-Seva <span className="text-primary">Connect</span></span>
          </Link>
          <div className="hidden items-center gap-1 rounded-full border border-border bg-glass p-1 text-sm font-black shadow-glass backdrop-blur-xl md:flex">
            {navLinks.map(([to, label]) => <Link key={to} className="nav-pill" to={to} activeProps={{ className: "nav-pill-active" }}>{label}</Link>)}
          </div>
          <div className="flex items-center gap-2">
            <Link className="btn-primary hidden !px-4 !py-2.5 lg:inline-flex" to="/request">Emergency</Link>
            <button className="btn-secondary !p-3 md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Menu">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
            <button className="btn-secondary !p-3" onClick={() => setLang(lang === "en" ? "hi" : "en")} aria-label="Toggle language"><Languages size={18} /> <span className="hidden sm:inline">{lang === "en" ? "हिंदी" : "EN"}</span></button>
            <button className="btn-secondary !p-3" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          </div>
        </nav>
        <div className={menuOpen ? "mobile-menu mobile-menu-open md:hidden" : "mobile-menu md:hidden"}>
          <div className="container-rakta grid gap-2 py-3">
            {navLinks.map(([to, label]) => <Link key={to} className="nav-pill w-full justify-center" to={to} onClick={() => setMenuOpen(false)} activeProps={{ className: "nav-pill-active" }}>{label}</Link>)}
            <Link className="btn-primary mt-2 w-full" to="/request" onClick={() => setMenuOpen(false)}>Emergency</Link>
          </div>
        </div>
      </header>
      <main className="pt-16">{children}</main>
      <footer className="footer-premium border-t border-border/70 py-10">
        <div className="container-rakta grid gap-6 text-sm md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-base font-black text-foreground">Rakta-Seva Connect</p>
            <p className="mt-1 font-semibold text-muted-foreground">© 2026 Privacy-first emergency blood network.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
            <a className="contact-card" href="tel:+9779817887486" aria-label="Phone +977 9817887486"><Phone size={16} /> <span>{hydrated ? "+977 9817887486" : ""}</span></a>
            <a className="contact-card" href="mailto:sahhariom099@gmail.com" aria-label="Email sahhariom099@gmail.com"><Mail size={16} /> <span>{hydrated ? "sahhariom099@gmail.com" : ""}</span></a>
          </div>
          <p className="flex flex-wrap items-center gap-2 font-bold text-muted-foreground md:col-span-2"><Activity size={16} className="text-primary" /> SSL-ready • Cloud-secured • Real-time matching</p>
        </div>
      </footer>
    </div>
  );
}
