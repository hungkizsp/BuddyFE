import { useEffect, useRef, useState } from 'react';

export function useTalkingTom(isActive = true) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const silenceTimerRef = useRef(null);
  
  const isRecordingRef = useRef(false);
  const isBuddySpeakingRef = useRef(false);
  const animationFrameIdRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    let isComponentMounted = true;

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!isComponentMounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 512;
        
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);

        mediaRecorderRef.current = new MediaRecorder(stream);
        
        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          if (audioChunksRef.current.length === 0) return;
          const mimeType = mediaRecorderRef.current.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          audioChunksRef.current = []; // reset
          playEcho(audioBlob);
        };

        monitorVolume();
      } catch (err) {
        console.error("Microphone access denied or error:", err);
      }
    };

    const monitorVolume = () => {
      if (!analyserRef.current) return;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const checkVolume = () => {
        if (!isComponentMounted) return;

        if (isBuddySpeakingRef.current) {
          // Pause monitoring while buddy is playing back to avoid feedback loop
          animationFrameIdRef.current = requestAnimationFrame(checkVolume);
          return;
        }

        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const averageVolume = sum / bufferLength;

        // VAD Thresholds
        const VOLUME_THRESHOLD = 15; // Tweak this if it picks up too much background noise
        const SILENCE_DURATION = 1000; // 1 second of silence stops the recording

        if (averageVolume > VOLUME_THRESHOLD) {
          // User is speaking
          if (!isRecordingRef.current) {
            isRecordingRef.current = true;
            setIsListening(true);
            try { mediaRecorderRef.current.start(); } catch(e){}
          }
          // Reset silence timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        } else {
          // Silence
          if (isRecordingRef.current && !silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => {
              isRecordingRef.current = false;
              setIsListening(false);
              try { mediaRecorderRef.current.stop(); } catch(e){}
              silenceTimerRef.current = null;
            }, SILENCE_DURATION);
          }
        }

        animationFrameIdRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    };

    const playEcho = (blob) => {
      isBuddySpeakingRef.current = true;
      setIsSpeaking(true);

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      // Pitch shift / Chipmunk effect
      audio.playbackRate = 1.4; 
      audio.preservesPitch = false; // Required for pitch shifting in modern browsers

      audio.onended = () => {
        if (!isComponentMounted) return;
        isBuddySpeakingRef.current = false;
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };

      audio.play().catch(e => {
        console.error("Talking Tom audio play failed", e);
        if (!isComponentMounted) return;
        isBuddySpeakingRef.current = false;
        setIsSpeaking(false);
      });
    };

    initAudio();

    return () => {
      isComponentMounted = false;
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isActive]);

  return { isListening, isSpeaking };
}
