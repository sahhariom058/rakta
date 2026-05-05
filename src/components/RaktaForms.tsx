import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, Crosshair, MapPin, MessageCircle, ShieldCheck, Upload } from "lucide-react";
import { bloodGroups } from "@/lib/rakta-data";
import { registerDonor, createBloodRequest } from "@/lib/rakta-functions";

export function DonorRegistrationForm({ privacy }: { privacy: string }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [location, setLocation] = useState<{ lat?: number; lng?: number }>({});

  async function submit(formData: FormData) {
    const fullName = String(formData.get("fullName") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const cityArea = String(formData.get("cityArea") || "").trim();
    setError("");
    setMessage("");
    if (fullName.length < 2 || phone.length < 7 || cityArea.length < 2) {
      setError("Please enter a valid name, phone number, and city/area.");
      return;
    }
    setIsPending(true);
    try {
      const result = await registerDonor({
        fullName,
        phone,
        bloodGroup: String(formData.get("bloodGroup") || "O+") as any,
        lastDonationDate: String(formData.get("lastDonationDate") || ""),
        cityArea,
        latitude: location.lat,
        longitude: location.lng,
        profilePhotoUrl: "",
      });
      if (!result.ok) return setError(result.message);
      setMessage(result.message);
      window.setTimeout(() => navigate({ to: "/donors" }), 700);
    } catch {
      setError("Registration is temporarily unavailable. Please check the connection and try again.");
    } finally {
      setIsPending(false);
    }
  }

  function detect() {
    navigator.geolocation?.getCurrentPosition((pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }));
  }

  return (
    <form action={submit} className="glass-panel grid gap-4 rounded-3xl p-5 md:p-8">
      <input className="field" name="fullName" placeholder="Name" required minLength={2} maxLength={120} />
      <input className="field" name="phone" placeholder="Phone Number" required minLength={7} maxLength={20} />
      <select className="field" name="bloodGroup" required>{bloodGroups.map((g) => <option key={g}>{g}</option>)}</select>
      <label className="field flex items-center gap-2"><Calendar size={18} /> <input className="w-full bg-transparent outline-none" name="lastDonationDate" type="date" /></label>
      <div className="grid gap-3 md:grid-cols-[1fr_auto]"><input className="field" name="cityArea" placeholder="City / Area" required /><button type="button" onClick={detect} className="btn-secondary"><Crosshair size={18} /> Auto-detect</button></div>
      <label className="field flex cursor-pointer items-center gap-2"><Upload size={18} /> Profile Photo Upload<input className="hidden" type="file" accept="image/*" /></label>
      <p className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck size={18} className="text-success" />{privacy}</p>
      <button className="btn-primary min-h-12" type="submit" disabled={isPending}>{isPending ? <span className="spinner" /> : null}{isPending ? "Saving..." : "Register as Donor"}</button>
      {message && <p className="status-good rounded-2xl p-4 font-bold">{message}</p>}
      {error && <p className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 font-bold text-destructive">{error}</p>}
    </form>
  );
}

export function BloodRequestForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [request, setRequest] = useState({ group: "O+", location: "" });
  const [matches, setMatches] = useState<Array<{ id: string; name: string; group: string; area: string; status: string }>>([]);
  const [isPending, setIsPending] = useState(false);
  async function submit(formData: FormData) {
    const group = String(formData.get("bloodGroup") || "O+");
    const hospitalLocation = String(formData.get("hospitalLocation") || "").trim();
    const hospitalName = String(formData.get("hospitalName") || "").trim();
    const contactName = String(formData.get("contactName") || "").trim();
    const contactPhone = String(formData.get("contactPhone") || "").trim();
    setRequest({ group, location: hospitalLocation });
    setError("");
    setMessage("");
    if (hospitalName.length < 2 || hospitalLocation.length < 2 || contactName.length < 2 || contactPhone.length < 7) {
      setError("Please enter valid hospital, location, contact name, and phone details.");
      return;
    }
    setIsPending(true);
    try {
      const result = await createBloodRequest({
        requiredBloodGroup: group as any,
        unitsNeeded: Number(formData.get("units") || 1),
        hospitalName,
        hospitalLocation,
        contactName,
        contactPhone,
        contactEmail: String(formData.get("contactEmail") || ""),
      });
      if (!result.ok) return setError(result.message);
      setMatches(result.matches ?? []);
      setMessage(result.message);
    } catch {
      setError("Emergency request could not be submitted right now. Please try again.");
    } finally {
      setIsPending(false);
    }
  }
  const waMessage = encodeURIComponent(`Hello, I need ${request.group} blood in ${request.location || "my location"}. Please help urgently.`);
  const wa = `https://wa.me/9779817887486?text=${waMessage}`;
  return (
    <form action={submit} className="glass-panel grid gap-4 rounded-3xl p-5 md:p-8">
      <select className="field" name="bloodGroup" required>{bloodGroups.map((g) => <option key={g}>{g}</option>)}</select>
      <input className="field" name="units" type="number" min="1" max="20" placeholder="Units Needed" required />
      <input className="field" name="hospitalName" placeholder="Hospital Name" required />
      <label className="field flex items-center gap-2"><MapPin size={18} /> <input className="w-full bg-transparent outline-none" name="hospitalLocation" placeholder="Hospital Location / Google Maps picker" required /></label>
      <input className="field" name="contactName" placeholder="Contact Person" required />
      <input className="field" name="contactPhone" placeholder="Contact Phone" required />
      <input className="field" name="contactEmail" type="email" placeholder="Contact Email" />
      <button className="btn-primary min-h-12" type="submit" disabled={isPending}>{isPending ? <span className="spinner" /> : null}{isPending ? "Matching donors..." : "Post Emergency Request"}</button>
      <a className="btn-whatsapp" href={wa} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp Alert</a>
      {message && <p className="status-good rounded-2xl p-4 font-bold">{message}</p>}
      {error && <p className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 font-bold text-destructive">{error}</p>}
      {matches.length > 0 && <div className="grid gap-3 rounded-3xl bg-secondary p-4"><p className="font-black">Matched donors</p>{matches.map((d) => <div key={d.id} className="flex items-center justify-between gap-3 rounded-2xl bg-card p-3"><div><p className="font-black">{d.name} • {d.group}</p><p className="text-sm text-muted-foreground">{d.area}</p></div><a className="btn-whatsapp !px-3 !py-2 text-sm" href={wa} target="_blank" rel="noreferrer"><MessageCircle size={16} /></a></div>)}</div>}
    </form>
  );
}
