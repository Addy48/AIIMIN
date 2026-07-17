-- Hot-path FK indexes (audit P1)
-- Applied remotely as p1_index_unindexed_foreign_keys_hot

CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON public.family_members (user_id);
CREATE INDEX IF NOT EXISTS idx_family_documents_user_id ON public.family_documents (user_id);
CREATE INDEX IF NOT EXISTS idx_family_documents_member_id ON public.family_documents (member_id);
CREATE INDEX IF NOT EXISTS idx_family_health_user_id ON public.family_health (user_id);
CREATE INDEX IF NOT EXISTS idx_family_health_member_id ON public.family_health (member_id);
CREATE INDEX IF NOT EXISTS idx_family_insurance_user_id ON public.family_insurance (user_id);
CREATE INDEX IF NOT EXISTS idx_family_insurance_member_id ON public.family_insurance (member_id);
CREATE INDEX IF NOT EXISTS idx_family_finance_user_id ON public.family_finance (user_id);
CREATE INDEX IF NOT EXISTS idx_family_finance_member_id ON public.family_finance (member_id);
CREATE INDEX IF NOT EXISTS idx_family_reminders_user_id ON public.family_reminders (user_id);
CREATE INDEX IF NOT EXISTS idx_family_relationships_user_id ON public.family_relationships (user_id);
CREATE INDEX IF NOT EXISTS idx_family_emergency_contacts_user_id ON public.family_emergency_contacts (user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON public.habit_logs (habit_id);
CREATE INDEX IF NOT EXISTS idx_habits_goal_id ON public.habits (goal_id);
CREATE INDEX IF NOT EXISTS idx_discipline_logs_streak_id ON public.discipline_logs (streak_id);
-- note: discipline_logs(user_id) already indexed as idx_discipline_logs_user — do not recreate
CREATE INDEX IF NOT EXISTS idx_urge_events_user_id ON public.urge_events (user_id);
CREATE INDEX IF NOT EXISTS idx_cbt_records_user_id ON public.cbt_records (user_id);
CREATE INDEX IF NOT EXISTS idx_cbt_records_entry_id ON public.cbt_records (entry_id);
CREATE INDEX IF NOT EXISTS idx_dsa_logs_user_id ON public.dsa_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_account_balances_user_id ON public.account_balances (user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category_id ON public.budgets (category_id);
CREATE INDEX IF NOT EXISTS idx_financial_goals_user_id ON public.financial_goals (user_id);
CREATE INDEX IF NOT EXISTS idx_financial_health_scores_user_id ON public.financial_health_scores (user_id);
CREATE INDEX IF NOT EXISTS idx_cognitive_benchmarks_user_id ON public.cognitive_benchmarks (user_id);
CREATE INDEX IF NOT EXISTS idx_admin_action_log_admin_user_id ON public.admin_action_log (admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_action_log_target_user_id ON public.admin_action_log (target_user_id);
