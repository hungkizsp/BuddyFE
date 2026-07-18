import { useCallback, useEffect, useRef, useState } from 'react';
import { assessSpeech, synthesizeSpeech } from '../services/speechService';
import axiosClient from '../../../shared/api/axiosClient';

// ─── Score pill colour helper ─────────────────────────────────────────────────
function scoreColour(value) {
  if (value >= 90) return 'voice-mission__score-pill--great';
  if (value >= 75) return 'voice-mission__score-pill--ok';
  return 'voice-mission__score-pill--poor';
}

/**
 * VoiceMission
 *
 * Renders a voice-prompt UI. Player clicks "Start Talking", speaks the
 * expected sentence, and gets success/fail feedback with pronunciation scores.
 *
 * Uses Azure Cognitive Services Speech SDK (via speechService.js).
 *
 * States:
 * - status: 'idle' | 'listening' | 'processing' | 'result' | 'error'
 * - passed: boolean (whether the assessment met success rules)
 *
 * Props:
 *  expectedSentence  – string from activeStep
 *  onSuccess()       – advance to next step (called when Return is clicked)
 *  onFail(transcript)– callback on failure (can be used to update parent/buddy text)
 *  onEvaluate(data)  – callback when evaluation completes successfully
 *  disabled          – freeze interaction
 */
export default function VoiceMission({
  expectedSentence = '',
  scenarioId,
  stepOrder,
  onSuccess,
  onFail,
  onEvaluate,
  disabled = false,
  returnLabel = '← Return to Supermarket',
  successHint = 'Ah! the meat counter is on the left side',
}) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'listening' | 'processing' | 'result' | 'error'
  const [transcript, setTranscript] = useState('');
  const [scores, setScores] = useState(null); // { pronunciationScore, accuracyScore, fluencyScore, completenessScore }
  const [errorMsg, setErrorMsg] = useState('');
  const [passed, setPassed] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null); // full result from assessSpeech

  // Evaluate states
  const [evaluateStatus, setEvaluateStatus] = useState('idle'); // 'idle' | 'loading' | 'done' | 'error'
  const [evaluateFeedback, setEvaluateFeedback] = useState(null);
  const [evaluateError, setEvaluateError] = useState('');

  // Track whether a recognition session is in flight so we never start two
  const busyRef = useRef(false);

  // Cancel / cleanup on unmount
  const abortRef = useRef(false);
  useEffect(() => {
    abortRef.current = false;
    return () => {
      abortRef.current = true;
    };
  }, []);

  const handleRecognize = async (transcript) => {
    const res = await axiosClient.post('/speech/recognize', {
      scenarioId: Number(scenarioId),
      stepOrder: Number(stepOrder),
      transcript,
    });

    return res.data.data || res.data;
  };
  const handleStart = useCallback(async () => {
    if (disabled || busyRef.current) return;

    busyRef.current = true;
    setTranscript('');
    setScores(null);
    setErrorMsg('');
    setPassed(false);
    setStatus('speaking');
    setAssessmentResult(null);
    setEvaluateStatus('idle');
    setEvaluateFeedback(null);
    setEvaluateError('');

    try {
      if (expectedSentence) {
        await synthesizeSpeech(expectedSentence);
      }
      if (abortRef.current) return;
      
      setStatus('listening');
      const result = await assessSpeech();
      // console.log(JSON.stringify(result, null, 2));
      if (abortRef.current) return; // component unmounted mid-flight
      setAssessmentResult(result);

      setTranscript(result.transcript);

      setScores({
        pronunciationScore: result.pronunciationScore,
        accuracyScore: result.accuracyScore,
        fluencyScore: result.fluencyScore,
        completenessScore: result.completenessScore,
      });
      if (Number(scenarioId) === 3) {

        const recognize = await handleRecognize(result.transcript);

        const matched = recognize.matched;

        setPassed(matched);

        if (!matched) {
          setErrorMsg(recognize.feedback || "That's not the correct order.");
          onFail?.(result.transcript);
        }

      } else {

        // Các scene khác vẫn dùng pronunciation
        setPassed(result.passed);

        if (!result.passed) {
          onFail?.(result.transcript);
        }
      }

      setStatus('result');
    } catch (err) {
      if (abortRef.current) return;

      const message = err?.message ?? 'An unexpected error occurred.';
      setErrorMsg(message);
      setStatus('error');
      onFail?.('');
    } finally {
      busyRef.current = false;
    }
  }, [disabled, onFail]);

  const handleReturn = () => {
    onSuccess?.();
  };

  const handleRetry = () => {
    handleStart();
  };
  const handleEvaluate = async () => {
    if (!assessmentResult) return;
    setEvaluateStatus('loading');
    setEvaluateFeedback(null);
    setEvaluateError('');

    try {
      const res = await axiosClient.post('/speech/evaluate', {
        expectedSentence,
        assessment: {
          transcript: assessmentResult.transcript,
          pronunciationScore: assessmentResult.pronunciationScore,
          accuracyScore: assessmentResult.accuracyScore,
          fluencyScore: assessmentResult.fluencyScore,
          completenessScore: assessmentResult.completenessScore,
          prosodyScore: assessmentResult.prosodyScore,
          words: assessmentResult.words,
        },
        // transcript: assessmentResult.transcript,
        // scenarioId: Number(scenarioId),
        // stepOrder: Number(stepOrder),
      });
      const feedbackData = res.data?.data || res.data;

      // Update passed state based on backend semantic match
      // setPassed(true);

      setEvaluateFeedback(feedbackData);
      setEvaluateStatus('done');
      onEvaluate?.(feedbackData);
    } catch (err) {
      setEvaluateError(err.message || 'Evaluation failed');
      setEvaluateStatus('error');
    }
  };

  const isListening = status === 'listening';
  const isProcessing = status === 'processing';
  const isSpeaking = status === 'speaking';

  return (
    <div className="voice-mission">
      {/* Expected sentence prompt */}
      <div className="voice-mission__prompt">
        <span className="voice-mission__prompt-label">Say:</span>
        <p className="voice-mission__expected">"{expectedSentence}"</p>
      </div>

      {status === 'idle' && (
        <button
          type="button"
          id="voice-mission-btn"
          className="voice-btn"
          onClick={handleStart}
          disabled={disabled}
          aria-label="Start Talking"
        >
          <span className="voice-btn__icon">🎙️</span>
          <span className="voice-btn__label">Start Talking</span>
        </button>
      )}

      {/* Listening or Processing states */}
      {(isSpeaking || isListening || isProcessing) && (
        <div className="voice-mission__listening-container">
          <button
            type="button"
            className="voice-btn voice-btn--listening"
            disabled={true}
            aria-label={isProcessing ? "Processing…" : isSpeaking ? "Speaking…" : "Listening…"}
          >
            <span className="voice-btn__icon">{isProcessing ? '⏳' : isSpeaking ? '🔊' : '🔴'}</span>
            <span className="voice-btn__label">{isProcessing ? 'Processing…' : isSpeaking ? 'Speaking…' : 'Listening…'}</span>
          </button>
          {isListening && (
            <div className="voice-mission__waves" aria-hidden="true">
              <span /><span /><span /><span /><span />
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="voice-mission__error-container">
          {errorMsg && (
            <div className="voice-mission__error" role="alert">
              <span className="voice-mission__error-icon">⚠️</span>
              <p>{errorMsg}</p>
            </div>
          )}
          <div className="voice-mission__actions" style={{ marginTop: '20px', display: 'flex', gap: '12px', width: '100%' }}>
            <button
              type="button"
              className="voice-mission__retry-btn"
              onClick={handleRetry}
              style={{ flex: 1 }}
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      )}

      {/* Result state (Duolingo card style results) */}
      {status === 'result' && (
        <div className="voice-mission__result-card">
          <div className="voice-mission__result-columns">
            {/* Left column: badge, transcript, scores, actions */}
            <div className="voice-mission__result-left">
              <div className="voice-mission__result-header">
                {passed ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div className="voice-mission__badge voice-mission__badge--success">
                      <span className="voice-mission__badge-icon">✅</span>
                      <span className="voice-mission__badge-text">Success! Great job!</span>
                    </div>
                    {successHint ? (
                      <p className="voice-mission__success-hint" style={{ margin: '4px 0 0 0', fontFamily: 'var(--font-game)', fontSize: '15px', color: '#16a34a', textAlign: 'center', fontWeight: 'bold' }}>
                        {successHint}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="voice-mission__badge voice-mission__badge--fail">
                    <span className="voice-mission__badge-icon">❌</span>
                    <span className="voice-mission__badge-text">Keep practicing!</span>
                  </div>
                )}
              </div>

              {transcript && (
                <div
                  className={`voice-mission__transcript ${passed ? 'voice-mission__transcript--success' : 'voice-mission__transcript--fail'
                    }`}
                >
                  <span className="voice-mission__transcript-label">You said:</span>
                  <p>"{transcript}"</p>
                </div>
              )}
              {Number(scenarioId) === 3 && errorMsg && !passed && (
                <div className="voice-mission__semantic-error">
                  {errorMsg}
                </div>
              )}

              {scores && (
                <div className="voice-mission__scores" aria-label="Pronunciation scores">
                  <div className={`voice-mission__score-pill ${scoreColour(scores.pronunciationScore)}`}>
                    <span className="voice-mission__score-pill-label">Pronunciation</span>
                    <span className="voice-mission__score-pill-value">{scores.pronunciationScore}</span>
                  </div>
                  <div className={`voice-mission__score-pill ${scoreColour(scores.accuracyScore)}`}>
                    <span className="voice-mission__score-pill-label">Accuracy</span>
                    <span className="voice-mission__score-pill-value">{scores.accuracyScore}</span>
                  </div>
                  <div className={`voice-mission__score-pill ${scoreColour(scores.fluencyScore)}`}>
                    <span className="voice-mission__score-pill-label">Fluency</span>
                    <span className="voice-mission__score-pill-value">{scores.fluencyScore}</span>
                  </div>
                  <div className={`voice-mission__score-pill ${scoreColour(scores.completenessScore)}`}>
                    <span className="voice-mission__score-pill-label">Completeness</span>
                    <span className="voice-mission__score-pill-value">{scores.completenessScore}</span>
                  </div>
                </div>
              )}

              <div className="voice-mission__actions">
                {!passed && (
                  <button
                    type="button"
                    className="voice-mission__retry-btn"
                    onClick={handleRetry}
                  >
                    🔄 Try Again
                  </button>
                )}
                <button
                  type="button"
                  className={`voice-mission__return-btn ${passed ? 'voice-mission__return-btn--pass' : ''}`}
                  onClick={handleReturn}
                  disabled={!passed}
                >
                  {returnLabel}
                </button>
              </div>
            </div>

            {/* Right column: evaluate feedback */}
            <div className="voice-mission__result-right">
              {evaluateStatus === 'done' && evaluateFeedback ? (
                <div className="voice-mission__evaluate-feedback">
                  {typeof evaluateFeedback === 'string' ? (
                    evaluateFeedback
                  ) : evaluateFeedback.overallFeedback ? (
                    <>
                      <div className="evaluate-overall">
                        <span className="evaluate-overall__icon">📊</span>
                        <p className="evaluate-overall__text">{evaluateFeedback.overallFeedback}</p>
                      </div>

                      {evaluateFeedback.strengths?.length > 0 && (
                        <div className="evaluate-section">
                          <h4 className="evaluate-section__title evaluate-section__title--strength">💪 Điểm mạnh</h4>
                          <ul className="evaluate-list">
                            {evaluateFeedback.strengths.map((s, i) => (
                              <li key={i} className="evaluate-list__item evaluate-list__item--strength">{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {evaluateFeedback.weaknesses?.length > 0 && (
                        <div className="evaluate-section">
                          <h4 className="evaluate-section__title evaluate-section__title--weakness">🎯 Cần cải thiện</h4>
                          <ul className="evaluate-list">
                            {evaluateFeedback.weaknesses.map((w, i) => (
                              <li key={i} className="evaluate-list__item evaluate-list__item--weakness">{w}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {evaluateFeedback.improvementTips?.length > 0 && (
                        <div className="evaluate-section">
                          <h4 className="evaluate-section__title evaluate-section__title--tip">📝 Mẹo</h4>
                          <ul className="evaluate-list">
                            {evaluateFeedback.improvementTips.map((t, i) => (
                              <li key={i} className="evaluate-list__item evaluate-list__item--tip">{t}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {evaluateFeedback.wordFeedback?.length > 0 && (
                        <div className="evaluate-section">
                          <h4 className="evaluate-section__title evaluate-section__title--word">📖 Từng từ</h4>
                          {evaluateFeedback.wordFeedback.map((wf, i) => (
                            <div key={i} className="evaluate-word-card">
                              <span className="evaluate-word-card__word">"{wf.word}"</span>
                              <p className="evaluate-word-card__problem">{wf.problem}</p>
                              {wf.tip && <p className="evaluate-word-card__tip">💡 {wf.tip}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p>{evaluateFeedback.feedback || evaluateFeedback.message || JSON.stringify(evaluateFeedback, null, 2)}</p>
                  )}
                </div>
              ) : evaluateStatus === 'error' ? (
                <div className="voice-mission__evaluate-error">
                  <span>{evaluateError}</span>
                  <button
                    type="button"
                    className="voice-mission__evaluate-retry-btn"
                    onClick={handleEvaluate}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="voice-mission__evaluate-btn"
                  onClick={handleEvaluate}
                  disabled={evaluateStatus === 'loading' || !assessmentResult}
                >
                  {evaluateStatus === 'loading' ? (
                    <>
                      <span className="voice-mission__evaluate-spinner" />
                      Evaluating...
                    </>
                  ) : (
                    'Evaluate'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
