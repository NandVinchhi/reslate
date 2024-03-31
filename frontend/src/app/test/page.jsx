'use client';
import React, { useState, useEffect } from 'react';

const SpeechRecognitionComponent = () => {
  const [interimResult, setInterimResult] = useState('');
  const [finalResult, setFinalResult] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.interimResults = true;
    recognitionInstance.continuous = true;

    let finalTranscript = '';
    let lastFinalResultIndex = 0;

    recognitionInstance.onresult = (event) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (event.results.length > lastFinalResultIndex) {
        const words = interimTranscript.trim().split(' ');
        if (words.length >= 2) {
          setInterimResult(words.slice(0, 2).join(' '));
          console.log("The interim result", words.slice(0, 2).join(' '));
        }
        lastFinalResultIndex = event.results.length;
      }

      if (finalTranscript !== '') {
        setFinalResult(finalTranscript);
        console.log("The final transcript", finalTranscript);
        setInterimResult('');
        finalTranscript = '';
      }
    };

    setRecognition(recognitionInstance);

    return () => {
      recognitionInstance.stop();
    };
  }, []);

  const startRecognition = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const stopRecognition = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return (
    <div>
      <button onClick={() => {
        if (muted) {
          startRecognition()
          setMuted(false);
        } else {
          stopRecognition()
          setMuted(true);
        }
      }}>{muted ? "Unmute" : "Mute"}</button>
    </div>
  );
};

export default SpeechRecognitionComponent;