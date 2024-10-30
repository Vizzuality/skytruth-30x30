import { useState } from 'react';

import Image from 'next/image';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Media, MediaContextProvider } from '@/media';
import { FCWithMessages } from '@/types';

const MobileDisclaimerDialog: FCWithMessages = () => {
  const t = useTranslations('components.mobile-disclaimer-dialog');
  const [open, setOpen] = useState(true);

  return (
    <MediaContextProvider>
      <Media lessThan="lg">
        <Dialog open={open}>
          <DialogContent
            closable={false}
            variant="black"
            size="full"
            className="block overflow-hidden"
          >
            <DialogTitle className="max-w-[430px] text-[32px] font-black leading-[38px]">
              {t('page-optimized-for-desktop-viewing')}
            </DialogTitle>
            <DialogDescription className="mt-10 max-w-[520px] text-xl font-medium">
              {t('please-visit-us-from-larger-screen')}
            </DialogDescription>
            <DialogFooter className="mt-8 sm:justify-start">
              <Button
                type="button"
                className="border border-white font-mono text-xs font-normal normal-case"
                onClick={() => setOpen(false)}
              >
                {t('i-understand')}
              </Button>
            </DialogFooter>
            <Image
              className="absolute -bottom-8 -right-8 size-[280px] opacity-30 grayscale"
              src="/images/skytruth-30-30-logo.svg"
              alt=""
              width="0"
              height="0"
              sizes="100vw"
              aria-hidden
            />
          </DialogContent>
        </Dialog>
      </Media>
    </MediaContextProvider>
  );
};

MobileDisclaimerDialog.messages = ['components.mobile-disclaimer-dialog'];

export default MobileDisclaimerDialog;
