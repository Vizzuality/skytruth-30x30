import { PropsWithChildren, ReactNode } from 'react';

import { cn } from '@/lib/classnames';

export type SubSectionTitleProps = PropsWithChildren;

const SubSectionTitle: React.FC<SubSectionTitleProps> = ({ children }) => (
  <h3 className="my-6 mb-8 mt-2 text-3xl font-extrabold">{children}</h3>
);

export type SubSectionDescriptionProps = PropsWithChildren;

const SubSectionDescription: React.FC<SubSectionDescriptionProps> = ({ children }) => (
  <div>{children}</div>
);

export type SubSectionContentProps = PropsWithChildren<{
  isNumbered?: boolean;
}>;

const SubSectionContent: React.FC<SubSectionContentProps> = ({ isNumbered = false, children }) => (
  <div
    className={cn('flex w-[50%] justify-center', {
      'mt-16': isNumbered,
    })}
  >
    {children}
  </div>
);

export type TwoColSubSection = PropsWithChildren<{
  title: string;
  description?: string | ReactNode;
  itemNum?: number;
  itemTotal?: number;
}>;

const TwoColSubSection: React.FC<TwoColSubSection> = ({
  title,
  description,
  itemNum,
  itemTotal,
  children,
}) => {
  const minTwoDigits = (number: number) => {
    return (number < 10 ? '0' : '') + number;
  };

  const isNumbered = itemNum && itemTotal ? true : false;

  return (
    <div className="mt-20 flex flex-row gap-8">
      <div className="flex w-[50%] flex-col pt-5">
        {isNumbered && (
          <span className="mb-6 font-mono text-xl">
            <span className="text-black">{minTwoDigits(itemNum)}</span>
            <span className="opacity-20">-{minTwoDigits(itemTotal)}</span>
          </span>
        )}
        <div className="border-t border-black pt-3.5">
          <SubSectionTitle>{title}</SubSectionTitle>
          {description && <SubSectionDescription>{description}</SubSectionDescription>}
        </div>
      </div>
      <SubSectionContent isNumbered={isNumbered}>{children}</SubSectionContent>
    </div>
  );
};

export default TwoColSubSection;
export { SubSectionTitle, SubSectionDescription, SubSectionContent };
