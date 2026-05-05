-- Allow public donor registration without exposing sensitive donor rows
DROP POLICY IF EXISTS "Public can register donors" ON public.donors;
CREATE POLICY "Public can register donors"
ON public.donors
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(full_name)) >= 2
  AND length(trim(phone)) >= 7
  AND length(trim(city_area)) >= 2
);

-- Allow public emergency request submission without exposing request details
DROP POLICY IF EXISTS "Public can create blood requests" ON public.blood_requests;
CREATE POLICY "Public can create blood requests"
ON public.blood_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  units_needed BETWEEN 1 AND 20
  AND length(trim(hospital_name)) >= 2
  AND length(trim(hospital_location)) >= 2
  AND length(trim(contact_name)) >= 2
  AND length(trim(contact_phone)) >= 7
);

-- Privacy-safe donor directory for public pages. It never returns phone numbers or exact sensitive profile data.
CREATE OR REPLACE FUNCTION public.get_public_donors(
  _query text DEFAULT NULL,
  _blood_group text DEFAULT NULL,
  _availability text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  masked_name text,
  blood_group text,
  city_area text,
  availability text,
  is_verified boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    d.id,
    upper(left(trim(d.full_name), 1)) || repeat('•', greatest(length(split_part(trim(d.full_name), ' ', 1)) - 1, 3)) AS masked_name,
    d.blood_group::text,
    d.city_area,
    d.availability::text,
    d.is_verified
  FROM public.donors d
  WHERE
    (_blood_group IS NULL OR _blood_group = '' OR _blood_group = 'All' OR d.blood_group::text = _blood_group)
    AND (_availability IS NULL OR _availability = '' OR _availability = 'All' OR d.availability::text = CASE WHEN _availability = 'Available' THEN 'available' ELSE 'not_available' END)
    AND (
      _query IS NULL
      OR _query = ''
      OR d.city_area ILIKE '%' || _query || '%'
      OR d.full_name ILIKE '%' || _query || '%'
    )
  ORDER BY d.created_at DESC
  LIMIT 150;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_donors(text, text, text) TO anon, authenticated;

-- Public emergency request flow with privacy-safe matching. It stores the request and returns masked matches only.
CREATE OR REPLACE FUNCTION public.create_public_blood_request(
  _required_blood_group text,
  _units_needed integer,
  _hospital_name text,
  _hospital_location text,
  _contact_name text,
  _contact_phone text,
  _contact_email text DEFAULT NULL,
  _latitude double precision DEFAULT NULL,
  _longitude double precision DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  masked_name text,
  blood_group text,
  city_area text,
  availability text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _request_id uuid;
BEGIN
  IF _units_needed < 1 OR _units_needed > 20
    OR length(trim(_hospital_name)) < 2
    OR length(trim(_hospital_location)) < 2
    OR length(trim(_contact_name)) < 2
    OR length(trim(_contact_phone)) < 7 THEN
    RAISE EXCEPTION 'Invalid emergency request details';
  END IF;

  INSERT INTO public.blood_requests (
    required_blood_group,
    units_needed,
    hospital_name,
    hospital_location,
    contact_name,
    contact_phone,
    contact_email,
    latitude,
    longitude
  )
  VALUES (
    _required_blood_group::blood_group,
    _units_needed,
    _hospital_name,
    _hospital_location,
    _contact_name,
    _contact_phone,
    NULLIF(_contact_email, ''),
    _latitude,
    _longitude
  )
  RETURNING blood_requests.id INTO _request_id;

  INSERT INTO public.request_matches (request_id, donor_id)
  SELECT _request_id, d.id
  FROM public.donors d
  WHERE d.blood_group::text = _required_blood_group
    AND d.availability::text = 'available'
    AND d.city_area ILIKE '%' || _hospital_location || '%'
  LIMIT 20;

  RETURN QUERY
  SELECT
    d.id,
    upper(left(trim(d.full_name), 1)) || repeat('•', greatest(length(split_part(trim(d.full_name), ' ', 1)) - 1, 3)) AS masked_name,
    d.blood_group::text,
    d.city_area,
    d.availability::text
  FROM public.donors d
  WHERE d.blood_group::text = _required_blood_group
    AND d.availability::text = 'available'
    AND d.city_area ILIKE '%' || _hospital_location || '%'
  ORDER BY d.created_at DESC
  LIMIT 20;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_public_blood_request(text, integer, text, text, text, text, text, double precision, double precision) TO anon, authenticated;