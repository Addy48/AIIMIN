/**
 * solarTimes.js — approximate sunrise/sunset without GPS.
 *
 * PRIVACY: We never read device geolocation. Solar math uses only:
 * 1. `users.timezone` from profile (set at onboarding via IANA string), or
 * 2. `Intl.DateTimeFormat().resolvedOptions().timeZone` as fallback.
 *
 * Coordinates come from a static timezone→representative-city lookup (~city-level,
 * not street-level). No lat/lng is stored or transmitted to the server.
 */
import * as SunCalc from 'suncalc';

/** Representative city centers for common IANA zones (approximate, not user-specific). */
const TZ_COORDS = {
  'Asia/Kolkata': { lat: 28.6139, lng: 77.209 },
  'Asia/Calcutta': { lat: 28.6139, lng: 77.209 },
  'Asia/Dubai': { lat: 25.2048, lng: 55.2708 },
  'Asia/Singapore': { lat: 1.3521, lng: 103.8198 },
  'Asia/Tokyo': { lat: 35.6762, lng: 139.6503 },
  'Asia/Shanghai': { lat: 31.2304, lng: 121.4737 },
  'Asia/Bangkok': { lat: 13.7563, lng: 100.5018 },
  'Europe/London': { lat: 51.5074, lng: -0.1278 },
  'Europe/Paris': { lat: 48.8566, lng: 2.3522 },
  'Europe/Berlin': { lat: 52.52, lng: 13.405 },
  'America/New_York': { lat: 40.7128, lng: -74.006 },
  'America/Chicago': { lat: 41.8781, lng: -87.6298 },
  'America/Denver': { lat: 39.7392, lng: -104.9903 },
  'America/Los_Angeles': { lat: 34.0522, lng: -118.2437 },
  'America/Toronto': { lat: 43.6532, lng: -79.3832 },
  'Australia/Sydney': { lat: -33.8688, lng: 151.2093 },
  'Pacific/Auckland': { lat: -36.8485, lng: 174.7633 },
};

const DEFAULT_COORDS = TZ_COORDS['Asia/Kolkata'];

export function resolveSolarCoordinates(timezone) {
  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
  return { timezone: tz, ...TZ_COORDS[tz] || DEFAULT_COORDS };
}

function formatSolarTime(date, timezone) {
  if (!date || Number.isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  });
}

/**
 * @param {Date} [date]
 * @param {string} [timezone] IANA timezone from user profile
 * @returns {{ sunrise: string, sunset: string, timezone: string }}
 */
export function getSolarTimes(date = new Date(), timezone) {
  const { lat, lng, timezone: tz } = resolveSolarCoordinates(timezone);
  const times = SunCalc.getTimes(date, lat, lng);
  return {
    sunrise: formatSolarTime(times.sunrise, tz),
    sunset: formatSolarTime(times.sunset, tz),
    timezone: tz,
  };
}
