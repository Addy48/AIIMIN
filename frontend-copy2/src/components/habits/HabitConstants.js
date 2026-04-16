/**
 * HabitConstants — shared data for HabitManager.
 */

export const EMOJI_PICKER = [
    '🏋️‍♂️', '🏃‍♂️', '🧘‍♂️', '🚴‍♂️', '🏊‍♂️', '🤸‍♂️',
    '💧', '🥗', '🥩', '😴', '📚', '✍️', '💻', '🧠',
    '🎯', '🔥', '🌅', '🌿', '🎵', '📝', '⏰', '💆‍♂️',
];

export const EMOJI_LABELS = {
    '🏋️‍♂️': 'Weightlifting', '🏃‍♂️': 'Running', '🧘‍♂️': 'Meditation',
    '🚴‍♂️': 'Cycling', '🏊‍♂️': 'Swimming', '🤸‍♂️': 'Gymnastics',
    '💧': 'Hydration', '🥗': 'Healthy Eating', '🥩': 'Protein',
    '😴': 'Sleep', '📚': 'Reading', '✍️': 'Journaling',
    '💻': 'Coding', '🧠': 'Brain Training', '🎯': 'Focus',
    '🔥': 'Challenge', '🌅': 'Morning Routine', '🌿': 'Nature',
    '🎵': 'Music Practice', '📝': 'Planning', '⏰': 'Time Management',
    '💆‍♂️': 'Self-Care',
};

export const HABIT_CATEGORIES = [
    { key: 'fitness', label: 'Fitness', icon: '💪' },
    { key: 'health', label: 'Health', icon: '❤️' },
    { key: 'learning', label: 'Learning', icon: '📖' },
    { key: 'mental', label: 'Mental', icon: '🧠' },
    { key: 'productivity', label: 'Productivity', icon: '⚡' },
    { key: 'general', label: 'General', icon: '🎯' },
];

export const FREQUENCIES = [
    { key: 'morning', label: 'Morning' },
    { key: 'night', label: 'Night' },
    { key: 'morning+night', label: 'Morning + Night' },
    { key: 'daily', label: 'Daily' },
    { key: 'weekdays', label: 'Weekdays' },
    { key: '3x/week', label: '3x / week' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'custom', label: 'Custom' },
];

export const CATEGORY_FILTER_ALL = '__all__';
