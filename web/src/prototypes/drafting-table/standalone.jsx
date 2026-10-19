/**
 * Standalone entry — used to bundle the prototype into a single self-contained
 * HTML file (no dev server, no network). Regenerate with:
 *
 *   npm run proto:build   (see scripts/build-proto.mjs)
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import DraftingTableApp from './DraftingTableApp';

createRoot(document.getElementById('root')).render(<DraftingTableApp />);
