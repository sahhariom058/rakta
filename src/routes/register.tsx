import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, HeartHandshake, ShieldCheck } from "lucide-react";
import { RaktaLayout } from "@/components/RaktaLayout";
import { DonorRegistrationForm } from "@/components/RaktaForms";
import type { Lang } from "@/lib/rakta-copy";
import { copy } from "@/lib/rakta-copy";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register as Donor | Rakta-Seva Connect" }, { name: "description", content: "Securely register as a blood donor for emergency matching." }, { property: "og:title", content: "Register as Donor" }, { property: "og:description", content: "Join Rakta-Seva Connect as a privacy-protected donor." }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [dark, setDark] = useState(true);
  return (
    <RaktaLayout lang={lang} setLang={setLang} dark={dark} setDark={setDark}>
      <section className="page-gradient min-h-screen py-14">
        <div className="container-rakta grid gap-8 lg:grid-cols-[.82fr_1fr] lg:items-start">
          <div className="premium-card rounded-[2rem] p-7 md:p-9">
            <p className="font-black text-primary">DONOR REGISTRATION</p>
            <h1 className="section-title mt-3">A premium, private donor profile in seconds.</h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">Clean form, secure storage, and public privacy protection so hospitals can act fast without exposing your sensitive details.</p>
            <div className="mt-8 grid gap-4">
              {[ [HeartHandshake, "Life-saving donor network"], [ShieldCheck, "Phone number hidden publicly"], [BadgeCheck, "Hospital-safe contact workflow"] ].map(([Icon, text]) => <div key={String(text)} className="rounded-2xl bg-secondary p-4 font-black"><Icon className="mb-2 text-primary" />{String(text)}</div>)}
            </div>
          </div>
          <DonorRegistrationForm privacy={copy[lang].privacy} />
        </div>
      </section>
    </RaktaLayout>
  );
}
