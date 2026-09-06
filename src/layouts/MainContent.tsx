import { useTDBaseUrl } from '@hooks/useTDBaseUrl';
import { useAppRuntimeStore } from '@store/useAppRuntimeStore';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { type ReactNode, useRef } from 'react';

type MainContentProps = {
  children: ReactNode;
  fullscreen?: boolean;
};

export function MainContent({ children, fullscreen }: MainContentProps) {
  const { getUrl } = useTDBaseUrl('assets');
  const isDarkMode = useAppRuntimeStore((state) => state.isDarkMode);

  const mainRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll({
    container: mainRef,
  });

  const backgroundY = useSpring(
    useTransform(scrollY, [0, 500], ['0%', '12%']),
    {
      stiffness: 100,
      damping: 20,
    },
  );

  return (
    <main
      ref={mainRef}
      className={`relative flex w-full flex-1 overflow-x-hidden overflow-y-auto ${
        fullscreen ? 'min-h-dvh' : 'min-h-0'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.img
          src={getUrl(`backgrounds/daily${isDarkMode ? '-dark' : ''}.jpg`)}
          alt=""
          aria-hidden="true"
          style={{ y: backgroundY }}
          className="h-full w-full scale-110 object-cover"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-md flex-col">
        {children}
      </div>
    </main>
  );
}
