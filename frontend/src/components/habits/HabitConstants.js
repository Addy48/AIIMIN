/**
 * HabitConstants — shared data for HabitManager.
 */
import {
    Barbell,
    Heartbeat,
    BookOpen,
    Brain,
    Lightning,
    Target,
} from '@phosphor-icons/react';

export const HABIT_CATEGORIES = [
    { key: 'fitness', label: 'Fitness', icon: Barbell },
    { key: 'health', label: 'Health', icon: Heartbeat },
    { key: 'learning', label: 'Learning', icon: BookOpen },
    { key: 'mental', label: 'Mental', icon: Brain },
    { key: 'productivity', label: 'Productivity', icon: Lightning },
    { key: 'general', label: 'General', icon: Target },
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
