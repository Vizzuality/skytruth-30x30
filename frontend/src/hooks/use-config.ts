import { useEffect, useState } from 'react';

import { parseConfig } from '@/lib/json-converter';

export default function useConfig<Config>(params: Parameters<typeof parseConfig<Config>>[0]) {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    const updateConfig = async () => {
      setConfig(await parseConfig(params));
    };

    updateConfig();
  }, [params, setConfig]);

  return config;
}
