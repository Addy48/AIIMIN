-- ============================================================
-- Migration 022: Seed belief prompts (3 per domain × 6 domains)
-- ============================================================

INSERT INTO public.lab_belief_prompts (domain, prompt_text, sort_order) VALUES
-- Money
('money', 'Write the truest sentence you currently believe about money. Do not edit it.', 1),
('money', 'What is the smallest sum of money changing how you behave tomorrow? Why?', 2),
('money', 'Whose voice is in your head when you make a money decision?', 3),
-- Opportunity
('opportunity', 'Describe the last opportunity you turned down. What drove that decision?', 1),
('opportunity', 'Do you believe opportunities come to you, or do you create them? Write your honest answer.', 2),
('opportunity', 'What opportunity are you avoiding right now and why?', 3),
-- Women
('women', 'Write your most honest belief about what women want from you. No performance.', 1),
('women', 'When was the last time you changed your behavior around a woman? What triggered it?', 2),
('women', 'What pattern do you notice in how you relate to women you are attracted to?', 3),
-- Identity
('identity', 'If you could only keep three traits that define you, which would they be?', 1),
('identity', 'What is the gap between who you present online and who you are alone?', 2),
('identity', 'Write one sentence about who you are becoming. Then write one about who you are leaving behind.', 3),
-- Society
('society', 'What social rule do you follow that you privately disagree with?', 1),
('society', 'Whose approval are you still seeking? Be specific.', 2),
('society', 'What would you do differently if no one could see or judge you?', 3),
-- Fear
('fear', 'Name your three biggest fears in order. Be precise, not poetic.', 1),
('fear', 'What fear is currently shaping a decision you are making this month?', 2),
('fear', 'When was the last time fear stopped you from doing something you wanted? What happened?', 3)
ON CONFLICT DO NOTHING;
