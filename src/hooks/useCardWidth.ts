import { useCallback, useMemo, useRef, useState } from 'react';

/**
 * Options accepted by {@link useCardWidthByContainerRef}.
 */
type CardWidthOptions = {
  /**
   * Total horizontal gap/padding to remove per card. Defaults to `32`.
   */
  gap?: number;
  /**
   * Minimum card width, in pixels. Defaults to `120`.
   */
  minWidth?: number;
  /**
   * Maximum card width, in pixels. Defaults to `300`.
   */
  maxWidth?: number;
  /**
   * Outer margin of the container to subtract from its width before
   * dividing. Defaults to `0`.
   */
  margin?: number;
};

/**
 * Computes a square card width, in pixels, that fits `quantity` cards
 * across a measured container's width, and returns a ref to attach to
 * that container.
 *
 * @param quantity - How many cards should fit across the container's width.
 * @param options - Sizing constraints; see {@link CardWidthOptions}.
 * @returns A tuple of `[cardWidth, containerRef]`.
 */
export function useCardWidthByContainerRef<
  TElement extends HTMLElement = HTMLDivElement,
>(
  quantity: number,
  options?: CardWidthOptions,
): [number, (node: TElement | null) => void] {
  const {
    gap = 32,
    minWidth = 120,
    maxWidth = 300,
    margin = 0,
  } = options ?? {};
  const [containerWidth, setContainerWidth] = useState(0);
  const observerRef = useRef<ResizeObserver | null>(null);

  const containerRef = useCallback((node: TElement | null) => {
    observerRef.current?.disconnect();

    if (!node) {
      return;
    }

    setContainerWidth(node.getBoundingClientRect().width);

    observerRef.current = new ResizeObserver(([entry]) => {
      if (entry) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observerRef.current.observe(node);
  }, []);

  const cardWidth = useMemo(() => {
    const value = Math.min(
      Math.max(
        Math.floor((containerWidth - margin) / quantity) - gap,
        minWidth,
      ),
      maxWidth,
    );
    return Number.isNaN(value) ? minWidth : value;
  }, [containerWidth, quantity, gap, minWidth, maxWidth, margin]);

  return [cardWidth, containerRef];
}
