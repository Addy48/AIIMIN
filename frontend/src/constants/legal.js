export const LEGAL = {
  entity: 'AIIMIN',
  operator: 'Aaditya Upadhyay',
  // TODO(founder): replace with registered legal entity name + type once incorporated
  entityNote: 'AIIMIN is operated by Aaditya Upadhyay, India.',
  address: null, // TODO(founder): DPDP requires a published postal address before launch
  effectiveDate: 'July 31, 2026',
  emails: {
    support: 'support@aiimin.in',
    privacy: 'privacy@aiimin.in',
    security: 'security@aiimin.in',
    grievance: 'grievance@aiimin.in',
    legal: 'legal@aiimin.in',
  },
  grievanceOfficer: 'Aaditya Upadhyay',
  jurisdiction: 'Uttar Pradesh, India',
  liabilityCap: 'the greater of ₹5,000 or the subscription fees you paid in the 12 months before the claim',
  consentVersion: 'v1-2026-07-31',
};

/** Shown wherever the registered postal address would otherwise be printed. */
export const ADDRESS_FALLBACK =
  'Registered postal address is available on request at legal@aiimin.in and will be published here before public launch.';

/** Every published legal document, in footer / hub order. */
export const LEGAL_DOCUMENTS = [
  { path: '/privacy', label: 'Privacy Policy', summary: 'What we collect, why, how long we keep it, and how to get it out or delete it.' },
  { path: '/terms', label: 'Terms of Service', summary: 'The contract between you and AIIMIN — eligibility, subscriptions, liability, termination.' },
  { path: '/security', label: 'Security Statement', summary: 'The controls that are live today, what is planned, and what we deliberately do not claim.' },
  { path: '/data-deletion', label: 'Data Deletion & Export', summary: 'Export everything at any time; three levels of deletion and how fast each one takes effect.' },
  { path: '/cookies', label: 'Cookie & Local Storage Policy', summary: 'The short list of cookies and local storage we use, and which ones need your consent.' },
  { path: '/acceptable-use', label: 'Acceptable Use Policy', summary: 'The few things you must not do, and what happens if you do them.' },
  { path: '/refunds', label: 'Refund, Billing & Cancellation', summary: 'Plans and prices, renewals, the 7-day goodwill refund, and how cancellation works.' },
  { path: '/ai-disclosure', label: 'AI Disclosure', summary: 'Exactly what the AI does, the rules it operates under, which providers see what, and its limits.' },
  { path: '/grievance', label: 'Grievance Redressal & Your Rights', summary: 'Your DPDP rights, the Grievance Officer, and our response timelines.' },
  { path: '/subprocessors', label: 'Subprocessors & Third Parties', summary: 'Every provider that processes data on our behalf, what they see, and where.' },
  { path: '/about', label: 'About AIIMIN', summary: 'What AIIMIN is, who operates it, and the commitments that will not change.' },
  { path: '/contact', label: 'Contact', summary: 'Support, privacy, security and grievance contacts, with response targets.' },
];
