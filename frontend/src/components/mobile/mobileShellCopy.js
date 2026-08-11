import { isCapacitorNative } from '../../utils/capacitorEnv';

export function captureHeroCopy() {
  if (isCapacitorNative()) {
    return 'Log the day here. Full insights, habits, and finance open on iPad or desktop.';
  }
  return 'Log the day here. Full Life OS — insights, pipelines, focus room — on iPad or desktop.';
}

export function captureFooterLabel() {
  return isCapacitorNative() ? 'AIIMIN Android · capture shell' : 'Phone web capture';
}

export function accountAppNote() {
  if (isCapacitorNative()) {
    return 'You are in the AIIMIN Android app. Billing changes open in desktop account for now.';
  }
  return 'Install the Android app from Play Store when listed. Full OS on iPad or desktop.';
}
