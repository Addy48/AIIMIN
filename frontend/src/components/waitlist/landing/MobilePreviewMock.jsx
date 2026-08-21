import React from 'react';
import { CheckCircle2, Smartphone } from 'lucide-react';

export default function MobilePreviewMock() {
  return (
    <div className="mobile-preview-mock" aria-label="Mobile companion capture preview mockup">
      <div className="mobile-mock-header">
        <div className="mobile-mock-id">
          <Smartphone size={13} color="#749dc4" />
          <span>@ADTY0001</span>
        </div>
        <div className="mobile-mock-badges">
          <span className="mobile-mock-pill-depth">Depth: 85%</span>
          <span className="mobile-mock-pill-score">LHS: 84</span>
        </div>
      </div>
      <div className="mobile-mock-rows">
        <div className="mobile-mock-row">
          <div className="mobile-mock-row-info">
            <span className="mobile-mock-label">Morning Movement</span>
            <span className="mobile-mock-sub">45m Gym Workout</span>
          </div>
          <span className="mobile-mock-check">
            <CheckCircle2 size={15} color="#10b981" />
          </span>
        </div>
        <div className="mobile-mock-row">
          <div className="mobile-mock-row-info">
            <span className="mobile-mock-label">Deep Work Block</span>
            <span className="mobile-mock-sub">3h 15m Code (DSA)</span>
          </div>
          <span className="mobile-mock-check">
            <CheckCircle2 size={15} color="#10b981" />
          </span>
        </div>
        <div className="mobile-mock-row">
          <div className="mobile-mock-row-info">
            <span className="mobile-mock-label">UPI Reimbursement</span>
            <span className="mobile-mock-sub">Lent Rahul ₹500 (Linked)</span>
          </div>
          <span className="mobile-mock-tag-linked">Linked</span>
        </div>
        <div className="mobile-mock-row">
          <div className="mobile-mock-row-info">
            <span className="mobile-mock-label">Evening Debrief</span>
            <span className="mobile-mock-sub">Day Journal logged</span>
          </div>
          <span className="mobile-mock-check">
            <CheckCircle2 size={15} color="#10b981" />
          </span>
        </div>
      </div>
      <div className="mobile-mock-save">Settle to Life Graph</div>
    </div>
  );
}
