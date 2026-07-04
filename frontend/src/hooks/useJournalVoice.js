import { useCallback, useEffect, useRef, useState } from 'react';

export default function useJournalVoice({ onTranscript, enabled = true } = {}) {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');

  const supported = typeof window !== 'undefined'
    && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.stop();
    } catch {
      // ignore
    }
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const toggle = useCallback(() => {
    if (!enabled) return;
    if (isListening) {
      stop();
      return;
    }
    if (!supported) {
      setError("Browser doesn't support speech recognition.");
      return;
    }

    setError('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      if (transcript && onTranscript) onTranscript(transcript, event.results[event.results.length - 1]?.isFinal);
    };

    recognition.onerror = (event) => {
      if (event.error !== 'aborted') setError('Voice input failed. Try again.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch {
      setError('Could not start microphone.');
      setIsListening(false);
    }
  }, [enabled, isListening, onTranscript, stop, supported]);

  useEffect(() => () => stop(), [stop]);

  return { isListening, supported, error, toggle, stop };
}
