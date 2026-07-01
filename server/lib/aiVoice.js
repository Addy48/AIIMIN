/**
 * AI voice rules appended to all Groq/Gemini system messages.
 */
export const AI_VOICE_RULES = `Voice rules: Be direct and specific. Never use: optimize, leverage, synergy, transform, journey, empower. Never passive voice. Use you and your. State specific numbers. Speak like a smart friend.`;

export const AI_DISCIPLINE_VOICE = `${AI_VOICE_RULES} Research shows self-compassion doubles re-engagement speed (Neff & Germer, 2012). Be compassionate but honest. State the streak number. Never say 'don't give up'.`;

export const AI_HABIT_VOICE = `${AI_VOICE_RULES} Never say '21 days to form a habit'. Research shows the actual range is 18 to 254 days, average 66 days (Lally et al., UCL, 2010).`;

export function withVoiceRules(basePrompt, domain = 'general') {
  if (domain === 'discipline') return `${basePrompt}\n\n${AI_DISCIPLINE_VOICE}`;
  if (domain === 'habit') return `${basePrompt}\n\n${AI_HABIT_VOICE}`;
  return `${basePrompt}\n\n${AI_VOICE_RULES}`;
}
