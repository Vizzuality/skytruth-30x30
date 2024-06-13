import deepmerge from 'deepmerge';

export const fetchTranslations = async (locale: string) => {
  // TODO: fetch the translations from the CDN
  const messages = (await import(`../../../translations/${locale}.json`)).default;
  const defaultMessages = (await import(`../../../translations/en.json`)).default;

  // Use the English language as a fallback
  return deepmerge(defaultMessages, messages);
};
