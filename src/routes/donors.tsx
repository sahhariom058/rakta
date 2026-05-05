import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Search, ShieldCheck, UsersRound } from "lucide-react";
import { RaktaLayout } from "@/components/RaktaLayout";
import { bloodGroups } from "@/lib/rakta-data";
import type { Lang } from "@/lib/rakta-copy";
import { getPublicDonors } from "@/lib/rakta-functions";

export const Route = createFileRoute("/donors")({
  head: () => ({ meta: [{ title: "Donor List | Rakta-Seva Connect" }, { name: "description", content: "Search privacy-safe registered blood donors by group, area, and availability." }, { property: "og:title", content: "Rakta-Seva Donor List" }, { property: "og:description", content: "Privacy-safe donor cards with blood group and area filters." }] }),
  component: DonorsPage,
});

function DonorsPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [dark, setDark] = useState(true);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState("");
  const [donors, setDonors] = useState<Array<{ id: string; name: string; group: string; area: string; status: string }>>([]);
  const [total, setTotal] = useState(0);
  const searchKey = useMemo(() => ({ query, bloodGroup: group, availability }), [query, group, availability]);

  useEffect(() => {
    let mounted = true;
    setIsPending(true);
    (async () => {
      try {
        const result = await getPublicDonors(searchKey);
        if (!mounted) return;
        setDonors(result.donors);
        setTotal(result.total);
        setError(result.error ?? "");
      } catch {
        if (mounted) setError("Unable to load donors right now.");
      } finally {
        if (mounted) setIsPending(false);
      }
    })();
    return () => { mounted = false; };
  }, [searchKey]);

  const whatsappHref = (bloodGroup: string, area: string) => `https://wa.me/9779817887486?text=${encodeURIComponent(`Hello, I need ${bloodGroup} blood in ${area}. Please help urgently.`)}`;
  return (
    <RaktaLayout lang={lang} setLang={setLang} dark={dark} setDark={setDark}>
      <section className="page-gradient min-h-screen py-14">
        <div className="container-rakta">
          <div className="premium-card rounded-[2rem] p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-black text-primary">DONOR DIRECTORY</p>
                <h1 className="section-title mt-3">{total} privacy-safe donors</h1>
                <p className="mt-4 max-w-2xl text-muted-foreground">Fast cards, no heavy photos, no public phone numbers. Contact opens a secure WhatsApp request path.</p>
              </div>
              <div className="rounded-3xl bg-secondary p-4 text-sm font-black"><ShieldCheck className="mb-2 text-success" /> Privacy protected</div>
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-[1fr_160px_180px]"><label className="field flex items-center gap-2"><Search size={18} /><input value={query} onChange={(e)=>setQuery(e.target.value)} className="w-full bg-transparent outline-none" placeholder="Search city or area" /></label><select className="field" value={group} onChange={(e)=>setGroup(e.target.value)}><option>All</option>{bloodGroups.map((g)=><option key={g}>{g}</option>)}</select><select className="field" value={availability} onChange={(e)=>setAvailability(e.target.value)}><option>All</option><option>Available</option><option>Not Available</option></select></div>
          </div>
          {isPending && <div className="mt-8 flex items-center justify-center gap-3 rounded-3xl bg-secondary p-6 font-black"><span className="spinner" /> Loading live donors...</div>}
          {error && <div className="mt-8 rounded-3xl border border-destructive/40 bg-destructive/10 p-6 font-black text-destructive">{error}</div>}
          {!isPending && !error && donors.length === 0 && <div className="mt-8 rounded-3xl bg-secondary p-8 text-center font-black">No donors found. Try another blood group or city.</div>}
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{donors.map((d)=><article key={d.id} className="premium-card rounded-[1.6rem] p-5 transition-transform hover:-translate-y-1"><div className="flex items-center gap-4"><div className="avatar-gradient flex size-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-black"><UsersRound size={28} /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-2xl font-black">{d.name}</h2><span className="rounded-full bg-primary px-3 py-1 text-sm font-black text-primary-foreground">{d.group}</span></div><p className="truncate text-muted-foreground">{d.area}</p></div></div><p className={d.status === "Available" ? "status-good mt-5 inline-flex rounded-full px-3 py-1 text-sm font-black" : "status-muted mt-5 inline-flex rounded-full px-3 py-1 text-sm font-black"}>{d.status}</p><a className="btn-whatsapp mt-5 w-full" href={whatsappHref(d.group, d.area)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp Contact</a></article>)}</div>
        </div>
      </section>
    </RaktaLayout>
  );
}
