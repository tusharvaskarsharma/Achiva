-- Update RLS policies to allow admins to view all portfolios and analytics

-- Portfolio policies for admins
CREATE POLICY "Admins can view all portfolios"
ON public.portfolios
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Analytics policies for admins  
CREATE POLICY "Admins can view all analytics"
ON public.analytics
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));