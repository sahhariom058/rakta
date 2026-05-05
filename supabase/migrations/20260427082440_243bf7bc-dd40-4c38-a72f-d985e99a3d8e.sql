INSERT INTO storage.buckets (id, name, public)
VALUES ('donor-photos', 'donor-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Donor photos are publicly viewable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'donor-photos');