-- Create trigger to automatically assign roles when users sign up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_with_role();

-- Update the existing handle_new_user_with_role function to default to student
CREATE OR REPLACE FUNCTION public.handle_new_user_with_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role app_role;
BEGIN
  -- Always default to 'student' role for new signups
  -- Admin roles should be assigned manually in the database
  user_role := 'student'::app_role;
  
  -- Insert the role for the new user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$function$;