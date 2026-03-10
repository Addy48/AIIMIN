// ============================================================
// AIIMIN Sound Engine — Web Audio API synthesized sounds
// No external files, instant playback
// ============================================================

let audioCtx = null;

function getContext() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

// Play a single tone
function playTone(freq, duration, type = 'sine', volume = 0.3) {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
}

// ── SOUND PRESETS ──────────────────────────────────────────

// Gentle bell — single warm tone with fade
export function playBell() {
    playTone(440, 1.5, 'sine', 0.25);
    playTone(880, 1.5, 'sine', 0.1);
}

// Ascending 3-note chime — pleasant completion feel
export function playChime() {
    const ctx = getContext();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.15 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.6);
    });
}

// Pulsing alarm — for urgent alerts
export function playAlarm() {
    const ctx = getContext();
    for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, ctx.currentTime + i * 0.3);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.3 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.3);
        osc.stop(ctx.currentTime + i * 0.3 + 0.15);
    }
}

// Level-up fanfare — triumphant ascending sequence
export function playLevelUp() {
    const ctx = getContext();
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4→G5
    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.1 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.5);
    });
}

// XP earn sound — quick satisfying blip
export function playXP() {
    playTone(600, 0.15, 'sine', 0.2);
    setTimeout(() => playTone(900, 0.2, 'sine', 0.15), 80);
}

// Map setting name to function
const SOUNDS = { bell: playBell, chime: playChime, alarm: playAlarm, levelup: playLevelUp, xp: playXP, none: () => {} };

export function playSound(name) {
    const fn = SOUNDS[name];
    if (fn) fn();
}

// ── BROWSER NOTIFICATIONS ──────────────────────────────────

export function requestNotificationPermission() {
    if (!('Notification' in window)) return Promise.resolve('denied');
    if (Notification.permission === 'granted') return Promise.resolve('granted');
    if (Notification.permission === 'denied') return Promise.resolve('denied');
    return Notification.requestPermission();
}

export function sendNotification(title, body) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    try { new Notification(title, { body, icon: '/manifest.json' }); } catch { /* mobile fallback */ }
}

// ── NOTIFICATION PREFS (localStorage) ──────────────────────

const PREFS_KEY = 'aiimin_notif_prefs';

export function getNotifPrefs() {
    try {
        const raw = localStorage.getItem(PREFS_KEY);
        if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return { sound: 'chime', browser: true, volume: 70 };
}

export function setNotifPrefs(prefs) {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}
