CREATE TYPE public.blood_group AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE public.availability_status AS ENUM ('available', 'not_available');
CREATE TYPE public.request_status AS ENUM ('open', 'matched', 'fulfilled', 'cancelled');
CREATE TYPE public.app_role AS ENUM ('admin', 'hospital', 'donor');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE TABLE public.donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 20),
  blood_group public.blood_group NOT NULL,
  last_donation_date DATE,
  city_area TEXT NOT NULL CHECK (char_length(city_area) BETWEEN 2 AND 160),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  profile_photo_url TEXT,
  availability public.availability_status NOT NULL DEFAULT 'available',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.blood_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_user_id UUID,
  required_blood_group public.blood_group NOT NULL,
  units_needed INTEGER NOT NULL CHECK (units_needed BETWEEN 1 AND 20),
  hospital_name TEXT NOT NULL CHECK (char_length(hospital_name) BETWEEN 2 AND 160),
  hospital_location TEXT NOT NULL CHECK (char_length(hospital_location) BETWEEN 2 AND 200),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  contact_name TEXT NOT NULL CHECK (char_length(contact_name) BETWEEN 2 AND 120),
  contact_phone TEXT NOT NULL CHECK (char_length(contact_phone) BETWEEN 7 AND 20),
  contact_email TEXT CHECK (contact_email IS NULL OR char_length(contact_email) <= 255),
  urgency TEXT NOT NULL DEFAULT 'critical',
  status public.request_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.request_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  donor_id UUID NOT NULL REFERENCES public.donors(id) ON DELETE CASCADE,
  distance_km NUMERIC(6,2),
  response_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (request_id, donor_id)
);

ALTER TABLE public.request_matches ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_donors_updated_at
BEFORE UPDATE ON public.donors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blood_requests_updated_at
BEFORE UPDATE ON public.blood_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_donors_blood_group ON public.donors (blood_group);
CREATE INDEX idx_donors_availability ON public.donors (availability);
CREATE INDEX idx_donors_city_area ON public.donors (city_area);
CREATE INDEX idx_blood_requests_status ON public.blood_requests (status);
CREATE INDEX idx_request_matches_request_id ON public.request_matches (request_id);

CREATE VIEW public.public_donor_directory AS
SELECT
  id,
  concat(left(full_name, 1), repeat('•', greatest(char_length(split_part(full_name, ' ', 1)) - 1, 2))) AS masked_name,
  blood_group,
  city_area,
  profile_photo_url,
  availability,
  is_verified,
  created_at
FROM public.donors
WHERE availability = 'available';

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Donors can view own sensitive profile"
ON public.donors
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'hospital'));

CREATE POLICY "Donors can update own profile"
ON public.donors
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage donors"
ON public.donors
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Hospitals and admins can view requests"
ON public.blood_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'hospital') OR public.has_role(auth.uid(), 'admin') OR auth.uid() = hospital_user_id);

CREATE POLICY "Hospitals and admins can manage requests"
ON public.blood_requests
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'hospital') OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'hospital') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Hospitals and admins can view matches"
ON public.request_matches
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'hospital') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage matches"
ON public.request_matches
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.public_donor_directory TO anon, authenticated;