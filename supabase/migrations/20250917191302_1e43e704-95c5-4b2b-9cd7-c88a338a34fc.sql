-- Add verification fields to portfolios table
ALTER TABLE public.portfolios 
ADD COLUMN is_verified boolean DEFAULT false NOT NULL,
ADD COLUMN verified_by uuid REFERENCES auth.users(id),
ADD COLUMN verified_at timestamp with time zone,
ADD COLUMN review_comments text;

-- Create RLS policy for admins to update verification status
CREATE POLICY "Admins can update project verification status"
ON public.portfolios
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));