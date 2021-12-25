import { useEffect, useRef, useState } from "react";

export const useHasIntersected = (
  target: Element | null,
  confirmationTime = 200,
  options: IntersectionObserverInit = {}
): boolean => {
  const [hasIntersected, setHasIntersected] = useState(false);

  const intersecting = useRef(false);
  const observer = useRef<null | IntersectionObserver>(null);

  const disconnect = () => {
    if (observer.current?.disconnect) {
      observer.current.disconnect();
      observer.current = null;
    }
  };

  useEffect(() => {
    setHasIntersected(false);
    disconnect();

    return () => disconnect();
  }, [target]);

  useEffect(() => {
    if (!target || observer.current) {
      return;
    }

    disconnect();

    observer.current = new IntersectionObserver(([{ isIntersecting }]) => {
      intersecting.current = isIntersecting;

      if (isIntersecting && !hasIntersected) {
        // Wait a while, if a user is scrolling super-fast there is no need to react
        setTimeout(() => {
          if (intersecting.current) {
            setHasIntersected(true);
          }
        }, confirmationTime);
      }

      if (!isIntersecting && hasIntersected) {
        disconnect();
      }
    }, options);

    observer.current.observe(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, options, confirmationTime]);

  return hasIntersected;
};
