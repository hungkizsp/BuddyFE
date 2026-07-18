// import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

const SpeechSDK = window.SpeechSDK;
// ─── Config from Vite env ─────────────────────────────────────────────────────
const SPEECH_KEY = import.meta.env.VITE_AZURE_SPEECH_KEY ?? '';
const SPEECH_REGION = import.meta.env.VITE_AZURE_SPEECH_REGION ?? 'eastasia';
const SPEECH_LANG = import.meta.env.VITE_AZURE_SPEECH_LANGUAGE ?? 'en-US';

// Pass thresholds (configurable via env)
const ACCURACY_THRESHOLD = Number(import.meta.env.VITE_ACCURACY_THRESHOLD ?? 80);
const FLUENCY_THRESHOLD = Number(import.meta.env.VITE_FLUENCY_THRESHOLD ?? 80);
const SIMILARITY_THRESHOLD = Number(import.meta.env.VITE_SIMILARITY_THRESHOLD ?? 0.75);
const COVERAGE_THRESHOLD = Number(import.meta.env.VITE_COVERAGE_THRESHOLD ?? 0.8);

// Timeout (ms) if user doesn't speak
const SPEECH_TIMEOUT_MS = 7_000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ─── Core function ────────────────────────────────────────────────────────────

/**
 * Run Azure pronunciation assessment for one utterance (unscripted/freeform).
 *
 * @returns {Promise<AssessmentResult>}
 * @throws {Error} with `.code` set to one of:
 *   'NO_KEY'         — VITE_AZURE_SPEECH_KEY not configured
 *   'MIC_DENIED'     — microphone permission denied
 *   'TIMEOUT'        — user didn't speak within 10 s
 *   'NO_MATCH'       — speech detected but couldn't be recognised
 *   'CANCELLED'      — recognizer was cancelled (network / auth error)
 */
export async function assessSpeech() {
  if (!SPEECH_KEY) {
    const err = new Error('Azure Speech key is not configured. Set VITE_AZURE_SPEECH_KEY in .env.local');
    err.code = 'NO_KEY';
    throw err;
  }

  // Request mic permission explicitly so we can give a friendly error
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    const err = new Error('Microphone access was denied. Please allow microphone access and try again.');
    err.code = 'MIC_DENIED';
    throw err;
  }

  return new Promise((resolve, reject) => {
    // ── SDK setup ────────────────────────────────────────────────────────────
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
    speechConfig.speechRecognitionLanguage = SPEECH_LANG;

    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

    const pronConfig = new SpeechSDK.PronunciationAssessmentConfig(
      "",
      SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
      SpeechSDK.PronunciationAssessmentGranularity.Phoneme,
      /* enableMiscue */ false,
    );
    pronConfig.enableProsodyAssessment = true;
    pronConfig.phonemeAlphabet = "IPA";
    pronConfig.nBestPhonemeCount = 5;

    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    pronConfig.applyTo(recognizer);

    console.log("SpeechSDK Version:", SpeechSDK.Version);

    let resolved = false;
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        recognizer.close();
        const err = new Error(`No speech detected within ${SPEECH_TIMEOUT_MS / 1000} seconds.`);
        err.code = 'TIMEOUT';
        reject(err);
      }
    }, SPEECH_TIMEOUT_MS);

    // ── Event handlers ───────────────────────────────────────────────────────
    recognizer.recognizing = (_, e) => {
      console.log("📝 Recognizing:", e.result.text);
    };

    // ✅ QUAN TRỌNG: Xử lý kết quả trong recognized event
    recognizer.recognized = (_, event) => {
      if (resolved) return;

      console.log("✅ Recognized");
      console.log("Reason:", event.result.reason);
      console.log("Text:", event.result.text);

      try {
        if (event.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
          resolved = true;
          clearTimeout(timeoutId);

          const pronResult = SpeechSDK.PronunciationAssessmentResult.fromResult(event.result);
          const transcript = event.result.text || '';
          const rawJsonString = event.result.properties.getProperty(
            SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult
          );

          const rawJson = rawJsonString ? JSON.parse(rawJsonString) : null;
          console.log("Raw json: ", rawJson);
          const scores = {
            pronunciationScore: Math.round(pronResult.pronunciationScore ?? 0),
            accuracyScore: Math.round(pronResult.accuracyScore ?? 0),
            fluencyScore: Math.round(pronResult.fluencyScore ?? 0),
            completenessScore: Math.round(pronResult.completenessScore ?? 0),
          };

          const passed =
            scores.accuracyScore >= ACCURACY_THRESHOLD &&
            scores.fluencyScore >= FLUENCY_THRESHOLD;

          const assessment = rawJson?.NBest?.[0];
          const words = assessment?.Words?.map(word => ({
            word: word.Word,
            accuracy: word.PronunciationAssessment?.AccuracyScore ?? null,
            errorType: word.PronunciationAssessment?.ErrorType ?? "None",
            phonemes: word.Phonemes?.map(p => ({
              phoneme: p.Phoneme,
              accuracy: p.PronunciationAssessment?.AccuracyScore ?? null,
            })) ?? [],
          })) ?? [];

          const prosodyScore = Math.round(
            assessment?.PronunciationAssessment?.ProsodyScore ?? 0
          );

          // ✅ Đóng recognizer SAU KHI đã lấy hết dữ liệu
          recognizer.close();

          resolve({
            transcript,
            ...scores,
            prosodyScore,
            passed,
            words,
            rawJson,
          });

        } else if (event.result.reason === SpeechSDK.ResultReason.NoMatch) {
          resolved = true;
          clearTimeout(timeoutId);
          recognizer.close();
          const err = new Error("Speech was detected but couldn't be recognised.");
          err.code = 'NO_MATCH';
          reject(err);
        }
      } catch (processingErr) {
        console.error("Error processing recognition result:", processingErr);
        resolved = true;
        clearTimeout(timeoutId);
        try { recognizer.close(); } catch { }
        const err = new Error('Failed to process the recognition result.');
        err.code = 'PROCESSING_ERROR';
        reject(err);
      }
    };

    recognizer.canceled = (_, event) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeoutId);
      recognizer.close();

      const detail = event.errorDetails ?? 'Unknown error';
      let code = 'CANCELLED';
      let msg = `Speech recognition was cancelled: ${detail}`;

      if (event.errorCode === SpeechSDK.CancellationErrorCode.AuthenticationFailure) {
        code = 'AUTH_FAILURE';
        msg = 'Azure Speech authentication failed.';
      }

      const err = new Error(msg);
      err.code = code;
      reject(err);
    };

    // ✅ SỬA: Sử dụng startContinuousRecognitionAsync thay vì recognizeOnceAsync
    // và chỉ gọi stopContinuousRecognitionAsync sau khi có kết quả
    recognizer.startContinuousRecognitionAsync(
      () => {
        console.log("🟢 Continuous recognition started");
      },
      (err) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          recognizer.close();
          const error = new Error(`Failed to start recognizer: ${err}`);
          error.code = 'START_FAILED';
          reject(error);
        }
      }
    );

    // ⚠️ Quan trọng: Thêm handler cho sessionStopped để cleanup
    recognizer.sessionStopped = (_, e) => {
      console.log("🔴 Session Stopped", e);
      // Không đóng recognizer ở đây vì đã đóng trong recognized/canceled
    };
  });
}

/**
 * Synthesize text to speech using Azure.
 * @param {string} text - The text to speak.
 * @returns {Promise<void>}
 */
export async function synthesizeSpeech(text) {
  const SpeechSDK = window.SpeechSDK;
  if (!SPEECH_KEY) {
    const err = new Error('Azure Speech key is not configured.');
    err.code = 'NO_KEY';
    throw err;
  }

  return new Promise((resolve, reject) => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
    speechConfig.speechSynthesisLanguage = SPEECH_LANG;
    // Set a natural voice (can be customised based on VITE env later)
    speechConfig.speechSynthesisVoiceName = 'en-US-AnaNeural';

    // We pass null for AudioConfig so the SDK doesn't auto-play.
    // We will play it manually to detect exactly when playback finishes.
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, null);

    synthesizer.speakTextAsync(
      text,
      (result) => {
        synthesizer.close();
        if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          const audioData = result.audioData;
          if (!audioData || audioData.byteLength === 0) {
            return resolve(); // No audio data, just resolve
          }

          try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContext.decodeAudioData(audioData.slice(0), (buffer) => {
              const source = audioContext.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContext.destination);
              source.onended = () => {
                resolve();
              };
              source.start(0);
            }, (decodeErr) => {
              console.error("Audio decode error:", decodeErr);
              resolve(); // fallback to immediate resolve if decode fails
            });
          } catch (e) {
            console.error("AudioContext error:", e);
            resolve(); // fallback
          }
        } else {
          reject(new Error(`Speech synthesis failed: ${result.errorDetails}`));
        }
      },
      (err) => {
        synthesizer.close();
        reject(err);
      }
    );
  });
}