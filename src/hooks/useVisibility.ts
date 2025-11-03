import { useEffect, useRef, type RefObject } from 'react';

type VisibilityCallback = (entry: IntersectionObserverEntry) => void;

/**
 * Hook that triggers callbacks when a referenced element becomes visible or hidden.
 *
 * @param onVisible - Called when the element enters the viewport.
 * @param onHidden - (Optional) Called when the element leaves the viewport.
 * @param options - IntersectionObserver options (threshold, root, rootMargin, etc.)
 * @returns A ref to attach to the observed element.
 */
export function useVisibility<T extends HTMLElement>(
  onVisible: VisibilityCallback,
  onHidden?: VisibilityCallback,
  options: IntersectionObserverInit = {}
): RefObject<T | null> {
  const targetRef = useRef<T | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible(entry);
        } else {
          onHidden?.(entry);
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(target);
    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [onVisible, onHidden, options]);

  return targetRef;
}
