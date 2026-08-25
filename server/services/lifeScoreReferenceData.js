/**
 * Public reference metadata used to define conservative defaults.
 * These references constrain the model; they never replace the user's own records.
 */
export const LIFE_SCORE_REFERENCE_DATASET = {
    datasetVersion: 'lhs-reference-2026-08-22',
    purpose: 'Conservative default anchors for a personal operating-signal model; not a diagnosis and not a population ranking.',
    sources: [
        {
            id: 'CDC_SLEEP_ADULTS_2024',
            title: 'FastStats: Sleep in Adults',
            url: 'https://www.cdc.gov/sleep/data-research/facts-stats/adults-sleep-facts-and-stats.html',
            appliedTo: ['sleep_hours'],
            claim: 'Adults are recommended to get at least 7 hours of sleep each day.',
        },
        {
            id: 'WHO_PHYSICAL_ACTIVITY_2024',
            title: 'Physical activity fact sheet',
            url: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity',
            appliedTo: ['gym_done', 'steps'],
            claim: 'Any physical activity is better than none; population guidance is expressed by activity frequency, intensity, and duration rather than a universal step target.',
        },
        {
            id: 'OECD_SUBJECTIVE_WELLBEING_2013',
            title: 'OECD Guidelines on Measuring Subjective Well-being',
            url: 'https://www.oecd.org/en/publications/oecd-guidelines-on-measuring-subjective-well-being_9789264191655-en.html',
            appliedTo: ['mood', 'journal_entry'],
            claim: 'Subjective well-being measures should be collected and reported alongside objective social and economic dimensions with reliable, consistent measurement.',
        },
    ],
    anchors: {
        sleep_hours: { minimumRecommended: 7, operatingRange: [7, 9], outlierRange: [4, 12], kind: 'reference-anchored' },
        steps: { saturation: 8000, kind: 'product-operating-anchor', note: 'No universal step threshold is asserted; the score uses a diminishing-return proxy and personal baseline.' },
        gym_done: { kind: 'observed-activity-proxy', note: 'The boolean records whether training was logged, not total physical-activity minutes.' },
        mood: { scale: [0, 10], kind: 'self-report-signal', note: 'A daily self-report is a signal, not a mental-health diagnosis.' },
        journal_entry: { kind: 'reflection-presence-signal', note: 'Presence is measured; content is not scored.' },
    },
};
