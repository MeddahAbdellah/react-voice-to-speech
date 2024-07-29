# react-voice-to-text

`react-voice-to-text` is a lightweight, easy-to-use React hook that enables speech recognition in your web applications using the Web Speech API. This package allows you to seamlessly integrate voice-to-text functionality, making your application more accessible and interactive.

## Features

- **Start and stop speech recognition**
- **Receive transcription results in real-time**
- **Handle various speech recognition events**
- **Customizable options for language, interim results, and alternatives**
- **Support for error handling**

## Installation

To install `react-voice-to-text`, you can use npm or yarn:

```bash
npm install react-voice-to-text
```

or

```bash
yarn add react-voice-to-text
```

## Usage

Here is a basic example of how to use the `react-voice-to-text` hook in your React component:

```tsx
import { useState } from 'react';
import {
  useSpeechRecognition,
  isSpeechRecognitionSupported,
} from 'react-voice-to-text';

const VoiceToText = () => {
  const [transcript, setTranscript] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  if (!isSpeechRecognitionSupported()) {
    return <div>Sorry, your browser does not support speech recognition.</div>;
  }

  const { startRecording, stopRecording } = useSpeechRecognition({
    onStart: () => console.log('Started recording'),
    onEnd: (lastText: string, transcriptHistory: string[]) => {
      setTranscript(lastText);
      setHistory(transcriptHistory);
    },
    onStop: () => console.log('Stopped recording'),
    onError: (error) => console.error(error),
    lang: 'en-US',
    interimResults: true,
    maxAlternatives: 1,
  });

  return (
    <div>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <div>
        <h3>Transcript</h3>
        <p>{transcript}</p>
      </div>
      <div>
        <h3>History</h3>
        <ul>
          {history.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VoiceToText;
```
## DEMO

You can checkout how the library works in this stackblitz

## API

### `useSpeechRecognition(options: SpeechRecognitionOptions): SpeechRecognitionHandles & { recognition: Recognition }`

The `useSpeechRecognition` hook accepts an options object and returns handles for starting and stopping the recording, along with the recognition instance in case you need to customize the options further.

#### Options

- `onStart?`: Function called when speech recognition starts.
- `onResult?`: Function called when a speech recognition result is received.
- `onEnd?`: Function called when speech recognition ends. Receives the last recognized text and the history of all recognized texts.
- `onStop?`: Function called when speech recognition stops.
- `onError?`: Function called when an error occurs during speech recognition.
- `throwOnUnsupported?`: Boolean to throw an error if the browser does not support the Web Speech API. Default is `false`.
- `lang?`: Language for speech recognition. Default is `'fr-FR'`.
- `interimResults?`: Boolean to return interim results. Default is `false`.
- `maxAlternatives?`: Maximum number of recognition alternatives. Default is `1`.

#### Returns

- `startRecording`: Function to start the speech recognition.
- `stopRecording`: Function to stop the speech recognition.
- `recognition`: The recognition instance.

### `isSpeechRecognitionSupported(): boolean`

This function checks if the browser supports the Web Speech API.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.
