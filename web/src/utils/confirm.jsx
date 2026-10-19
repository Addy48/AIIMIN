import React from 'react';
import { createRoot } from 'react-dom/client';
import ConfirmDialog from '../components/ui/ConfirmDialog';

/**
 * utils/confirm.jsx
 *
 * Promise-based, branded replacement for window.confirm() / window.prompt().
 *
 * Usage:
 *   import confirm from '../utils/confirm';
 *   if (!(await confirm('Delete this entry?'))) return;
 *   if (!(await confirm({ title: 'Wipe data', message: '...', danger: true }))) return;
 *   if (!(await confirm({ danger: true, requireText: 'delete my account' }))) return;
 *
 * Removal risk: Removing this file breaks every branded confirm/delete prompt in the app.
 */

let root = null;
let container = null;

function getRoot() {
  if (!container || !document.body.contains(container)) {
    container = document.createElement('div');
    container.id = 'aiimin-confirm-root';
    document.body.appendChild(container);
    root = createRoot(container);
  }
  return root;
}

export default function confirm(options) {
  const opts = typeof options === 'string' ? { message: options } : (options || {});
  return new Promise((resolve) => {
    const r = getRoot();
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      r.render(<ConfirmDialog open={false} {...opts} onConfirm={() => {}} onCancel={() => {}} />);
      resolve(result);
    };
    r.render(
      <ConfirmDialog
        open
        {...opts}
        onConfirm={() => finish(true)}
        onCancel={() => finish(false)}
      />
    );
  });
}
