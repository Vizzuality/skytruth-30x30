import { ChangeEvent, ChangeEventHandler, useCallback, useState } from 'react';

import { useAtom, useSetAtom } from 'jotai';
import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { drawStateAtom } from '@/store/map';

import { convertFilesToGeojson, supportedFileformats } from './helpers';

const DrawingStateContent = {
  Content: () => {
    const setDrawState = useSetAtom(drawStateAtom);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
      (e) => {
        const handler = async (e: ChangeEvent<HTMLInputElement>) => {
          const { files } = e.currentTarget;

          try {
            const geojson = await convertFilesToGeojson(Array.from(files));
            setErrorMessage(null);
            setDrawState({ active: false, feature: geojson });
          } catch (errorMessage) {
            setErrorMessage(errorMessage as string);
          }
        };

        void handler(e);
      },
      [setDrawState]
    );

    return (
      <>
        <h1 className="text-4xl font-black uppercase">Analyze an area</h1>
        <p className="mt-4 text-sm">
          Use the drawing tool to <span className="font-bold">draw an area</span> on the map or{' '}
          <span className="font-bold">upload a geometry</span>.
        </p>
        <Input
          type="file"
          multiple
          accept={supportedFileformats.map((ext) => `.${ext}`).join(',')}
          aria-label="Upload a geometry"
          aria-describedby="upload-notes upload-error"
          className="mt-8"
          onChange={onChange}
        />
        {!!errorMessage && (
          <Alert id="alert-error" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <div id="upload-notes" className="mt-4 text-xs text-gray-700">
          <p>The following formats are accepted:</p>
          <dl className="mt-3">
            <dt className="w-16 font-semibold">Shapefile</dt>
            <dd className="relative -top-4 pl-16">
              3 mandatory files: <span className="font-semibold">.shp</span>,{' '}
              <span className="font-semibold">.shx</span> and{' '}
              <span className="font-semibold">.dbf</span>
              <br />2 optional files: <span className="font-semibold">.prj</span> (recommended) and{' '}
              <span className="font-semibold">.cfg</span>
            </dd>
            <dt className="w-16 font-semibold">KML</dt>
            <dd className="relative -top-4 pl-16">
              1 <span className="font-semibold">.kml</span> file
            </dd>
            <dt className="w-16 font-semibold">KMZ</dt>
            <dd className="relative -top-4 pl-16">
              1 <span className="font-semibold">.kmz</span> file
            </dd>
          </dl>
          <p>
            Please note that points are not accepted and that only the first area in the file(s) is
            considered.
          </p>
        </div>
      </>
    );
  },
  Footer: () => {
    const [drawState, setDrawState] = useAtom(drawStateAtom);

    return (
      <Button
        type="button"
        className="w-full text-xs"
        onClick={() => setDrawState({ ...drawState, active: false })}
      >
        Cancel
      </Button>
    );
  },
};

export default DrawingStateContent;
