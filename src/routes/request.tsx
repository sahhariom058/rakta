import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Ambulance, MapPinned, MessageCircle, RadioTower } from "lucide-react";
import { RaktaLayout } from "@/components/RaktaLayout";
import { BloodRequestForm } from "@/components/RaktaForms";
import type { Lang } from "@/lib/rakta-copy";

export const Route = createFileRoute("/request")({
  head: () => ({ meta: [{ title: "Emergency Blood Request | Rakta-Seva Connect" }, { name: "description", content: "Post an urgent hospital blood request and match nearby donors." }, { property: "og:title", content: "Emergency Blood Request" }, { property: "og:description", content: "Find compatible blood donors within 10 km." }] }),
  component: RequestPage,
});

function RequestPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [dark, setDark] = useState(true);
  return (
    <RaktaLayout lang={lang} setLang={setLang} dark={dark} setDark={setDark}>
      <section className="page-gradient min-h-screen py-14">
        <div className="container-rakta grid gap-8 lg:grid-cols-[.82fr_1fr] lg:items-start">
          <div className="premium-card rounded-[2rem] p-7 md:p-9">
            <p className="font-black text-primary">CRITICAL REQUEST</p>
            <h1 className="section-title mt-3">Post once. Reach matched donors fast.</h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">A clear hospital request panel with smart matching, WhatsApp alerts, and location-ready workflow.</p>
            <div className="mt-8 grid gap-4">
              {[ [Ambulance, "Critical blood request"], [MapPinned, "10 km donor matching"], [MessageCircle, "WhatsApp alert action"], [RadioTower, "Live response tracking"] ].map(([Icon, text]) => <div key={String(text)} className="rounded-2xl bg-secondary p-4 font-black"><Icon className="mb-2 text-primary" />{String(text)}</div>)}
            </div>
          </div>
          <BloodRequestForm />
        </div>
      </section>
    </RaktaLayout>
  );
}
