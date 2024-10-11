import { useAtom } from 'jotai';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { terrestrialDataDisclaimerDialogAtom } from '@/containers/map/store';
import Notification from '@/styles/icons/notification.svg';

interface TerrestrialDataDisclaimerDialogProps {}

const TerrestrialDataDisclaimerDialog = ({}: TerrestrialDataDisclaimerDialogProps) => {
  const t = useTranslations('pages.progress-tracker');
  const [, setOpen] = useAtom(terrestrialDataDisclaimerDialogAtom);

  return (
    <Dialog open>
      <DialogContent closable={false}>
        <DialogHeader className="flex-row gap-2 font-bold text-red">
          <Icon icon={Notification} className="h-6 w-6" />
          {t('important-notification')}
        </DialogHeader>
        <DialogTitle className="max-w-[350px]">
          {t('terrestrial-data-disclaimer-dialog-title')}
        </DialogTitle>
        <DialogDescription>
          {t.rich('terrestrial-data-disclaimer-dialog-content', {
            br: () => <br />,
          })}
        </DialogDescription>
        <DialogFooter>
          <Button
            type="button"
            className="font-mono text-xs font-normal normal-case"
            onClick={() => setOpen(false)}
          >
            {t('i-understand')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TerrestrialDataDisclaimerDialog;
