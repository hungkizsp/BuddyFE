const vocabularyImages = import.meta.glob('../../../assets/images/*', {
  eager: true,
  import: 'default',
  query: '?url',
});

export const normaliseWord = (value = '') =>
  value.trim().toLowerCase().replace(/\s+/g, '-');

export const normaliseKey = (value = '') =>
  value.trim().toUpperCase().replace(/[\s-]+/g, '_');

export const resolveVocabularyImage = (imageUrl) => {
  if (!imageUrl) return '';
  if (/^(https?:)?\/\//.test(imageUrl) || imageUrl.startsWith('data:')) return imageUrl;

  const filename = imageUrl.split('/').pop();
  const localImageKey = Object.keys(vocabularyImages).find((key) =>
    key.endsWith(`/${filename}`),
  );

  return localImageKey ? vocabularyImages[localImageKey] : imageUrl;
};

export const toMenuItem = (vocabulary) => ({
  id: normaliseWord(vocabulary.word || vocabulary.id),
  label: vocabulary.word,
  meaning: vocabulary.meaning,
  image: resolveVocabularyImage(vocabulary.imageUrl),
  alt: vocabulary.word,
  exampleSentence: vocabulary.exampleSentence,
  vocabulary,
});
