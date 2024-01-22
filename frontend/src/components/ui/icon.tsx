import { cn } from '@/lib/classnames';

interface BrowserSpriteSymbol {
  id: string;
  viewBox: string;
  content: string;
  node: SVGSymbolElement;
}

export interface IconProps {
  icon?:
    | {
        id: string;
        viewBox: string;
      }
    | BrowserSpriteSymbol;
  className?: string;
  style?: unknown;
}

const Icon = ({ icon, className, style }: IconProps) => (
  <svg
    className={cn({
      'fill-current': true,
      [className]: !!className,
    })}
    viewBox={icon?.viewBox || '0 0 32 32'}
    style={style}
  >
    <use xlinkHref={`#${icon?.id}`} />
  </svg>
);

export default Icon;
