import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, BellRing, ClipboardPlus, HeartPulse, ToggleRight } from "lucide-react";
import { RaktaLayout } from "@/components/RaktaLayout";
import { BloodRequestForm, DonorRegistrationForm } from "@/components/RaktaForms";
import type { Lang } from "@/lib/rakta-copy";
import { copy } from "@/lib/rakta-copy";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboards | Rakta-Seva Connect" }, { name: "description", content: "Donor and hospital dashboards for availability, requests, and response tracking." }, { property: "og:title", content: "Rakta-Seva Dashboards" }, { property: "og:description", content: "Manage donor profile, availability, emergency requests, and responses." }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState<"donor" | "hospital">("donor");
  const [available, setAvailable] = useState(true);
  return (
    <RaktaLayout lang={lang} setLang={setLang} dark={dark} setDark={setDark}>
      <section className="page-gradient min-h-screen py-14">
        <div className="container-rakta">
          <div className="premium-card rounded-[2rem] p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div><p className="font-black text-primary">OPERATIONS CENTER</p><h1 className="section-title mt-3">Fast response dashboards</h1><p className="mt-4 max-w-2xl text-muted-foreground">Cleaner colors, lighter cards, and quick actions for donors and hospitals.</p></div>
              <div className="flex rounded-full border border-border bg-glass p-1"><button onClick={()=>setTab("donor")} className={tab === "donor" ? "btn-primary !py-2" : "btn-secondary !border-transparent !py-2"}>Donor</button><button onClick={()=>setTab("hospital")} className={tab === "hospital" ? "btn-primary !py-2" : "btn-secondary !border-transparent !py-2"}>Hospital</button></div>
            </div>
          </div>
          {tab === "donor" ? <div className="mt-6 grid gap-6 lg:grid-cols-[.75fr_1fr]"><div className="grid gap-5"><div className="premium-card rounded-[1.6rem] p-6"><ToggleRight className="text-primary" size={34} /><h2 className="mt-4 text-2xl font-black">Availability</h2><p className="mt-2 text-muted-foreground">Toggle instantly for emergency matching.</p><button onClick={()=>setAvailable(!available)} className={available ? "btn-primary mt-4" : "btn-secondary mt-4"}>{available ? "Available" : "Not Available"}</button></div><div className="premium-card rounded-[1.6rem] p-6"><BellRing className="text-primary" size={34} /><h2 className="mt-4 text-2xl font-black">Emergency Requests</h2><p className="mt-2 text-muted-foreground">2 compatible requests in your city area.</p></div><div className="premium-card rounded-[1.6rem] p-6"><HeartPulse className="text-primary" size={34} /><h2 className="mt-4 text-2xl font-black">Impact</h2><p className="mt-2 text-muted-foreground">Your profile is privacy-safe and ready.</p></div></div><DonorRegistrationForm privacy={copy[lang].privacy} /></div> : <div className="mt-6 grid gap-6 lg:grid-cols-[.75fr_1fr]"><div className="grid gap-5"><div className="premium-card rounded-[1.6rem] p-6"><ClipboardPlus className="text-primary" size={34} /><h2 className="mt-4 text-2xl font-black">Post request</h2><p className="mt-2 text-muted-foreground">Create a request and track matched donor responses.</p></div><div className="premium-card rounded-[1.6rem] p-6"><Activity className="text-primary" size={34} /><h2 className="mt-4 text-2xl font-black">Track responses</h2><p className="mt-2 text-muted-foreground">Open: 3 • Matched: 12 • Fulfilled: 8</p></div></div><BloodRequestForm /></div>}
        </div>
      </section>
    </RaktaLayout>
  );
}
