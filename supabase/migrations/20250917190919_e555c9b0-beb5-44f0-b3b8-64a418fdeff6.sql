-- Assign student role to existing users who don't have any role assigned
INSERT INTO public.user_roles (user_id, role)
SELECT 
  au.id,
  'student'::public.app_role
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id
WHERE ur.user_id IS NULL;