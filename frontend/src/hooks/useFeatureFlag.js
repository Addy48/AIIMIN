export default function useFeatureFlag(flagKey) {
    try {
        const stored = localStorage.getItem('aiimin_dev_flags');
        if (!stored) return false;

        const flags = JSON.parse(stored);
        return Boolean(flags[flagKey]);
    } catch (e) {
        // Fallback safely if localStorage is corrupted or parsed fails
        localStorage.setItem('aiimin_dev_flags', '{}');
        return false;
    }
}
