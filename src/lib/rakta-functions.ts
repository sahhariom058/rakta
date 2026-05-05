import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const bloodGroup = z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);
const donorFilters = z.object({
  query: z.string().trim().max(160).optional(),
  bloodGroup: z.string().trim().optional(),
  availability: z.string().trim().optional(),
});

function maskName(name: string) {
  const first = name.trim().charAt(0).toUpperCase() || "D";
  return `${first}${"•".repeat(Math.max(name.trim().split(" ")[0]?.length - 1, 3))}`;
}

function normalizeAvailability(value: string | null) {
  return value === "available" ? "Available" : "Not Available";
}

const donorRegistrationSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(20),
  bloodGroup,
  lastDonationDate: z.string().optional(),
  cityArea: z.string().trim().min(2).max(160),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  profilePhotoUrl: z.string().url().optional().or(z.literal("")),
});

const bloodRequestSchema = z.object({
  requiredBloodGroup: bloodGroup,
  unitsNeeded: z.number().int().min(1).max(20),
  hospitalName: z.string().trim().min(2).max(160),
  hospitalLocation: z.string().trim().min(2).max(200),
  contactName: z.string().trim().min(2).max(120),
  contactPhone: z.string().trim().min(7).max(20),
  contactEmail: z.string().email().max(255).optional().or(z.literal("")),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type DonorRegistrationInput = z.infer<typeof donorRegistrationSchema>;
type BloodRequestInput = z.infer<typeof bloodRequestSchema>;
type DonorFilters = z.infer<typeof donorFilters>;

function createPublicBackendClient() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function registerDonor(input: DonorRegistrationInput) {
    const parsed = donorRegistrationSchema.safeParse(input);
    if (!parsed.success) return { ok: false, message: "Please check the donor details and try again." };
    const data = parsed.data;
    try {
      const supabase = createPublicBackendClient();
      if (!supabase) return { ok: false, message: "Backend settings are missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify, then deploy again." };

      const { error } = await supabase.from("donors").insert({
        full_name: data.fullName,
        phone: data.phone,
        blood_group: data.bloodGroup,
        last_donation_date: data.lastDonationDate || null,
        city_area: data.cityArea,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        profile_photo_url: data.profilePhotoUrl || null,
        availability: "available",
      });
      if (error) return { ok: false, message: "Could not register donor right now. Please check the details and try again." };
      return { ok: true, message: "Donor registered successfully. Redirecting to live donor list..." };
    } catch {
      return { ok: false, message: "Donor registration is temporarily unavailable. Please try again shortly." };
    }
}

export async function createBloodRequest(input: BloodRequestInput) {
    const parsed = bloodRequestSchema.safeParse(input);
    if (!parsed.success) return { ok: false, message: "Please check the emergency request details and try again.", matches: [] };
    const data = parsed.data;
    try {
      const supabase = createPublicBackendClient();
      if (!supabase) return { ok: false, message: "Backend settings are missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify, then deploy again.", matches: [] };

      const { error } = await supabase
        .from("blood_requests")
        .insert({
          required_blood_group: data.requiredBloodGroup,
          units_needed: data.unitsNeeded,
          hospital_name: data.hospitalName,
          hospital_location: data.hospitalLocation,
          contact_name: data.contactName,
          contact_phone: data.contactPhone,
          contact_email: data.contactEmail || null,
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
        });
      if (error) return { ok: false, message: "Emergency request could not be posted. Please check the details and try again.", matches: [] };

      const { data: donors } = await supabase
        .from("donor_public_cards")
        .select("donor_id, masked_name, blood_group, city_area, availability")
        .eq("blood_group", data.requiredBloodGroup)
        .eq("availability", "available")
        .ilike("city_area", `%${data.hospitalLocation}%`)
        .limit(20);

      return {
        ok: true,
        message: `${donors?.length ?? 0} matching donors found for ${data.requiredBloodGroup} in ${data.hospitalLocation}.`,
        matches: ((donors as any[]) ?? []).map((donor) => ({
          id: donor.donor_id,
          name: donor.masked_name,
          group: donor.blood_group,
          area: donor.city_area,
          status: normalizeAvailability(donor.availability),
        })),
      };
    } catch {
      return { ok: false, message: "Emergency request service is temporarily unavailable.", matches: [] };
    }
}

export async function getPublicDonors(input: DonorFilters) {
    const parsed = donorFilters.safeParse(input);
    const data = parsed.success ? parsed.data : {};
    try {
      const supabase = createPublicBackendClient();
      if (!supabase) return { donors: [], total: 0, error: "Backend settings are missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify." };

      let query = supabase
        .from("donor_public_cards")
        .select("donor_id, masked_name, blood_group, city_area, availability, is_verified", { count: "exact" })
        .order("donor_created_at", { ascending: false })
        .limit(150);

      if (data.bloodGroup && data.bloodGroup !== "All") query = query.eq("blood_group", data.bloodGroup as any);
      if (data.availability && data.availability !== "All") query = query.eq("availability", data.availability === "Available" ? "available" : "not_available");
      if (data.query) query = query.ilike("city_area", `%${data.query}%`);

      const { data: donors, error, count } = await query;
      if (error) return { donors: [], total: 0, error: "Unable to load donors right now." };
      return {
        donors: ((donors as any[]) ?? []).map((donor) => ({
          id: donor.donor_id,
          name: donor.masked_name,
          group: donor.blood_group,
          area: donor.city_area,
          status: normalizeAvailability(donor.availability),
          isVerified: donor.is_verified,
        })),
        total: count ?? donors?.length ?? 0,
        error: null,
      };
    } catch {
      return { donors: [], total: 0, error: "Backend connection is not available right now." };
    }
}
