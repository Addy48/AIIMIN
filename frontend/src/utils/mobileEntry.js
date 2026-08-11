import { isCapacitorNative } from './capacitorEnv';
import { detectDeviceTier } from '../hooks/useDeviceTier';

/** Phone web + Capacitor native → capture shell only */
export function isMobileCaptureShell() {
  return isCapacitorNative() || detectDeviceTier() === 'phone';
}

/** Where to send user after login / onboarding on this device */
export function getPostAuthPath() {
  return isMobileCaptureShell() ? '/m' : '/overview';
}
