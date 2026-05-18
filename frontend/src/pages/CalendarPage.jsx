import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import CalendarToolbar from '../components/calendar/CalendarToolbar';
import CalendarSidebar from '../components/calendar/CalendarSidebar';
import MonthView from '../components/calendar/MonthView';
import WeekView from '../components/calendar/WeekView';
import DayView from '../components/calendar/DayView';
import AgendaView from '../components/calendar/AgendaView';
import EventModal from '../components/calendar/EventModal';

/**
 * CalendarPage — Unified Life OS Calendar with 4 views + system tagging.
 */
const CalendarPage = () => {
    const { session } = useAuth();
    const [view, setView] = useState('month');
    const [currentDate, setCurrentDate] = useState(new Date().toISOString());
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [systemFilter, setSystemFilter] = useState(null);

    // Calculate date range based on current view
    const { rangeStart, rangeEnd } = useMemo(() => {
        const d = new Date(currentDate);
        if (view === 'month') {
            const start = new Date(d.getFullYear(), d.getMonth(), 1);
            const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
            return { rangeStart: start.toISOString(), rangeEnd: end.toISOString() };
        }
        if (view === 'week') {
            const day = d.getDay();
            const monday = new Date(d);
            monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
            monday.setHours(0, 0, 0, 0);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            sunday.setHours(23, 59, 59);
            return { rangeStart: monday.toISOString(), rangeEnd: sunday.toISOString() };
        }
        // day + agenda
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const end = view === 'agenda'
            ? new Date(start.getTime() + 30 * 86400000)
            : new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
        return { rangeStart: start.toISOString(), rangeEnd: end.toISOString() };
    }, [currentDate, view]);

    const { events, loading, createEvent, updateEvent } = useCalendarEvents(session, rangeStart, rangeEnd);

    // Apply system filter
    const filteredEvents = useMemo(() => {
        if (!systemFilter) return events;
        return events.filter(ev => ev.system_type === systemFilter);
    }, [events, systemFilter]);

    const handleEventClick = (event) => {
        setEditingEvent(event);
        setModalOpen(true);
    };

    const handleNewEvent = () => {
        setEditingEvent(null);
        setModalOpen(true);
    };

    const handleSlotClick = (slotDate) => {
        const end = new Date(slotDate.getTime() + 3600000);
        setEditingEvent({
            start_time: slotDate.toISOString(),
            end_time: end.toISOString(),
        });
        setModalOpen(true);
    };

    const handleDayClick = (dayDate) => {
        setCurrentDate(dayDate.toISOString());
        setView('day');
    };

    const handleSave = async (eventData) => {
        if (editingEvent?.id) {
            await updateEvent(editingEvent.id, eventData);
        } else {
            await createEvent(eventData);
        }
    };

    const renderView = () => {
        const props = { events: filteredEvents, currentDate, onEventClick: handleEventClick };

        switch (view) {
            case 'month':
                return <MonthView {...props} onDayClick={handleDayClick} />;
            case 'week':
                return <WeekView {...props} onSlotClick={handleSlotClick} />;
            case 'day':
                return <DayView {...props} onSlotClick={handleSlotClick} />;
            case 'agenda':
                return <AgendaView {...props} />;
            default:
                return <MonthView {...props} onDayClick={handleDayClick} />;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <CalendarToolbar
                view={view}
                onViewChange={setView}
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                onNewEvent={handleNewEvent}
                session={session}
            />

            <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    {loading ? (
                        <div className="glass-panel" style={{ borderRadius: '16px', padding: '60px 20px', textAlign: 'center' }}>
                            <div className="skeleton" style={{ width: '60%', height: '14px', margin: '0 auto 12px' }} />
                            <div className="skeleton" style={{ width: '40%', height: '14px', margin: '0 auto' }} />
                        </div>
                    ) : renderView()}
                </div>

                <CalendarSidebar
                    currentDate={currentDate}
                    onDateChange={setCurrentDate}
                    events={events}
                    systemFilter={systemFilter}
                    onSystemFilterChange={setSystemFilter}
                />
            </div>

            <EventModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditingEvent(null); }}
                onSave={handleSave}
                event={editingEvent}
            />
        </div>
    );
};

export default CalendarPage;
