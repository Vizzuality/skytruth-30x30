/**
 * This component comes from Next.js' repository:
 * https://github.com/vercel/next.js/blob/canary/examples/active-class-name/components/ActiveLink.js
 */
import React, { useState, useEffect, PropsWithChildren } from 'react';

import { UrlObject } from 'url';

import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

import { cn } from '@/lib/classnames';

export type ActiveLinkProps = PropsWithChildren<
  LinkProps & {
    /** Class of the link */
    className?: string;
    /** Additional class of the link when it is active */
    activeClassName: string;
  }
>;

const ActiveLink: React.FC<ActiveLinkProps> = ({
  className,
  activeClassName,
  children,
  ...props
}: ActiveLinkProps) => {
  const { asPath, isReady } = useRouter();

  const [isActive, setIsActive] = useState(false);
  const [additionalProps, setAdditionalProps] = useState({});

  useEffect(() => {
    // Check if the router fields are updated client-side
    if (isReady) {
      // Dynamic route will be matched via props.as
      // Static route will be matched via props.href
      const linkPathname = new URL(
        `${
          (props.as as string) ??
          (typeof props.href === 'string'
            ? (props.href as string)
            : ((props.href as UrlObject)?.pathname as string))
        }`,
        window.location.href
      ).pathname;

      // Using URL().pathname to get rid of query and hash
      const activePathname = new URL(asPath, window.location.href).pathname;
      const isActive = activePathname.startsWith(linkPathname);

      setIsActive(isActive);
      setAdditionalProps({ 'aria-current': isActive ? 'page' : undefined });
    }
  }, [asPath, isReady, props.as, props.href, activeClassName, className]);

  return (
    <Link
      {...props}
      {...(isActive ? additionalProps : {})}
      className={cn(className, isActive ? activeClassName : undefined)}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
