import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '../utils/api';
import { useMockData } from '../providers/MockDataProvider';

/**
 * useCalendarEvents — centralized hook for Life OS calendar data.
 * Fetches events for a given date range and provides CRUD operations.
 */
export function useCalendarEvents(session, rangeStart, rangeEnd) {
    const { isUsingMock, mockData } = useMockData() || {};
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = useCallback(async () => {
        if (isUsingMock) {
            setLoading(true);
            const allMockEvents = mockData?.calendarEvents || [];

            // In mock mode, we want to simulate the date range query.
            if (rangeStart && rangeEnd) {
                const s = new Date(rangeStart).getTime();
                const e = new Date(rangeEnd).getTime();
                setEvents(allMockEvents.filter(ev => {
                    const evTime = new Date(ev.start_time).getTime();
                    return evTime >= s && evTime <= e;
                }));
            } else {
                setEvents(allMockEvents);
            }
            setLoading(false);
            return;
        }

        if (!session || !rangeStart || !rangeEnd) return;
        setLoading(true);
        try {
            const data = await apiGet(`/calendar/events?start=${rangeStart}&end=${rangeEnd}`, { session });
            setEvents(data || []);
        } catch (err) {
            console.error('[useCalendarEvents] fetch failed:', err.message);
        } finally {
            setLoading(false);
        }
    }, [session, rangeStart, rangeEnd, isUsingMock, mockData]);

    useEffect(() => { fetchEvents(); }, [fetchEvents]);

    const createEvent = async (eventData) => {
        if (isUsingMock) {
            const newEvent = { ...eventData, id: `mock_${Date.now()}` };
            if (mockData && mockData.calendarEvents) {
                mockData.calendarEvents.push(newEvent);
            }
            await fetchEvents();
            return newEvent;
        }
        const created = await apiPost('/calendar/events', eventData, { session });
        await fetchEvents();
        return created;
    };

    const updateEvent = async (id, eventData) => {
        if (isUsingMock) {
            if (mockData && mockData.calendarEvents) {
                const idx = mockData.calendarEvents.findIndex(ev => ev.id === id);
                if (idx !== -1) {
                    mockData.calendarEvents[idx] = { ...mockData.calendarEvents[idx], ...eventData };
                }
            }
            await fetchEvents();
            return eventData;
        }
        const updated = await apiPatch(`/calendar/events/${id}`, eventData, { session });
        await fetchEvents();
        return updated;
    };

    const deleteEvent = async (id) => {
        if (isUsingMock) {
            if (mockData && mockData.calendarEvents) {
                const idx = mockData.calendarEvents.findIndex(ev => ev.id === id);
                if (idx !== -1) {
                    mockData.calendarEvents.splice(idx, 1);
                }
            }
            await fetchEvents();
            return;
        }
        await apiDelete(`/calendar/events/${id}`, { session });
        await fetchEvents();
    };

    return { events, loading, fetchEvents, createEvent, updateEvent, deleteEvent };
}
