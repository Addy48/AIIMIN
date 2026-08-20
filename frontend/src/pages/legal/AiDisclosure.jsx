import React from 'react';
import LegalLayout, {
    LegalSection as Section,
    LegalPara as Para,
    LegalList as List,
    LegalTable as Table,
} from './LegalLayout';
import { LEGAL } from '../../constants/legal';

const link = { color: 'var(--accent)' };

const AiDisclosure = () => {
    return (
        <LegalLayout
            title="AI Disclosure"
            lastUpdated={LEGAL.effectiveDate}
            description="Exactly what AIIMIN's AI does, the rules it operates under, which providers receive what text, and the limits you should know before relying on its output."
            canonicalPath="/ai-disclosure"
        >
            <Section title="What the AI does">
                <Para>
                    Effective {LEGAL.effectiveDate}. AIIMIN uses AI in exactly five roles, and never more:
                </Para>
                <Table
                    caption="The five AI roles in AIIMIN"
                    head={['Role', 'What it does', 'Example']}
                    rows={[
                        [<strong>Router</strong>, 'Reads a sentence you typed and works out which part of the product it belongs to', '"lent Rahul 500" → a lending record'],
                        [<strong>Inferencer</strong>, 'Fills in fields when it is reasonably sure', 'amount ₹500, person Rahul'],
                        [<strong>Analyzer</strong>, 'Enriches what you already saved', 'suggesting a category for a transaction, analysing your practice transcript'],
                        [<strong>Coach</strong>, 'Writes summaries and suggestions', 'your weekly insight'],
                        [<strong>Composer</strong>, 'Drafts text you asked for', 'goal milestones, a rewritten sentence in a practice scorecard'],
                    ]}
                />
            </Section>

            <Section title="Rules the AI operates under">
                <List
                    ordered
                    items={[
                        <><strong>Your writing is saved before the AI touches it.</strong> If the AI fails, nothing is lost.</>,
                        <><strong>It suggests; you commit.</strong> Anything below high confidence is shown for confirmation. Below low confidence it asks a question instead of guessing.</>,
                        <><strong>It never guesses safety-relevant facts</strong> — medications, allergies, medical conditions, or anything legal. It asks.</>,
                        <><strong>It never changes</strong> your permissions, your plan, your payment details, or deletes anything.</>,
                        <><strong>It never posts anything anywhere.</strong> There is nowhere to post to.</>,
                        <><strong>You can see where it came from.</strong> Every suggestion and insight shows its source, and every AI-touched record is marked.</>,
                        <><strong>You can turn it off.</strong> One switch in Account → Personalization disables all AI calls. The product keeps working; features that would have used AI say so.</>,
                    ]}
                />
            </Section>

            <Section title="Which providers, and what they get">
                <Para>
                    We use third-party model providers (currently Google Gemini, Groq, and OpenRouter-routed models — the
                    current list is at <a href="/subprocessors" style={link}>/subprocessors</a>). We send the
                    {' '}<strong>minimum text needed</strong> for the task, without your name, email, OS-ID, or phone
                    number. Journal content is sent <strong>only</strong> when you press an AI action on that specific
                    entry. We require our providers not to retain prompt content beyond what is needed to answer, and not
                    to train models on it.
                </Para>
            </Section>

            <Section title="Limits you should know">
                <Para>
                    AI output can be wrong, incomplete, or confidently mistaken. It is <strong>not</strong> medical,
                    psychological, legal, financial, or tax advice. It does not diagnose. If you are in distress, please
                    contact a qualified professional or a local helpline — AIIMIN will show you resources but is not a
                    crisis service.
                </Para>
                <Para>
                    Practice scoring (including the AIIMIN English Index) is an <strong>estimate</strong> produced by
                    software, calibrated against published proficiency bands. It is not an official language certification
                    and no institution is obliged to accept it.
                </Para>
            </Section>

            <Section title="Human oversight">
                <Para>
                    You are the human in the loop by design: every AI action is visible, correctable, and reversible.
                    Nothing runs on a schedule without your having switched it on.
                </Para>
            </Section>
        </LegalLayout>
    );
};

export default AiDisclosure;
