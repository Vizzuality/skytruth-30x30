import { useTranslations } from 'next-intl';

import { PAGES } from '@/constants/pages';
import LinkCard from '@/containers/homepage/link-cards/link-card';
import { FCWithMessages } from '@/types';

const LinkCards: FCWithMessages = () => {
  const t = useTranslations('containers.homepage-link-cards');

  return (
    <div className="flex flex-col gap-6">
      <LinkCard
        title={t('card-1-title')}
        subtitle={t('card-1-subtitle')}
        description={t('card-1-description')}
        image="computer"
        color="orange"
        link={PAGES.progressTracker}
        linkLabel={t('card-1-link')}
      />
      <LinkCard
        title={t('card-2-title')}
        subtitle={t('card-2-subtitle')}
        description={t('card-2-description')}
        image="pencilHolder"
        color="blue"
        link={PAGES.conservationBuilder}
        linkLabel={t('card-2-link')}
      />
      <LinkCard
        title={t('card-3-title')}
        subtitle={t('card-3-subtitle')}
        description={t('card-3-description')}
        image="magnifyingGlass"
        color="green"
        link={PAGES.knowledgeHub}
        linkLabel={t('card-3-link')}
      />
    </div>
  );
};

LinkCards.messages = ['containers.homepage-link-cards'];

export default LinkCards;
