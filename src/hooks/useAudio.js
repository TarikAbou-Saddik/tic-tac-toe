import { useState, useEffect, useRef, useCallback } from 'react';
import { createAudioBuffer } from '../Utils/Utils';

export const useAudio = filePath => {
  const audioContext = useRef(null);
  const [audioBuffer, setAudioBuffer] = useState(null);

  useEffect(() => {
    const getFile = async (audioContext, filePath) => {
      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await createAudioBuffer(arrayBuffer, audioContext);
      setAudioBuffer(buffer);
    };

    audioContext.current = new (window.AudioContext ||
      window.webkitAudioContext)();

    getFile(audioContext.current, filePath);
  }, [filePath]);

  const playback = useCallback(async () => {
    await audioContext.current.resume();
    const playSound = audioContext.current.createBufferSource();
    playSound.buffer = audioBuffer;
    playSound.connect(audioContext.current.destination);
    playSound.start(0);
  }, [audioBuffer]);

  return [playback, audioContext.current];
};
