const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://yubxgftugxbwtywyhcsv.supabase.co',
  'REDACTED_SUPABASE_PUBLISHABLE_KEY'
);

async function main() {
  const { data, error } = await supabase.auth.signUp({
    email: 'au48@aiimin.com',
    password: '222222',
    options: {
      data: {
        full_name: 'Aaditya',
        username: 'AU48'
      }
    }
  });

  if (error) {
    console.error('Error creating user:', error);
  } else {
    console.log('User created:', data);
  }
}

main();
