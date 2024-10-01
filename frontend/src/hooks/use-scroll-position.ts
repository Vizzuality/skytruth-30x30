import { MutableRefObject, useEffect, useState } from 'react';

import debounce from 'lodash-es/debounce';

export default function useScrollPosition<T extends HTMLElement>(ref?: MutableRefObject<T>) {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    let element: HTMLElement = document.body;
    if (ref.current) {
      element = ref.current;
    }

    const onScroll = debounce(() => setPosition(element.scrollTop), 10);

    element.addEventListener('scroll', onScroll);

    return () => element.removeEventListener('scroll', onScroll);
  }, [ref]);

  return position;
}
