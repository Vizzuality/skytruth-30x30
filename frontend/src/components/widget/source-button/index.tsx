import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ExternalLinkIcon from '@/styles/icons/external-link-square.svg';
import { useGetDataSources } from '@/types/generated/data-source';

export type SourceButtonProps = {
  source?: string;
};

const SourceButton: React.FC<SourceButtonProps> = ({ source: sourceSlug }) => {
  const [isSourceOpen, setIsSourceOpen] = useState<boolean>(false);

  const { data: dataSources } = useGetDataSources(
    { 'pagination[limit]': -1 },
    {
      query: {
        select: ({ data }) => data,
        placeholderData: { data: [] },
      },
    }
  );

  const source = useMemo(() => {
    const source = dataSources.find(
      ({ attributes }) => attributes?.slug === sourceSlug
    )?.attributes;

    if (!source) return null;

    return {
      title: source.title,
      url: source.url,
    };
  }, [sourceSlug, dataSources]);

  if (!source) return null;

  return (
    <Popover open={isSourceOpen} onOpenChange={setIsSourceOpen}>
      <PopoverTrigger asChild>
        <Button className="mt-1.5 flex h-auto w-auto items-start" size="icon" variant="ghost">
          <span className="sr-only">Source</span>
          <Icon icon={ExternalLinkIcon} className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        side="left"
        className="flex max-w-[300px] flex-col gap-6 p-1 font-mono text-xs underline"
      >
        <a href={source.url} target="_blank">
          {source.title}
        </a>
      </PopoverContent>
    </Popover>
  );
};

export default SourceButton;
