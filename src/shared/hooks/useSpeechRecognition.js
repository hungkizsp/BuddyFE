import { useState, useEffect, useCallback } from 'react';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        // Cấu hình: Không nghe liên tục, chỉ trả về kết quả cuối cùng
        recog.continuous = false;
        recog.interimResults = false;
        recog.lang = 'en-US'; // Ưu tiên nhận diện tiếng Anh

        recog.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recog.onresult = (event) => {
          const current = event.resultIndex;
          const transcriptResult = event.results[current][0].transcript;
          setTranscript(transcriptResult.trim());
        };

        recog.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setError(event.error);
          setIsListening(false);
        };

        recog.onend = () => {
          setIsListening(false);
        };

        setRecognition(recog);
      } else {
        setError('Speech recognition not supported in this browser.');
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      setTranscript(''); // Xóa kết quả cũ trước khi nghe lại
      try {
        recognition.start();
      } catch (err) {
        console.error("Error starting recognition", err);
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
  }, [recognition, isListening]);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    isSupported: !!recognition,
    setTranscript, // Cho phép clear bên ngoài nếu cần
  };
}
