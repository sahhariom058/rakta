import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RaktaLayout } from "@/components/RaktaLayout";
import { RaktaHome } from "@/components/RaktaHome";
import type { Lang } from "@/lib/rakta-copy";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rakta-Seva Connect | Blood Donor Network" },
      { name: "description", content: "Real-time blood donor matching platform for hospitals and emergency requests." },
      { property: "og:title", content: "Rakta-Seva Connect" },
      { property: "og:description", content: "Connect blood donors with hospitals instantly and securely." },
    ],
  }),
  component: Index,
});

function Index() {
  const [lang, setLang] = useState<Lang>("en");
  const [dark, setDark] = useState(true);
  return <RaktaLayout lang={lang} setLang={setLang} dark={dark} setDark={setDark}><RaktaHome lang={lang} /></RaktaLayout>;
}
