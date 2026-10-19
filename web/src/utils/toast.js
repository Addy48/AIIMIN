/**
 * utils/toast.js
 *
 * Lightweight, zero-dependency toast notification system.
 * Injects a container into the DOM and manages toast lifecycle.
 *
 * Usage:
 *   import toast from '../utils/toast';
 *   toast.success('Saved!');
 *   toast.error('Something went wrong');
 *   const id = toast.loading('Saving...');
 *   toast.dismiss(id);
 *
 * Removal risk: Removing this file breaks all toast notifications across the app.
 */

let container = null;
let counter = 0;

function getContainer() {
    if (container && document.body.contains(container)) return container;
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('role', 'status');
    document.body.appendChild(container);
    return container;
}

function createToast(message, type = 'info', duration = 4000) {
    const id = ++counter;
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.setAttribute('data-toast-id', id);
    el.innerHTML = `
        <span class="toast__icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'loading' ? '' : 'ℹ'}</span>
        <span class="toast__msg">${message}</span>
    `;

    const c = getContainer();
    c.appendChild(el);

    // Trigger entrance animation
    requestAnimationFrame(() => el.classList.add('toast--visible'));

    if (type !== 'loading' && duration > 0) {
        setTimeout(() => dismiss(id), duration);
    }

    return id;
}

function dismiss(id) {
    const el = document.querySelector(`[data-toast-id="${id}"]`);
    if (!el) return;
    el.classList.remove('toast--visible');
    el.classList.add('toast--exit');
    setTimeout(() => el.remove(), 300);
}

function update(id, message, type = 'success') {
    const el = document.querySelector(`[data-toast-id="${id}"]`);
    if (!el) return createToast(message, type);
    el.className = `toast toast--${type} toast--visible`;
    const icon = el.querySelector('.toast__icon');
    const msg = el.querySelector('.toast__msg');
    if (icon) icon.textContent = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    if (msg) msg.textContent = message;
    setTimeout(() => dismiss(id), 3000);
    return id;
}

const toast = {
    success: (msg, dur) => createToast(msg, 'success', dur),
    error: (msg, dur) => createToast(msg, 'error', dur || 6000),
    loading: (msg) => createToast(msg, 'loading', 0),
    info: (msg, dur) => createToast(msg, 'info', dur),
    dismiss,
    update,
};

export default toast;
