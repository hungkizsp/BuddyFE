// import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

const SpeechSDK = window.SpeechSDK;
// ─── Config from Vite env ─────────────────────────────────────────────────────
const SPEECH_KEY = import.meta.env.VITE_AZURE_SPEECH_KEY ?? '';
const SPEECH_REGION = import.meta.env.VITE_AZURE_SPEECH_REGION ?? 'eastasia';
const SPEECH_LANG = import.meta.env.VITE_AZURE_SPEECH_LANGUAGE ?? 'en-US';

// Pass thresholds (configurable via env)
const ACCURACY_THRESHOLD = Number(import.meta.env.VITE_ACCURACY_THRESHOLD ?? 80);
const COMPLETENESS_THRESHOLD = Number(import.meta.env.VITE_COMPLETENESS_THRESHOLD ?? 80);
const SIMILARITY_THRESHOLD = Number(import.meta.env.VITE_SIMILARITY_THRESHOLD ?? 0.75);

// Timeout (ms) if user doesn't speak
const SPEECH_TIMEOUT_MS = 7_000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalise a sentence for similarity comparison:
 * - lowercase
 * - expand common contractions
 * - strip punctuation
 * - strip common filler articles that shouldn't affect pass/fail
 */
function normalise(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    // expand contractions
    .replace(/where's/g, 'where is')
    .replace(/what's/g, 'what is')
    .replace(/there's/g, 'there is')
    .replace(/that's/g, 'that is')
    .replace(/it's/g, 'it is')
    .replace(/i'm/g, 'i am')
    .replace(/i've/g, 'i have')
    .replace(/i'll/g, 'i will')
    .replace(/i'd/g, 'i would')
    .replace(/you're/g, 'you are')
    .replace(/you've/g, 'you have')
    .replace(/you'll/g, 'you will')
    .replace(/you'd/g, 'you would')
    .replace(/don't/g, 'do not')
    .replace(/doesn't/g, 'does not')
    .replace(/didn't/g, 'did not')
    .replace(/won't/g, 'will not')
    .replace(/can't/g, 'cannot')
    .replace(/couldn't/g, 'could not')
    .replace(/wouldn't/g, 'would not')
    .replace(/shouldn't/g, 'should not')
    .replace(/isn't/g, 'is not')
    .replace(/aren't/g, 'are not')
    .replace(/wasn't/g, 'was not')
    .replace(/weren't/g, 'were not')
    .replace(/haven't/g, 'have not')
    .replace(/hasn't/g, 'has not')
    // strip punctuation
    .replace(/[.,!?;:'"()\-–—]/g, ' ')
    // collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Compute word-overlap Jaccard similarity between two sentences.
 * Ignores filler words like "the", "a", "an".
 */
const FILLER_WORDS = new Set(['the', 'a', 'an', 'to', 'of', 'and', 'or', 'in', 'at', 'on', 'is', 'be']);

function wordSimilarity(a, b) {
  const wordsA = new Set(
    normalise(a).split(' ').filter(w => w && !FILLER_WORDS.has(w))
  );
  const wordsB = new Set(
    normalise(b).split(' ').filter(w => w && !FILLER_WORDS.has(w))
  );

  if (wordsA.size === 0 && wordsB.size === 0) return 1;
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersection = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) intersection++;
  }
  const union = wordsA.size + wordsB.size - intersection;
  return intersection / union;
}

/**
 * Determine pass/fail from pronunciation scores + word similarity.
 *
 * PASS if:
 *   (accuracyScore >= threshold AND completenessScore >= threshold)
 *   OR wordSimilarity(transcript, expectedSentence) >= similarity_threshold
 */
function computePassed(scores, transcript, expectedSentence) {
  const { accuracyScore, completenessScore } = scores;
  const scorePass =
    accuracyScore >= ACCURACY_THRESHOLD &&
    completenessScore >= COMPLETENESS_THRESHOLD;

  const simPass =
    wordSimilarity(transcript, expectedSentence) >= SIMILARITY_THRESHOLD;

  return scorePass || simPass;
}

// ─── Core function ────────────────────────────────────────────────────────────

/**
 * Run Azure pronunciation assessment for one utterance.
 *
 * @param {string} expectedSentence  The sentence the learner should speak.
 * @returns {Promise<AssessmentResult>}
 * @throws {Error} with `.code` set to one of:
 *   'NO_KEY'         — VITE_AZURE_SPEECH_KEY not configured
 *   'MIC_DENIED'     — microphone permission denied
 *   'TIMEOUT'        — user didn't speak within 10 s
 *   'NO_MATCH'       — speech detected but couldn't be recognised
 *   'CANCELLED'      — recognizer was cancelled (network / auth error)
 */
export async function assessSpeech(expectedSentence) {
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
      expectedSentence,
      SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
      SpeechSDK.PronunciationAssessmentGranularity.Phoneme,
      /* enableMiscue */ true,
    );
    pronConfig.enableProsodyAssessment = true;

    pronConfig.phonemeAlphabet = "IPA";

    pronConfig.nBestPhonemeCount = 5;

    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    pronConfig.applyTo(recognizer);

    // ── Timeout guard ────────────────────────────────────────────────────────
    let resolved = false;
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        recognizer.stopContinuousRecognitionAsync();
        recognizer.close();
        const err = new Error('No speech detected within 10 seconds. Please try again.');
        err.code = 'TIMEOUT';
        reject(err);
      }
    }, SPEECH_TIMEOUT_MS);

    // ── Event handlers ───────────────────────────────────────────────────────
    recognizer.recognized = (_, event) => {
      if (resolved) return;

      if (event.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        resolved = true;
        clearTimeout(timeoutId);

        const pronResult = SpeechSDK.PronunciationAssessmentResult.fromResult(event.result);
        const transcript = event.result.text || '';
        const rawJsonString = event.result.properties.getProperty(
          SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult
        );

        const rawJson = rawJsonString ? JSON.parse(rawJsonString) : null;

        // console.log(rawJson);
        // const json = JSON.stringify(rawJson, null, 2);

        // const blob = new Blob([json], { type: "application/json" });
        // const url = URL.createObjectURL(blob);

        // const a = document.createElement("a");
        // a.href = url;
        // a.download = "assessment.json";
        // a.click();

        // URL.revokeObjectURL(url);
        const scores = {
          pronunciationScore: Math.round(pronResult.pronunciationScore ?? 0),
          accuracyScore: Math.round(pronResult.accuracyScore ?? 0),
          fluencyScore: Math.round(pronResult.fluencyScore ?? 0),
          completenessScore: Math.round(pronResult.completenessScore ?? 0),
        };

        const passed = computePassed(scores, transcript, expectedSentence);

        recognizer.stopContinuousRecognitionAsync(() => recognizer.close());
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
        recognizer.stopContinuousRecognitionAsync(() => recognizer.close());
        const err = new Error("Speech was detected but couldn't be recognised. Please speak clearly.");
        err.code = 'NO_MATCH';
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
        msg = 'Azure Speech authentication failed. Check your VITE_AZURE_SPEECH_KEY and VITE_AZURE_SPEECH_REGION.';
      }

      const err = new Error(msg);
      err.code = code;
      reject(err);
    };

    // ── Start ────────────────────────────────────────────────────────────────
    recognizer.startContinuousRecognitionAsync(
      () => { /* started successfully */ },
      (err) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          recognizer.close();
          const error = new Error(`Failed to start recognizer: ${err}`);
          error.code = 'START_FAILED';
          reject(error);
        }
      },
    );
  });
}
