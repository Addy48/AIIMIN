/**
 * Resend dashboard template — light (c6) + dark (Route Y) via prefers-color-scheme.
 * Variables: Resend triple-brace syntax {{{VAR_NAME}}}
 */
import { darkModeHeadBlock, LOGO_URL_LIGHT, LOGO_URL_DARK } from './waitlistEmailStyles.js';

export const RESEND_TEMPLATE_VARIABLES = [
  { key: 'COUNT_LABEL', type: 'string', fallbackValue: 'Founding member #123 of 300' },
  { key: 'GREETING', type: 'string', fallbackValue: 'friend' },
  { key: 'HERO_SUBLINE', type: 'string', fallbackValue: 'Thanks for showing up before the crowd.' },
  { key: 'OSID_HTML', type: 'string', fallbackValue: '' },
  { key: 'REFERRAL_HTML', type: 'string', fallbackValue: '' },
  { key: 'CTA_URL', type: 'string', fallbackValue: 'https://www.aiimin.in' },
  { key: 'CTA_LABEL', type: 'string', fallbackValue: 'Visit AIIMIN →' },
  { key: 'MEMBER_NUM', type: 'string', fallbackValue: '123' },
];

export function getResendTemplateHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  ${darkModeHeadBlock()}
  <title>It starts here.</title>
</head>
<body class="wl-body" style="margin:0;padding:0;background-color:#F0EDE8;font-family:Figtree, Arial, Helvetica, sans-serif;color:#1A1A1A;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;opacity:0;color:transparent;font-size:1px;line-height:1px;">You're in the first 300. Core free at launch · Life Score · founding Pro ₹49/mo.</div>
<table role="presentation" class="wl-outer" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F0EDE8;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" class="wl-frame" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#FAFAF9;border:1px solid #E2DDD7;border-radius:14px;overflow:hidden;">
<tr><td>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="wl-header" style="margin:0;">
  <tr><td style="padding:28px 28px 24px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="padding-right:12px;vertical-align:middle;">
        <img class="wl-logo-light" src="${LOGO_URL_LIGHT}" width="44" height="44" alt="AIIMIN" border="0" style="display:block;border:0;border-radius:10px;">
        <img class="wl-logo-dark" src="${LOGO_URL_DARK}" width="44" height="44" alt="AIIMIN" border="0" style="display:none;border:0;border-radius:10px;">
      </td>
      <td style="vertical-align:middle;text-align:left;">
        <span class="wl-brand" style="font-family:Georgia, 'Times New Roman', serif;font-size:19px;font-weight:700;letter-spacing:0.3px;color:#1A1A1A;">AIIMIN</span>
        <div class="wl-tag" style="font-family:'Courier New', Courier, monospace;font-size:10.5px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#9A9186;margin-top:2px;">Personal OS</div>
      </td>
    </tr></table>
  </td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="padding:0 28px 8px;">
  <h1 class="wl-h1" style="margin:0 0 22px;font-family:Georgia, 'Times New Roman', serif;font-size:30px;font-weight:600;line-height:1.15;color:#1A1A1A;">It starts here.</h1>
  <table role="presentation" class="wl-hero" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;border-radius:10px;overflow:hidden;border:1px solid #E2DDD7;">
    <tr><td bgcolor="#F0EDE8" style="background:linear-gradient(135deg, #F0EDE8 0%, #E8F0EB 55%, #E8F0EB 100%);padding:24px 26px;">
      <table role="presentation" class="wl-badge-count" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 14px;"><tr>
        <td bgcolor="#164530" style="background-color:#164530;border-radius:20px;padding:6px 12px;font-family:'Courier New', Courier, monospace;font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#FFFFFF;">{{{COUNT_LABEL}}}</td>
      </tr></table>
      <div class="wl-hero-title" style="font-family:Georgia, 'Times New Roman', serif;font-size:21px;font-weight:600;line-height:1.3;color:#164530;margin-bottom:10px;">You're becoming one of the people shaping AIIMIN.</div>
      <div class="wl-hero-sub wl-text" style="font-family:Figtree, Arial, Helvetica, sans-serif;font-size:14.5px;line-height:1.6;color:#4A5340;">{{{HERO_SUBLINE}}}</div>
    </td></tr>
  </table>
  <p class="wl-text" style="font-family:Figtree, Arial, Helvetica, sans-serif;font-size:15px;line-height:1.7;color:#4A5340;margin:0 0 24px;">You weren't looking for another app. You were looking for a Personal OS — sleep, gym, mood, money, and focus in one loop that tells the truth about your days.</p>
  <table role="presentation" class="wl-box" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;border:1px solid #E2DDD7;border-radius:10px;overflow:hidden;">
    <tr class="wl-box-lbl"><td style="padding:12px 20px;font-family:'Courier New', Courier, monospace;font-size:10.5px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#9A9186;background-color:#EDE8DF;border-bottom:1px solid #E2DDD7;">What you locked in</td></tr>
    <tr class="wl-box-body"><td style="padding:16px 20px;font-family:Figtree, Arial, Helvetica, sans-serif;font-size:14px;line-height:1.9;color:#4A5340;">
      <div><b class="wl-text-strong" style="color:#1A1A1A;font-weight:600;">Core tier</b> — complimentary at launch</div>
      <div><b class="wl-text-strong" style="color:#1A1A1A;font-weight:600;">Life Score + XP</b> — your days start keeping score</div>
      <div><b class="wl-text-strong" style="color:#1A1A1A;font-weight:600;">Founding Pro</b> — ₹49/mo locked (public pays ₹59)</div>
    </td></tr>
  </table>
  {{{OSID_HTML}}}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 26px;">
    <tr><td class="wl-section-lbl" style="font-family:'Courier New', Courier, monospace;font-size:10.5px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#9A9186;padding-bottom:14px;">What happens next</td></tr>
    <tr class="wl-step-row" style="border-bottom:1px solid #E2DDD7;"><td class="wl-step-num" style="padding:12px 0;width:28px;vertical-align:top;font-family:'Courier New', Courier, monospace;font-size:11px;color:#1E5C3A;">01</td><td style="padding:12px 0 12px 16px;vertical-align:top;"><div class="wl-step-title" style="font-family:Figtree, Arial, Helvetica, sans-serif;font-size:14.5px;font-weight:600;color:#1A1A1A;margin-bottom:4px;">You're in the first 300</div><div class="wl-step-desc wl-text" style="font-family:Figtree, Arial, Helvetica, sans-serif;font-size:13px;line-height:1.5;color:#9A9186;">Founding pricing and Core access — locked to this email.</div></td></tr>
    <tr class="wl-step-row" style="border-bottom:1px solid #E2DDD7;"><td class="wl-step-num" style="padding:12px 0;width:28px;vertical-align:top;font-family:'Courier New', Courier, monospace;font-size:11px;color:#1E5C3A;">02</td><td style="padding:12px 0 12px 16px;vertical-align:top;"><div class="wl-step-title" style="font-family:Figtree, Arial, Helvetica, sans-serif;font-size:14.5px;font-weight:600;color:#1A1A1A;margin-bottom:4px;">31 July</div><div class="wl-step-desc wl-text" style="font-family:Figtree, Arial, Helvetica, sans-serif;font-size:13px;line-height:1.5;color:#9A9186;">Tester keys go out. Activate before then for complimentary Elite, one year.</div></td></tr>
    <tr class="wl-step-row"><td class="wl-step-num" style="padding:12px 0;width:28px;vertical-align:top;font-family:'Courier New', Courier, monospace;font-size:11px;color:#1E5C3A;">03</td><td style="padding:12px 0 12px 16px;vertical-align:top;"><div class="wl-step-title" style="font-family:Figtree, Arial, Helvetica, sans-serif;font-size:14.5px;font-weight:600;color:#1A1A1A;margin-bottom:4px;">September</div><div class="wl-step-desc wl-text" style="font-family:Figtree, Arial, Helvetica, sans-serif;font-size:13px;line-height:1.5;color:#9A9186;">Launch. You hear from us before anyone on the public feed.</div></td></tr>
  </table>
  {{{REFERRAL_HTML}}}
  <p class="wl-sign wl-text" style="font-family:Figtree, Arial, Helvetica, sans-serif;font-size:14px;line-height:1.7;color:#4A5340;margin:26px 0 20px;">Thanks for believing in AIIMIN this early. You're among the first people shaping what it becomes, and that means more than you might think. If you have an idea, a question, or feedback, just reply to this email — I read every message.<br><br><span class="wl-sign-name" style="font-weight:600;color:#1A1A1A;">— Aaditya</span></p>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="wl-cta" style="margin:0 0 14px;width:100%;">
    <tr><td bgcolor="#1E5C3A" style="border-radius:9px;background-color:#1E5C3A;text-align:center;">
      <a href="{{{CTA_URL}}}" style="display:block;padding:15px 32px;font-family:Georgia, 'Times New Roman', serif;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:9px;">{{{CTA_LABEL}}}</a>
    </td></tr>
  </table>
  <p class="wl-text" style="margin:0 0 8px;font-family:Figtree, Arial, Helvetica, sans-serif;font-size:12px;line-height:1.6;color:#9A9186;text-align:center;">Got a tester invite? Register by <strong>31 July</strong> for complimentary Elite for one year.</p>
</td></tr></table>
</td></tr>
<tr><td class="wl-footer" style="padding:20px 28px 28px;text-align:center;border-top:1px solid #E2DDD7;font-family:Figtree, Arial, Helvetica, sans-serif;font-size:11.5px;line-height:1.6;color:#9A9186;">
  Built in India · <a href="https://www.aiimin.in" style="color:#1E5C3A;text-decoration:none;">aiimin.in</a><br>
  You're receiving this because you joined the AIIMIN waitlist.
</td></tr>
</table></td></tr></table>
</body></html>`;
}
