import {
  Children,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

/**
 * Props accepted by the {@link Carousel} component.
 */
type CarouselProps = {
  /**
   * Slides rendered inside the carousel, one child per slide.
   */
  children: ReactNode;
  /**
   * Automatically advances to the next slide on an interval. Defaults to
   * `false`.
   */
  autoplay?: boolean;
  /**
   * Interval, in milliseconds, between automatic slide changes. Defaults to
   * `3000`.
   */
  autoplaySpeed?: number;
  /**
   * Shows the slide position dots. Defaults to `true`.
   */
  dots?: boolean;
  /**
   * Called after the active slide changes, with its index.
   */
  afterChange?: (current: number) => void;
  /**
   * Additional classes merged with the carousel's own classes.
   */
  className?: string;
};

/**
 * Renders a horizontally swipeable, snap-scrolling set of slides with
 * position dots and optional autoplay, similar to Ant Design's `Carousel`
 * component.
 *
 * @param props Slide content, autoplay options, dots visibility, and a
 *   change callback.
 * @returns A scroll-snap carousel with slide indicator dots.
 */
export function Carousel({
  children,
  autoplay = false,
  autoplaySpeed = 3000,
  dots = true,
  afterChange,
  className = '',
}: CarouselProps) {
  const slides = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
  }, []);

  // Tracks which slide is active as the user scrolls/swipes the track.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    function handleScroll() {
      if (!track) {
        return;
      }
      const index = Math.round(track.scrollLeft / track.clientWidth);
      setActive((prev) => {
        if (prev === index) {
          return prev;
        }
        afterChange?.(index);
        return index;
      });
    }

    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => track.removeEventListener('scroll', handleScroll);
  }, [afterChange]);

  // Advances to the next slide on an interval while autoplay is enabled.
  useEffect(() => {
    if (!autoplay || slides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) {
        return;
      }
      const nextIndex =
        Math.round(track.scrollLeft / track.clientWidth) + 1 >= slides.length
          ? 0
          : Math.round(track.scrollLeft / track.clientWidth) + 1;
      scrollToIndex(nextIndex);
    }, autoplaySpeed);

    return () => window.clearInterval(interval);
  }, [autoplay, autoplaySpeed, slides.length, scrollToIndex]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="w-full shrink-0 snap-start"
          >
            {slide}
          </div>
        ))}
      </div>
      {dots && slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Ir para o slide ${index + 1}`}
              aria-current={active === index}
              onClick={() => scrollToIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                active === index ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
