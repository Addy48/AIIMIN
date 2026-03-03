-- Update handle_new_user trigger to sync full_name and username from auth metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, username)
  VALUES (
    new.id, 
    new.email, 
    (new.raw_user_meta_data->>'full_name'), 
    (new.raw_user_meta_data->>'username')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    username = COALESCE(EXCLUDED.username, public.users.username);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
