import React from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * MonthlyGrid — Canonical structural calendar grid.
 *
 * Renders a 7-column Monday-first calendar with leading and trailing
 * padding cells to complete each row. All day rendering is delegated
 * to the `renderDay` render-prop so consumers control appearance.
 *
 * @param {number} year
 * @param {number} month  JS-native 0-based (0 = January, 11 = December)
 * @param {function} renderDay  (day, year, month) => ReactNode
 *   Called for every actual day in the month. `month` passed back is 0-based.
 */
const MonthlyGrid = ({ year, month, renderDay }) => {
    // 0-based month — directly compatible with JS Date constructor
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Monday-first offset: Mon=0, Tue=1, … Sun=6
    let offset = firstDay.getDay() - 1;
    if (offset < 0) offset = 6;

    const cells = [];

    // Leading padding for days before the 1st of the month
    for (let i = 0; i < offset; i++) {
        cells.push({ day: null, type: 'pad' });
    }

    // All days of the month (past, today, and future within month)
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, type: 'day' });
    }

    // Trailing padding to complete the last row of 7
    const remainder = cells.length % 7;
    if (remainder !== 0) {
        for (let i = 0; i < 7 - remainder; i++) {
            cells.push({ day: null, type: 'pad' });
        }
    }

    return (
        <div style={{ width: '100%' }}>
            {/* Day-of-week headers */}
            <div className="calendar-grid" style={{ marginBottom: '4px' }}>
                {DAYS.map(d => (
                    <div key={d} style={{
                        fontSize: '9px', fontWeight: 700, color: 'var(--text-3)',
                        textAlign: 'center', padding: '2px 0', textTransform: 'uppercase',
                    }}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            <div className="calendar-grid">
                {cells.map((cell, i) => {
                    if (cell.type === 'pad') {
                        return <div key={`pad-${i}`} className="day-cell" style={{ background: 'transparent' }} />;
                    }
                    return renderDay(cell.day, year, month);
                })}
            </div>
        </div>
    );
};

export default MonthlyGrid;
