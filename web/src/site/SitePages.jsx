import React from 'react';
import { Link } from 'react-router-dom';
import Shell, { Meta, raahi } from './Shell';

export function SiteNotFound() {
  return (
    <Shell>
      <Meta title="Page not found · AIIMIN" description="This page does not exist." path="/404" />
      <section className="s-wrap s-404">
        <div>
          <img src={raahi('pose_noticing_hero')} alt="" width="768" height="768" />
          <h1>This path goes nowhere.</h1>
          <p>The page may have moved, or the link has a typo. Raahi suggests one of these instead.</p>
          <div className="s-404__links">
            <Link className="s-btn" to="/waitlist">Go home</Link>
            <Link className="s-btn s-btn--ghost" to="/app">Android app</Link>
            <Link className="s-btn s-btn--ghost" to="/legal">Legal pages</Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}

/** PRD 3.7: a signed-in tester on a phone browser is pointed to the app, with a way past. */
export function DeskNotice({ onContinue }) {
  return (
    <Shell bare>
      <section className="s-desk">
        <div>
          <img src={raahi('pose_pointing_hero')} alt="" width="768" height="768" />
          <h1>The full site is for desktop.</h1>
          <p>Use the app. On a phone, AIIMIN works best as the Android app.</p>
          <div className="s-desk__links">
            <Link className="s-btn" to="/app">Get the app</Link>
            <button type="button" className="s-btn s-btn--ghost" onClick={onContinue}>Open desktop site anyway</button>
          </div>
        </div>
      </section>
    </Shell>
  );
}
