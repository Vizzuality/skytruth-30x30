import { useCallback } from 'react';

import { useAtom } from 'jotai';

import Icon from '@/components/ui/icon';
import { cardFiltersAtom } from '@/store/knowledge-hub';
import CheckIcon from '@/styles/icons/check.svg?sprite';
import { useGetDataToolLanguages } from '@/types/generated/data-tool-language';
import { DataToolLanguage } from 'types/generated/strapi.schemas';

const CardFiltersLanguages = (): JSX.Element => {
  const [filters, setFilters] = useAtom(cardFiltersAtom);

  const languagesQuery = useGetDataToolLanguages(
    {},
    {
      query: {
        select: ({ data }) => data.map(({ attributes }) => attributes.name),
      },
    }
  );

  const onSelectLanguage = useCallback(
    (language: DataToolLanguage['name']) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        language: prevFilters.language === language ? null : language,
      }));
    },
    [setFilters]
  );

  return (
    <ul className="space-y-1">
      {languagesQuery.data?.map((language) => (
        <li
          key={language}
          className="flex cursor-pointer items-center space-x-1 text-base font-black hover:underline"
          onClick={() => onSelectLanguage(language)}
        >
          {filters.language === language && <Icon icon={CheckIcon} className="h-3 w-3" />}
          <span>{language}</span>
        </li>
      ))}
    </ul>
  );
};

export default CardFiltersLanguages;
