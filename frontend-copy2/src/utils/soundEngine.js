/**
 * soundEngine.js — Web Audio API + Browser Notifications
 *
 * Provides sound effects using Web Audio API with fallback to browser notifications
 */

let audioContext = null;

/**
 * Initialize Web Audio API context (must be called on user interaction)
 */
export function initAudioContext() {
    if (!audioContext) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not available:', e);
        }
    }
    return audioContext;
}

/**
 * Play a simple beep tone
 * @param {number} frequency - Hz
 * @param {number} duration - ms
 * @param {number} volume - 0-1
 */
function playTone(frequency = 440, duration = 100, volume = 0.3) {
    const ctx = audioContext || initAudioContext();
    if (!ctx) return;

    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = frequency;
        osc.type = 'sine';

        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration / 1000);
    } catch (e) {
        console.warn('playTone error:', e);
    }
}

/**
 * Play XP notification sound
 */
export function playXP() {
    playTone(700, 100, 0.2);
    setTimeout(() => playTone(1000, 150, 0.25), 50);
}

/**
 * Play level up celebration sound
 */
export function playLevelUp() {
    playTone(523, 150, 0.3);
    setTimeout(() => playTone(659, 150, 0.3), 120);
    setTimeout(() => playTone(784, 200, 0.35), 240);
}

/**
 * Play completion sound (Pomodoro session end)
 */
export function playComplete() {
    playTone(600, 150, 0.3);
    setTimeout(() => playTone(800, 150, 0.3), 100);
}

/**
 * Play success sound
 */
export function playSuccess() {
    playTone(700, 100, 0.2);
    setTimeout(() => playTone(800, 150, 0.25), 80);
    setTimeout(() => playTone(900, 150, 0.25), 150);
}

/**
 * Play error/failure sound
 */
export function playError() {
    playTone(300, 150, 0.2);
    setTimeout(() => playTone(250, 150, 0.2), 100);
}

/**
 * Request browser notification permission
 */
export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.warn('Notifications not supported');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        try {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        } catch (e) {
            console.warn('Notification permission request failed:', e);
            return false;
        }
    }

    return false;
}

/**
 * Send a browser notification
 * @param {string} title
 * @param {Object} options - { body, icon, badge, tag, requireInteraction }
 */
export function sendNotification(title, options = {}) {
    if (Notification.permission === 'granted') {
        try {
            new Notification(title, {
                icon: '/favicon.png',
                ...options,
            });
        } catch (e) {
            console.warn('Notification error:', e);
        }
    }
}

/**
 * Combined: play sound + send notification
 * @param {string} type - 'xp' | 'levelup' | 'complete' | 'success' | 'error'
 * @param {string} title - notification title
 * @param {Object} options - notification options
 */
export async function playAndNotify(type = 'xp', title = 'AIIMIN', options = {}) {
    // Play sound
    switch (type) {
        case 'xp':
            playXP();
            break;
        case 'levelup':
            playLevelUp();
            break;
        case 'complete':
            playComplete();
            break;
        case 'success':
            playSuccess();
            break;
        case 'error':
            playError();
            break;
        default:
            break;
    }

    // Send notification if permission granted
    if (Notification.permission === 'granted') {
        sendNotification(title, options);
    }
}

/**
 * Generic sound dispatcher (used by PomodoroTimer and others)
 * @param {string} type - 'bell' | 'chime' | 'alarm' | 'levelUp' | 'xp' | 'complete' | 'success' | 'error'
 */
export function playSound(type) {
    switch (type) {
        case 'bell':
        case 'chime':
            playComplete();
            break;
        case 'alarm':
            playTone(440, 500, 0.4);
            setTimeout(() => playTone(440, 500, 0.4), 600);
            break;
        case 'levelUp':
            playLevelUp();
            break;
        case 'xp':
            playXP();
            break;
        case 'complete':
            playComplete();
            break;
        case 'success':
            playSuccess();
            break;
        case 'error':
            playError();
            break;
        default:
            playXP();
            break;
    }
}

// Export for testing/debugging
export { playTone };
