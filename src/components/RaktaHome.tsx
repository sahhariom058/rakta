import { Link } from "@tanstack/react-router";
import { Ambulance, BellRing, CheckCircle2, HeartPulse, MapPinned, Quote, Search, ShieldCheck, Sparkles, Timer, UserPlus } from "lucide-react";
import type { Lang } from "@/lib/rakta-copy";
import { copy } from "@/lib/rakta-copy";
import { faqs, images, stats } from "@/lib/rakta-data";

export function RaktaHome({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return (
    <>
      <section className="luxury-hero relative min-h-[calc(100vh-4rem)] overflow-hidden text-primary-foreground">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,oklch(0_0_0/.58),transparent_58%)]" />
        <div className="container-rakta relative grid min-h-[calc(100vh-4rem)] items-center gap-10 py-10 lg:grid-cols-[1.02fr_.98fr]">
          <div className="reveal py-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-2 text-sm font-black text-primary-foreground backdrop-blur-xl"><BellRing size={16} /> Real-time life-saving network</div>
            <h1 className="max-w-4xl text-5xl font-black leading-[.92] md:text-7xl lg:text-8xl">{t.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-xl font-semibold text-primary-foreground/78">{t.heroSub} — trusted donor discovery, emergency alerts, and privacy-safe hospital response in one elegant platform.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link className="btn-primary" to="/register"><UserPlus size={19} />{t.donorCta}</Link><Link className="btn-secondary !bg-primary-foreground/10 !text-primary-foreground" to="/request"><Ambulance size={19} />{t.requestCta}</Link></div>
            <div className="mt-9 grid max-w-2xl grid-cols-3 gap-3">{stats.map((s) => <div key={s.label} className="rounded-3xl border border-primary-foreground/14 bg-primary-foreground/8 p-4 backdrop-blur-xl"><p className="text-2xl font-black text-primary-foreground md:text-3xl">{s.value}</p><p className="mt-1 text-xs font-bold text-primary-foreground/65">{s.label}</p></div>)}</div>
          </div>

          <div className="relative hidden lg:block">
            <div className="hero-image-frame rotate-2 overflow-hidden rounded-[2rem] p-3">
              <img src={images.heroImage} alt="Premium blood donation camp" width={1920} height={1080} className="h-[620px] w-full rounded-[1.45rem] object-cover" />
            </div>
            <div className="glass-panel absolute -left-8 top-16 rounded-3xl p-5 text-foreground"><p className="text-sm font-black text-primary">MATCH READY</p><p className="mt-1 text-3xl font-black">07 min</p><p className="text-sm text-muted-foreground">average response</p></div>
            <div className="glass-panel absolute -bottom-4 right-8 rounded-3xl p-5 text-foreground"><p className="mb-3 font-black">Available groups</p><div className="flex flex-wrap gap-2">{["O+", "A-", "B+", "AB+"].map((g) => <span key={g} className="blood-chip">{g}</span>)}</div></div>
          </div>
        </div>
      </section>

      <section className="container-rakta grid gap-8 py-20 lg:grid-cols-[.88fr_1.12fr] lg:items-center">
        <div className="reveal"><p className="font-black text-primary">PREMIUM EMERGENCY CARE NETWORK</p><h2 className="section-title mt-3">{t.aboutTitle}</h2><p className="mt-5 text-lg leading-8 text-muted-foreground">{t.aboutText} The experience is built to feel calm, credible, and fast when a real emergency needs immediate action.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{["Verified hospital workflows", "Public donor privacy", "10 km smart matching", "WhatsApp-ready alerts"].map((item) => <p key={item} className="flex items-center gap-2 font-bold"><CheckCircle2 size={18} className="text-success" />{item}</p>)}</div></div>
        <div className="grid gap-4 sm:grid-cols-2"><img src={images.handsImage} alt="Helping hands with blood donation ribbon" loading="lazy" width={1920} height={1080} className="h-80 rounded-[2rem] object-cover shadow-glass sm:translate-y-10" /><img src={images.teamImage} alt="Medical team" loading="lazy" width={1920} height={1080} className="h-80 rounded-[2rem] object-cover shadow-glass" /></div>
      </section>

      <section className="bg-secondary/45 py-20"><div className="container-rakta"><div className="mx-auto max-w-2xl text-center"><p className="font-black text-primary">THREE STEPS</p><h2 className="section-title mt-3">Emergency matching that feels effortless.</h2></div><div className="mt-10 grid gap-5 md:grid-cols-3">{[[Search,"Hospital posts urgent need","Blood group, units, hospital area and contact are captured securely."],[MapPinned,"System matches nearby donors","Compatible available donors around the hospital are shortlisted."],[HeartPulse,"Alerts go out instantly","WhatsApp and email actions help teams contact donors faster."]].map(([Icon, title, text], i) => <div key={String(title)} className="glass-panel rounded-[2rem] p-7 transition-transform hover:-translate-y-1"><div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Icon size={24} /></div><p className="text-sm font-black text-primary">STEP {i + 1}</p><h3 className="mt-2 text-2xl font-black">{String(title)}</h3><p className="mt-3 text-muted-foreground">{String(text)}</p></div>)}</div></div></section>

      <section className="container-rakta py-20"><div className="glass-panel grid overflow-hidden rounded-[2rem] lg:grid-cols-[.9fr_1.1fr]"><img src={images.emergencyImage} alt="Hospital emergency" loading="lazy" width={1920} height={1080} className="h-full min-h-[360px] object-cover" /><div className="p-8 md:p-12"><p className="font-black text-primary">LIVE RESPONSE LAYER</p><h2 className="section-title mt-3">Built for urgency, designed for trust.</h2><div className="mt-8 grid gap-4">{[[Timer,"Fast response tracking"],[ShieldCheck,"Exact donor location hidden"],[Sparkles,"Luxury-grade healthcare interface"]].map(([Icon, text]) => <p key={String(text)} className="flex items-center gap-3 rounded-2xl bg-secondary p-4 font-black"><Icon className="text-primary" />{String(text)}</p>)}</div></div></div></section>

      <section className="container-rakta py-20"><h2 className="section-title">Testimonials</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{["A matched O- donor reached our ER in minutes.", "The privacy-first donor list helped us act fast.", "I changed availability on my phone and got one critical call."].map((q, i) => <article key={q} className="glass-panel rounded-3xl p-6"><Quote className="text-primary" /><p className="mt-4 text-lg font-bold">“{q}”</p><p className="mt-5 text-sm text-muted-foreground">Verified user #{i + 1}</p></article>)}</div></section>

      <section className="container-rakta pb-24"><h2 className="section-title">FAQ</h2><div className="mt-8 grid gap-4">{faqs.map(([q,a]) => <details key={q} className="glass-panel rounded-2xl p-5"><summary className="cursor-pointer font-black">{q}</summary><p className="mt-3 text-muted-foreground">{a}</p></details>)}</div><p className="mt-8 flex items-center gap-2 text-sm font-bold text-muted-foreground"><ShieldCheck className="text-success" /> Full phone numbers and exact locations are never shown publicly.</p></section>
    </>
  );
}
