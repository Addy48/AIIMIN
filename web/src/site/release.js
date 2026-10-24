/**
 * The one public Android build. Filled in by B15 (release key + signed APK), never by hand guesswork:
 * `sha256` is `shasum -a 256` of the exact file at `url`. While `url` is null the /app page offers
 * the beta invite instead of a download, so no page links a build without its checksum (PRD 3.2, W7).
 */
export const RELEASE = {
  version: '4.0.0-beta03',
  url: null,
  sha256: null,
  sizeMb: null,
  date: null,
  minAndroid: 'Android 8.0',
  appId: 'in.aiimin.app',
};

export const hasDownload = () => Boolean(RELEASE.url && RELEASE.sha256);
