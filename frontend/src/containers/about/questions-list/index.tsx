import { cva, VariantProps } from 'class-variance-authority';

import Icon from '@/components/ui/icon';
import { cn } from '@/lib/classnames';
import ArrowRight from '@/styles/icons/arrow-right.svg?sprite';

const questionsListVariants = cva('', {
  variants: {
    color: {
      green: 'bg-green',
      purple: 'bg-purple-500',
    },
  },
  defaultVariants: {
    color: 'purple',
  },
});

export type QuestionsListProps = VariantProps<typeof questionsListVariants> & {
  questions: string[];
};

const QuestionsList: React.FC<QuestionsListProps> = ({ questions, color }) => (
  <div
    className={cn(
      'my-8 border border-black py-8 px-10 text-2xl font-extrabold md:my-16 md:py-16',
      questionsListVariants({ color })
    )}
  >
    <div className="flex max-w-[540px] flex-col gap-12">
      {questions.map((question, id) => (
        <div className="flex gap-8" key={id}>
          <span aria-hidden>
            <Icon icon={ArrowRight} className="h-10 fill-black" />
          </span>
          <span className="pt-px">{question}</span>
        </div>
      ))}
    </div>
  </div>
);

export default QuestionsList;
