import { useTDBaseUrl } from '@hooks/useTDBaseUrl';
import { useAppRuntimeStore } from '@store/useAppRuntimeStore';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import type { ReactNode } from 'react';

type MainContentProps = {
  children: ReactNode;
  fullscreen?: boolean;
};

export function MainContent({ children, fullscreen }: MainContentProps) {
  const { getUrl } = useTDBaseUrl('assets');
  const isDarkMode = useAppRuntimeStore((state) => state.isDarkMode);

  // No `container` target means this tracks the page's own scroll position,
  // which is required for mobile browsers to auto-hide their address bar.
  const { scrollY } = useScroll();

  const backgroundY = useSpring(
    useTransform(scrollY, [0, 500], ['0%', '12%']),
    {
      stiffness: 100,
      damping: 20,
    },
  );

  return (
    <main
      className={`relative flex w-full overflow-x-hidden ${
        fullscreen ? 'min-h-dvh' : 'flex-1'
      }`}
    >
      {/* Fixed to the viewport (not `main`) since `main` can now grow taller
          than the screen — the page itself scrolls so the address bar can
          auto-hide, and this backdrop should stay pinned behind it. */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.img
          src={getUrl(`backgrounds/daily${isDarkMode ? '-dark' : ''}.jpg`)}
          alt=""
          aria-hidden="true"
          // `scale` must be set via Motion's `style` (not a Tailwind class):
          // Motion writes its own inline `transform` for the animated `y`
          // value, which would otherwise silently override a `scale-*`
          // class's `transform` and remove the buffer needed to hide the
          // translated image's edges. 1.3 gives a 15% edge buffer per side,
          // comfortably covering the 12% max `y` translation below.
          style={{ y: backgroundY, scale: 1.3 }}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-md flex-col shadow-[0_0_24px_rgba(0,0,0,0.1)]">
        {children}
      </div>
    </main>
  );
}
