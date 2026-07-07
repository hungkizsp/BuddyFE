import { normaliseKey, normaliseWord } from './vocabularyUtils';

export const INTENT_MISSION_COMPLETE = 'MISSION_COMPLETE';

export const formatEntityLabel = (entity = '') =>
  entity
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ');

export const getStepLabel = (step) =>
  step?.stepTitle || step?.title || step?.categoryLabel || formatEntityLabel(step?.expectedEntity);

export const getGameplaySteps = (steps = []) =>
  steps.filter((step) => step?.expectedIntent !== INTENT_MISSION_COMPLETE);

export const getVocabularyCategory = (vocabulary = {}) =>
  vocabulary.category ||
  vocabulary.entity ||
  vocabulary.group ||
  vocabulary.groupName ||
  vocabulary.menuCategory ||
  '';

const matchesCategory = (vocabulary, step) => {
  if (!step) return false;

  const vocabularyCategory = normaliseKey(getVocabularyCategory(vocabulary));
  const stepCategory = normaliseKey(step.expectedEntity || step.category || '');

  if (vocabularyCategory && stepCategory && vocabularyCategory === stepCategory) {
    return true;
  }

  const stepOrder = step.stepOrder ?? step.order;
  const vocabularyStepOrder =
    vocabulary.stepOrder ?? vocabulary.scenarioStepOrder ?? vocabulary.order;

  return stepOrder != null && vocabularyStepOrder != null && stepOrder === vocabularyStepOrder;
};

const wordMatches = (vocabulary, target = '') => {
  const targetKey = normaliseKey(target);
  const targetWord = normaliseWord(target);

  const candidates = [
    vocabulary.word,
    vocabulary.id,
    vocabulary.label,
    vocabulary.englishName,
    vocabulary.name,
  ].filter(Boolean);

  return candidates.some(
    (candidate) =>
      normaliseWord(candidate) === targetWord ||
      normaliseKey(candidate) === targetKey,
  );
};

const sentenceMentionsWord = (sentence = '', word = '') => {
  if (!sentence || !word) return false;
  return sentence.toLowerCase().includes(word.toLowerCase());
};

export const getMenuItemsForStep = (vocabularies = [], step) => {
  if (!step) return [];

  const matched = vocabularies.filter((vocabulary) => matchesCategory(vocabulary, step));
  return matched.length > 0 ? matched : vocabularies;
};

export const getCorrectMenuItem = (vocabularies = [], step, menuItems = []) => {
  const pool = menuItems.length > 0 ? menuItems : getMenuItemsForStep(vocabularies, step);
  if (pool.length === 0) return null;

  const targetFields = [
    step?.expectedEntity,
    step?.expectedTarget,
    step?.targetWord,
    step?.targetEntity,
    step?.expectedItem,
  ].filter(Boolean);

  for (const target of targetFields) {
    const found = pool.find((item) => wordMatches(item, target));
    if (found) return found;
  }

  const flagged = pool.find(
    (item) => item.isTarget || item.isCorrect || item.isRequired,
  );
  if (flagged) return flagged;

  if (step?.expectedSentence) {
    const fromSentence = pool.find((item) => {
      const w = item.word || item.label || '';
      return sentenceMentionsWord(step.expectedSentence, w);
    });
    if (fromSentence) return fromSentence;
  }

  if (step?.expectedEntity && pool.length === 1) {
    return pool[0];
  }

  const byStepOrder = pool.find(
    (item) =>
      item.stepOrder != null &&
      step.stepOrder != null &&
      item.stepOrder === step.stepOrder,
  );
  if (byStepOrder) return byStepOrder;

  return null;
};

export const getExpectedSentence = (step, correctItem) => {
  if (step?.expectedSentence) return step.expectedSentence;

  const label = correctItem?.label || correctItem?.word || '';
  if (label) {
    const lower = label.toLowerCase();
    return `Can I have ${lower}?`;
  }

  const entityLabel = formatEntityLabel(step?.expectedEntity);
  if (entityLabel) {
    return `Can I have ${entityLabel.toLowerCase()}?`;
  }

  return '';
};

export const isOrderStep = (step) =>
  Boolean(step) && step.expectedIntent !== INTENT_MISSION_COMPLETE;
