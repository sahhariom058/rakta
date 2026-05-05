-- Remove public security-definer helper functions from the exposed API surface
DROP FUNCTION IF EXISTS public.get_public_donors(text, text, text);
DROP FUNCTION IF EXISTS public.create_public_blood_request(text, integer, text, text, text, text, text, double precision, double precision);

-- Privacy-safe public donor cards. No phone numbers, email, coordinates, or full names are stored here.
CREATE TABLE IF NOT EXISTS public.donor_public_cards (
  donor_id uuid PRIMARY KEY,
  masked_name text NOT NULL,
  blood_group text NOT NULL,
  city_area text NOT NULL,
  availability text NOT NULL,
  is_verified boolean NOT NULL DEFAULT false,
  donor_created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.donor_public_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view privacy-safe donor cards" ON public.donor_public_cards;
CREATE POLICY "Anyone can view privacy-safe donor cards"
ON public.donor_public_cards
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Only backend can write donor cards" ON public.donor_public_cards;
CREATE POLICY "Only backend can write donor cards"
ON public.donor_public_cards
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.sync_donor_public_card()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.donor_public_cards WHERE donor_id = OLD.id;
    RETURN OLD;
  END IF;

  INSERT INTO public.donor_public_cards (
    donor_id,
    masked_name,
    blood_group,
    city_area,
    availability,
    is_verified,
    donor_created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    upper(left(trim(NEW.full_name), 1)) || repeat('•', greatest(length(split_part(trim(NEW.full_name), ' ', 1)) - 1, 3)),
    NEW.blood_group::text,
    NEW.city_area,
    NEW.availability::text,
    NEW.is_verified,
    NEW.created_at,
    now()
  )
  ON CONFLICT (donor_id) DO UPDATE SET
    masked_name = EXCLUDED.masked_name,
    blood_group = EXCLUDED.blood_group,
    city_area = EXCLUDED.city_area,
    availability = EXCLUDED.availability,
    is_verified = EXCLUDED.is_verified,
    donor_created_at = EXCLUDED.donor_created_at,
    updated_at = now();

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_donor_public_card() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS sync_donor_public_card_trigger ON public.donors;
CREATE TRIGGER sync_donor_public_card_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.donors
FOR EACH ROW
EXECUTE FUNCTION public.sync_donor_public_card();

INSERT INTO public.donor_public_cards (
  donor_id,
  masked_name,
  blood_group,
  city_area,
  availability,
  is_verified,
  donor_created_at,
  updated_at
)
SELECT
  d.id,
  upper(left(trim(d.full_name), 1)) || repeat('•', greatest(length(split_part(trim(d.full_name), ' ', 1)) - 1, 3)),
  d.blood_group::text,
  d.city_area,
  d.availability::text,
  d.is_verified,
  d.created_at,
  now()
FROM public.donors d
ON CONFLICT (donor_id) DO UPDATE SET
  masked_name = EXCLUDED.masked_name,
  blood_group = EXCLUDED.blood_group,
  city_area = EXCLUDED.city_area,
  availability = EXCLUDED.availability,
  is_verified = EXCLUDED.is_verified,
  donor_created_at = EXCLUDED.donor_created_at,
  updated_at = now();

CREATE INDEX IF NOT EXISTS idx_donor_public_cards_blood_group ON public.donor_public_cards (blood_group);
CREATE INDEX IF NOT EXISTS idx_donor_public_cards_availability ON public.donor_public_cards (availability);
CREATE INDEX IF NOT EXISTS idx_donor_public_cards_created_at ON public.donor_public_cards (donor_created_at DESC);