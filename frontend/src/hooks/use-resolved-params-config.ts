import { useEffect, useState } from 'react';

import { resolveParamsConfig } from '@/lib/json-converter';
import { ParamsConfig } from '@/types/layers';

export default function useResolvedParamsConfig(
  params_config: ParamsConfig,
  settings: Record<string, unknown>
) {
  const [paramsConfig, setParamsConfig] = useState<ParamsConfig | null>(null);

  useEffect(() => {
    const updateParamsConfig = async () => {
      setParamsConfig(await resolveParamsConfig(params_config, settings));
    };

    updateParamsConfig();
  }, [params_config, settings, setParamsConfig]);

  return paramsConfig;
}
