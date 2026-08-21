import { isCapacitorNative } from '../../utils/capacitorEnv';

export function captureHeroCopy() {
  if (isCapacitorNative()) {
    return 'Log the day here. Full insights, habits, and finance open on iPad or desktop.';
  }
  return 'Log the day here. Full Life OS opens on iPad or desktop.';
}

export function captureFooterLabel() {
  return isCapacitorNative() ? 'AIIMIN Android · capture shell' : 'Phone web capture';
}

export function accountAppNote() {
  if (isCapacitorNative()) {
    return 'You are in the AIIMIN Android app. Billing changes open in desktop account for now.';
  }
  return 'Native Android companion is in closed testing — see /app. Full OS opens on iPad or desktop. Phone web is capture-only.';
}
