import deepmerge from 'deepmerge';
import { pick } from 'lodash-es';
import { useTranslations } from 'next-intl';

export const fetchTranslations = async (
  locale: string,
  pickedMessages?: Parameters<typeof useTranslations>[0][]
) => {
  // TODO: fetch the translations from the CDN
  const messages = (await import(`../../../translations/${locale}.json`)).default;
  const defaultMessages = (await import(`../../../translations/en.json`)).default;

  // Use the English language as a fallback
  const mergedMessages = deepmerge(defaultMessages, messages);

  if (pickedMessages) {
    return pick(mergedMessages, pickedMessages);
  }

  return mergedMessages;
};
