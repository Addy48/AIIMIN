/** Generate an 8-char OS-ID suggestion from a name (e.g. "Aaditya Upadhyay" → "AADIUP01"). */
export function suggestOsIdFromName(fullName = '') {
  const words = fullName.trim().split(/\s+/).filter((w) => /[a-zA-Z]/.test(w));
  const letters = (s) => s.replace(/[^a-zA-Z]/g, '').toUpperCase();

  let letterPart = '';
  if (words.length >= 2) {
    letterPart = letters(words[0]).slice(0, 4) + letters(words[words.length - 1]).slice(0, 2);
  } else if (words.length === 1) {
    letterPart = letters(words[0]).slice(0, 6);
  } else {
    return 'USER0001';
  }

  letterPart = letterPart.padEnd(6, 'X').slice(0, 6);
  return `${letterPart}01`;
}
