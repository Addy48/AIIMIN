-- Close PostgREST INSERT abuse on waitlist/feedback (API uses service pool)
-- Apply when approved: p2_revoke_anon_waitlist_feedback_insert

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.waitlist_emails FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.user_feedback FROM anon, authenticated;
DROP POLICY IF EXISTS "Allow insert only" ON public.waitlist_emails;
DROP POLICY IF EXISTS "Allow feedback insertion for anyone" ON public.user_feedback;
