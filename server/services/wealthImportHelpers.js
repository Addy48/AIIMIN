/**
 * Wealth import helpers — shared by spreadsheet + AI import routes.
 */

export const parseExcelDate = (val) => {
    if (!val) return new Date().toISOString().split('T')[0];
    if (typeof val === 'number') {
        const date = new Date(Math.round((val - 25569) * 86400 * 1000));
        if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
    }
    if (typeof val === 'string') {
        const cleanStr = val.trim();
        let parts = cleanStr.match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{4})$/);
        if (parts) {
            const d = new Date(parseInt(parts[3], 10), parseInt(parts[2], 10) - 1, parseInt(parts[1], 10));
            if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
        }
        parts = cleanStr.match(/^(\d{4})[-./](\d{1,2})[-./](\d{1,2})$/);
        if (parts) {
            const d = new Date(parseInt(parts[1], 10), parseInt(parts[2], 10) - 1, parseInt(parts[3], 10));
            if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
        }
        parts = cleanStr.match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{2})$/);
        if (parts) {
            const year = 2000 + parseInt(parts[3], 10);
            const d = new Date(year, parseInt(parts[2], 10) - 1, parseInt(parts[1], 10));
            if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
        }
    }
    try {
        const d = new Date(val);
        if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    } catch { /* ignore */ }
    return new Date().toISOString().split('T')[0];
};

export const cleanCategoryName = (cat) => {
    if (!cat) return 'Other';
    let clean = String(cat).trim();
    clean = clean.replace(/^[^a-zA-Z0-9\s]+/, '').trim();
    clean = clean.replace(/\s+/g, ' ');
    clean = clean.replace(/\b\w/g, (c) => c.toUpperCase());

    const lower = clean.toLowerCase();
    if (lower === 'food' || lower === 'drinks' || lower === 'food & dining' || lower === 'groceries') return 'Food & Dining';
    if (lower === 'household' || lower === 'utilities' || lower === 'home') return 'Utilities';
    if (lower === 'misc' || lower === 'other' || lower === 'miscellaneous') return 'Other';
    return clean;
};
