import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Faster journal speech:
 * - continuous=false (utterance mode — finals arrive sooner)
 * - interimResults=true for live preview
 * - auto-restart while user still wants listening (hold or toggle)
 * - no artificial start delay (caller should start immediately)
 */
export default function useJournalVoice({ onTranscript, enabled = true } = {}) {
  const recognitionRef = useRef(null);
  const wantListenRef = useRef(false);
  const onTranscriptRef = useRef(onTranscript);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const supported = typeof window !== 'undefined'
    && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const stop = useCallback(() => {
    wantListenRef.current = false;
    const recognition = recognitionRef.current;
    if (!recognition) {
      setIsListening(false);
      return;
    }
    try {
      recognition.onend = null;
      recognition.stop();
    } catch {
      // ignore
    }
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const startEngine = useCallback(() => {
    if (!supported || !enabled) return;
    setError('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    // Utterance mode is much snappier than continuous long sessions
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      let interim = '';
      let finalChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const piece = event.results[i][0]?.transcript || '';
        if (event.results[i].isFinal) finalChunk += piece;
        else interim += piece;
      }
      const cb = onTranscriptRef.current;
      if (!cb) return;
      if (finalChunk) cb(finalChunk, true);
      else if (interim) cb(interim, false);
    };

    recognition.onerror = (event) => {
      if (event.error === 'aborted' || event.error === 'no-speech') {
        // no-speech: keep listening if user still holding
        return;
      }
      if (event.error !== 'aborted') setError('Voice input failed. Try again.');
      wantListenRef.current = false;
      setIsListening(false);
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      if (wantListenRef.current && enabled) {
        // Instant restart while mic still held / toggle still on
        try {
          startEngine();
        } catch {
          setIsListening(false);
          wantListenRef.current = false;
        }
        return;
      }
      setIsListening(false);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch {
      setError('Could not start microphone.');
      setIsListening(false);
      wantListenRef.current = false;
    }
  }, [enabled, supported]);

  const toggle = useCallback(() => {
    if (!enabled) return;
    if (wantListenRef.current || isListening) {
      stop();
      return;
    }
    if (!supported) {
      setError("Browser doesn't support speech recognition.");
      return;
    }
    wantListenRef.current = true;
    startEngine();
  }, [enabled, isListening, startEngine, stop, supported]);

  useEffect(() => () => stop(), [stop]);

  return { isListening, supported, error, toggle, stop };
}
