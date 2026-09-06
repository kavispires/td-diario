import { motion } from 'motion/react';
import tdLogo from '../assets/svg/td.svg';
import tdLogoStatic from '../assets/svg/td-static.svg';

type TDLogoIconProps = {
  className?: string;
  static?: boolean;
};

export function TDLogoIcon({ className, static: isStatic }: TDLogoIconProps) {
  return (
    <motion.img
      src={isStatic ? tdLogoStatic : tdLogo}
      layout
      layoutId="td-logo"
      aria-hidden="true"
      className={className}
      transition={{
        layout: {
          type: 'spring',
          stiffness: 180,
          damping: 20,
        },
      }}
    />
  );
}
