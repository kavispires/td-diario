import { motion } from 'motion/react';
import tdLogo from '../assets/svg/td.svg';
import tdLogoStatic from '../assets/svg/td-static.svg';

/**
 * Props accepted by the {@link TDLogoIcon} component.
 */
type TDLogoIconProps = {
  /**
   * Additional classes applied to the rendered image.
   */
  className?: string;
  /**
   * Whether to render the static logo variant instead of the animated one.
   */
  static?: boolean;
};

/**
 * Renders the TD Diário brand logo, participating in the shared `td-logo`
 * layout animation between the splash screen and the header.
 *
 * @param props Styling and static/animated variant options.
 * @returns An animated logo image element.
 */
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
