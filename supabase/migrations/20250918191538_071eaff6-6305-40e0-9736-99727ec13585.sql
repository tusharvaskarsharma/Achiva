-- Create user profiles table for additional user information
CREATE TABLE public.user_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  full_name text,
  bio text,
  avatar_url text,
  phone text,
  university text,
  degree text,
  graduation_year integer,
  skills text[],
  linkedin_url text,
  github_url text,
  website_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user profiles
CREATE POLICY "Users can view all profiles" 
ON public.user_profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" 
ON public.user_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create a function to get complete user portfolio data
CREATE OR REPLACE FUNCTION public.get_user_portfolio_data(target_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'user_profile', (
      SELECT json_build_object(
        'user_id', COALESCE(up.user_id, target_user_id),
        'full_name', up.full_name,
        'bio', up.bio,
        'avatar_url', up.avatar_url,
        'university', up.university,
        'degree', up.degree,
        'graduation_year', up.graduation_year,
        'skills', up.skills,
        'linkedin_url', up.linkedin_url,
        'github_url', up.github_url,
        'website_url', up.website_url,
        'created_at', COALESCE(up.created_at, now())
      )
      FROM user_profiles up
      WHERE up.user_id = target_user_id
    ),
    'portfolios', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'id', p.id,
          'title', p.title,
          'description', p.description,
          'project_url', p.project_url,
          'image_url', p.image_url,
          'technologies', p.technologies,
          'status', p.status,
          'is_verified', p.is_verified,
          'verified_at', p.verified_at,
          'created_at', p.created_at
        )
      ), '[]'::json)
      FROM portfolios p
      WHERE p.user_id = target_user_id 
        AND p.is_verified = true
      ORDER BY p.created_at DESC
    ),
    'certificates', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'id', c.id,
          'title', c.title,
          'issuer', c.issuer,
          'issue_date', c.issue_date,
          'category', c.category,
          'description', c.description,
          'is_verified', c.is_verified,
          'verified_at', c.verified_at,
          'created_at', c.created_at
        )
      ), '[]'::json)
      FROM certificates c
      WHERE c.user_id = target_user_id 
        AND c.is_verified = true
      ORDER BY c.issue_date DESC
    ),
    'analytics', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'metric_name', a.metric_name,
          'metric_value', a.metric_value,
          'metric_date', a.metric_date
        )
      ), '[]'::json)
      FROM analytics a
      WHERE a.user_id = target_user_id
      ORDER BY a.metric_date DESC
      LIMIT 30
    ),
    'stats', (
      SELECT json_build_object(
        'total_projects', (
          SELECT COUNT(*) FROM portfolios p 
          WHERE p.user_id = target_user_id AND p.is_verified = true
        ),
        'completed_projects', (
          SELECT COUNT(*) FROM portfolios p 
          WHERE p.user_id = target_user_id AND p.is_verified = true AND p.status = 'completed'
        ),
        'total_certificates', (
          SELECT COUNT(*) FROM certificates c 
          WHERE c.user_id = target_user_id AND c.is_verified = true
        ),
        'total_study_hours', (
          SELECT COALESCE(SUM(a.metric_value), 0) FROM analytics a 
          WHERE a.user_id = target_user_id AND a.metric_name = 'study_hours'
        )
      )
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Create RLS policy for the function (allow users to get their own data and public profiles)
CREATE POLICY "Users can access portfolio function for any user" 
ON public.user_profiles 
FOR SELECT 
USING (true);