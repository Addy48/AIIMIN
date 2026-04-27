export default function useFeatureFlag(flagKey) {
    try {
        const stored = localStorage.getItem('aiimin_dev_flags');
        if (!stored) return true; // all features ON by default

        const flags = JSON.parse(stored);
        // If key not explicitly set, default to ON
        return flags[flagKey] !== false;
    } catch (e) {
        return true;
    }
}
