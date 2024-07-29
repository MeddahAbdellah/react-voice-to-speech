export interface SpeechRecognitionOptions {
  onStart?: () => void;
  onResult?: (event: SpeechRecognitionEvent) => void;
  onEnd?: (lastText: string, transcriptHistory: string[]) => void;
  onStop?: () => void;
  onError?: (error: Error) => void;
  throwOnUnsupported?: boolean,
}

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

type SpeechRecognitionEventListener = 
  ((eventName: 'error', callback: (event: Error) => void) => void) &
  ((eventName: 'start' | 'result' | 'end', callback: (event: SpeechRecognitionEvent) => void) => void);


type SpeechRecognition = new () => {
  lang: string,
  interimResults: boolean,
  maxAlternatives: number,
  addEventListener: SpeechRecognitionEventListener,
  start: () => void;
  stop: () => void;
}

export interface SpeechRecognitionHandles {
  startRecording: () => void,
  stopRecording: () => void,
}

export function isSpeechRecognitionSupported(): boolean {
  if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
    return false;
  }
  const SpeechRecognition = (window['SpeechRecognition'] || window['webkitSpeechRecognition']) as SpeechRecognition;
  if (!SpeechRecognition) {
    return false;
  }
  return true
}


export function useSpeechRecognition({
  throwOnUnsupported,
  onStart = () => {},
  onResult = () => {},
  onEnd = () => {},
  onStop = () => {},
  onError = () => {},
}: SpeechRecognitionOptions = {}): SpeechRecognitionHandles {
  if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
    if (throwOnUnsupported) {
      throw new Error("Browser doesn't support the Web Speech API");
    } else {
      console.error("Browser doesn't support the Web Speech API");
      return;
    }
  }
  const SpeechRecognition = (window['SpeechRecognition'] || window['webkitSpeechRecognition']) as SpeechRecognition;
  if (!SpeechRecognition) {
    if (throwOnUnsupported) {
      throw new Error("Browser doesn't support the Web Speech API");
    } else {
      console.error("Browser doesn't support the Web Speech API");
      return;
    }
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'fr-Fr';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const transcriptHistory: string[] = [];
  let lastText: string = '';

  recognition.addEventListener('start', () => {
    onStart();
  });

  recognition.addEventListener('result', (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript;
    lastText = transcript;
    transcriptHistory.push(transcript);
    onResult(event);
  });

  recognition.addEventListener('error', (event) => {
    onError(event);
  });

  recognition.addEventListener('end', () => {
    onEnd(lastText, transcriptHistory);
  });

  const startRecording = () => {
    recognition.start();
  };

  const stopRecording = () => {
    onStop();
    recognition.stop();
  };

  return {
    startRecording,
    stopRecording,
  };
}
