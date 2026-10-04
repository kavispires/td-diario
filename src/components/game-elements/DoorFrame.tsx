import type { ReactNode } from 'react';

/**
 * Props accepted by the {@link DoorFrame} component.
 */
type DoorFrameProps = {
  /**
   * Content rendered inside the door frame's opening.
   */
  children?: ReactNode;
  /**
   * Additional classes merged onto the root `svg` element.
   */
  className?: string;
  /**
   * Rendered width, in pixels. Height scales automatically via the SVG's
   * intrinsic aspect ratio.
   */
  width?: number;
};

/**
 * Renders a decorative arched door/portal frame (ported from
 * tardedivertida's `DoorFrame`), with its content placed inside the
 * opening via a `foreignObject`. Used by games like Portais to frame
 * preview images as portals.
 *
 * @param props Frame content, width, and class name.
 * @returns The rendered door frame.
 */
export function DoorFrame({ children, width, className = '' }: DoorFrameProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 257.1 318.8"
      style={width ? { width: `${width}px` } : {}}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="door-d"
          x1="130.72"
          x2="130.72"
          y1="318.8"
          y2="34.78"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0.03"
            stopColor="#fdd3b6"
          />
          <stop
            offset="0.31"
            stopColor="#fbcdaa"
          />
          <stop
            offset="0.81"
            stopColor="#f5bd89"
          />
          <stop
            offset="1"
            stopColor="#f3b67b"
          />
        </linearGradient>
        <linearGradient
          id="door-a"
          x1="130.72"
          x2="130.72"
          y1="65.32"
          y2="14.51"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0"
            stopColor="#fdd5b9"
          />
          <stop
            offset="0.32"
            stopColor="#fdd0b1"
          />
          <stop
            offset="0.97"
            stopColor="#fcc9a5"
          />
        </linearGradient>
        <linearGradient
          id="door-e"
          x1="130.72"
          x2="130.72"
          y1="23.84"
          y2="4.14"
          xlinkHref="#door-a"
        />
        <linearGradient
          id="door-f"
          x1="27.14"
          x2="234.29"
          y1="46.01"
          y2="46.01"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0"
            stopColor="#a16261"
          />
          <stop
            offset="0.56"
            stopColor="#b37572"
          />
          <stop
            offset="1"
            stopColor="#c48783"
          />
        </linearGradient>
        <linearGradient
          id="door-g"
          x1="128.55"
          x2="128.55"
          y1="6.73"
          y2="0"
          xlinkHref="#door-a"
        />
        <linearGradient
          id="door-h"
          x1="130.72"
          x2="130.72"
          y1="313.13"
          y2="78.41"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0"
            stopColor="#c48783"
          />
          <stop
            offset="0.44"
            stopColor="#b37572"
          />
          <stop
            offset="1"
            stopColor="#a16261"
          />
        </linearGradient>
        <linearGradient
          id="door-b"
          x1="223.42"
          x2="223.42"
          y1="230.96"
          y2="171.86"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0"
            stopColor="#f3b67b"
          />
          <stop
            offset="0.07"
            stopColor="#f5bb86"
          />
          <stop
            offset="0.24"
            stopColor="#f8c69b"
          />
          <stop
            offset="0.42"
            stopColor="#fbcdaa"
          />
          <stop
            offset="0.64"
            stopColor="#fdd2b3"
          />
          <stop
            offset="0.97"
            stopColor="#fdd3b6"
          />
        </linearGradient>
        <linearGradient
          id="door-i"
          x1="38"
          x2="38"
          y1="230.96"
          y2="171.86"
          xlinkHref="#door-b"
        />
        <linearGradient
          id="door-c"
          x1="37.84"
          x2="226.06"
          y1="47.43"
          y2="47.43"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0"
            stopColor="#fcb645"
          />
          <stop
            offset="1"
            stopColor="#e3a129"
          />
        </linearGradient>
        <linearGradient
          id="door-j"
          x1="38.38"
          x2="38.38"
          y1="198.04"
          y2="193.37"
          xlinkHref="#door-c"
        />
        <linearGradient
          id="door-k"
          x1="223.04"
          x2="223.04"
          y1="198.04"
          y2="193.37"
          xlinkHref="#door-c"
        />
        <linearGradient
          id="door-l"
          x1="43.98"
          x2="217.44"
          y1="313.74"
          y2="313.74"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0"
            stopColor="#623c57"
          />
          <stop
            offset="1"
            stopColor="#3d1931"
          />
        </linearGradient>
      </defs>
      <g style={{ isolation: 'isolate' }}>
        <path
          fill="url(#door-d)"
          d="M236.27 34.78l-.6 30.02-.22 11.41-2.95 150.6-.2 10.11-1.6 81.88H30.74L25.99 76.21l-.23-11.41-.59-30.02h211.1z"
        />
        <path
          d="M235.67 64.8l-.22 11.41H25.99l-.23-11.41h209.91z"
          style={{ mixBlendMode: 'multiply' }}
          fill="#c48783"
          opacity="0.7"
        />
        <path
          fill="url(#door-a)"
          d="M16.7 14.51h228.02v50.81H16.7z"
        />
        <path
          d="M16.7 14.51h228.02V31.1H16.7z"
          style={{ mixBlendMode: 'multiply' }}
          fill="#c48783"
          opacity="0.55"
        />
        <path
          fill="url(#door-e)"
          d="M252.77 4.14l-.09.53-1.28 6.73-2.34 12.44H12.38L10.04 11.4 8.76 4.67l-.1-.53h244.11z"
        />
        <path
          fill="url(#door-f)"
          d="M27.14 35.51h207.15v21H27.14z"
        />
        <path
          d="M31.78 39.01h202.51v-3.5H27.14v21h4.64v-17.5z"
          style={{ mixBlendMode: 'multiply' }}
          fill="#c48783"
          opacity="0.85"
        />
        <path
          fill="#f3b67b"
          d="M220.07 79.83l-1.84 228.64h5.06l4.16-228.64h-7.38z"
        />
        <path
          d="M220.7 307.95l1.84-228.12h-2.47l-1.84 228.64h5.06l.02-.52h-2.61z"
          style={{ mixBlendMode: 'multiply' }}
          fill="#c48783"
          opacity="0.5"
        />
        <path
          fill="#fee0cc"
          d="M226.05 79.83l-4.15 228.25h-3.67v.39h5.06l4.16-228.64h-1.4z"
        />
        <path
          fill="#f3b67b"
          d="M34.25 79.6l4.4 228.6 5.06-.23-2.08-228.65-7.38.28z"
        />
        <path
          d="M41.11 307.64L36.72 79.55l-2.47.05 4.4 228.6 5.06-.23v-.52l-2.6.19z"
          style={{ mixBlendMode: 'multiply' }}
          fill="#c48783"
          opacity="0.5"
        />
        <path
          fill="#fee0cc"
          d="M40.23 79.35l2.08 228.26-3.67.21.01.38 5.06-.23-2.08-228.65-1.4.03z"
        />
        <path
          fill="#f3b67b"
          d="M53.68 23.84h-12.3L40 7.77l-1.15-3.64h14.38l-.44 2.6z"
        />
        <path
          fill="#f3b67b"
          d="M147.26.9l-.32 3.24-1.93 19.7h-26.86l.33-19.7.02-1.29L147.26.9z"
          opacity="0.5"
        />
        <path
          d="M252.68 4.67l-1.28 6.73H10.04L8.76 4.67h243.92z"
          style={{ mixBlendMode: 'multiply' }}
          fill="#c48783"
          opacity="0.55"
        />
        <path
          fill="url(#door-g)"
          d="M0 0h257.1v6.73H0z"
        />
        <path
          d="M188.24 0l-.5 6.74h-22.52l.24-6.74h22.78zM98.41 0l-.06 6.74h-39.4L58 0h40.41z"
          style={{ mixBlendMode: 'lighten' }}
          fill="#fff"
          opacity="0.35"
        />
        <path
          fill="url(#door-h)"
          d="M213.58 78.41l-.43 24.81-.17 9.44-3.49 200.47H51.95l-3.5-200.47-.16-9.44-.44-24.81h165.73z"
        />
        <path
          d="M232.5 226.81l-.2 10.11h-21.48l.17-10.11h21.51z"
          style={{ mixBlendMode: 'multiply' }}
          fill="#c48783"
          opacity="0.65"
        />
        <path
          fill="url(#door-b)"
          d="M237.27 173.42l-.26 5.44-.11 2.26-.11 2.66-.45 9.59-.22 4.67-.11 2.15-1.39 29.47h-25.04l.14-29.47.02-2.15.02-2.33v-2.34l.06-9.59.02-2.66v-2.26l.03-5.44h27.4z"
        />
        <path
          d="M237.01 178.86l-.22 4.92h-26.97l.02-4.92h27.17z"
          style={{ mixBlendMode: 'multiply' }}
          fill="#c48783"
          opacity="0.65"
        />
        <path
          fill="#fddbc5"
          d="M240.6 181.13h-31.03v-8.04h32.27l-1.24 8.04z"
        />
        <path
          d="M50.62 236.92h-21.5l-.2-10.11h21.53l.17 10.11z"
          style={{ mixBlendMode: 'multiply' }}
          fill="#c48783"
          opacity="0.65"
        />
        <path
          fill="url(#door-i)"
          d="M51.84 229.66H26.8l-1.39-29.47-.11-2.15-.22-4.67-.45-9.59-.11-2.66-.11-2.26-.26-5.44h27.4l.03 5.44v2.27l.02 2.65.06 9.59v2.34l.01 2.33.02 2.15.15 29.47z"
        />
        <path
          d="M24.4 178.86l.23 4.92h26.96l-.01-4.92H24.4z"
          style={{ mixBlendMode: 'multiply' }}
          fill="#c48783"
          opacity="0.65"
        />
        <path
          fill="#fddbc5"
          d="M20.81 181.13h31.03v-8.04H19.57l1.24 8.04z"
        />
        <path
          fill="#bb7d2a"
          d="M36.91 42.51h190.08v9.85H36.91z"
        />
        <path
          fill="url(#door-c)"
          d="M37.84 43.28h188.22v8.29H37.84z"
        />
        <path
          d="M99.34 52.35H64.85l-6.77-9.84h34.47l6.79 9.84zm27.03 0H113.4l-6.79-9.84h12.99l6.77 9.84z"
          style={{ mixBlendMode: 'overlay' }}
          fill="#fff"
          opacity="0.35"
        />
        <path
          d="M51.69 200.19H25.41l-.11-2.15-.11-2.33h26.47l.01 2.33.02 2.15z"
          style={{ mixBlendMode: 'multiply' }}
          fill="#c48783"
          opacity="0.65"
        />
        <path
          fill="url(#door-j)"
          d="M51.67 198.04H25.3l-.22-4.67h26.58v2.34l.01 2.33z"
        />
        <path
          d="M37.24 198.04h-3.48l-5.57-4.67h10.49l-1.44 4.67z"
          style={{ mixBlendMode: 'overlay' }}
          fill="#fff"
          opacity="0.35"
        />
        <path
          d="M236.23 195.71l-.11 2.33-.11 2.15h-26.29l.02-2.15.02-2.33h26.47z"
          style={{ mixBlendMode: 'multiply' }}
          fill="#c48783"
          opacity="0.65"
        />
        <path
          fill="url(#door-k)"
          d="M236.34 193.37l-.22 4.67h-26.38l.02-2.33v-2.34h26.58z"
        />
        <path
          d="M222.26 198.04h-3.48l-5.57-4.67h10.48l-1.43 4.67z"
          style={{ mixBlendMode: 'overlay' }}
          fill="#fff"
          opacity="0.35"
        />
        <path
          fill="url(#door-l)"
          d="M43.98 308.69h173.47v10.11H43.98z"
        />
        <path
          d="M75.98 308.69L74.9 318.8H56.5l-.65-10.11h20.13z"
          style={{ mixBlendMode: 'lighten' }}
          fill="#fff"
          opacity="0.35"
        />
        <path
          d="M138.19 308.68c-.21 3.47-.39 6.93-.56 10.11h-18.92l-1.08-10.11z"
          style={{ mixBlendMode: 'lighten' }}
          fill="#fff"
          opacity="0.15"
        />
        <path
          d="M199.58 308.68l-.6 10.11h-9l-1-10.11zM87.41 308.69l-.56 10.11h-5.97l-1.69-10.11h8.22z"
          style={{ mixBlendMode: 'multiply' }}
          fill="#98616c"
          opacity="0.45"
        />
        <path
          fill="#231f20"
          stroke="#231f20"
          strokeMiterlimit="10"
          d="M54.95 84.1h150v225h-150z"
          opacity="0.59"
        />
        <foreignObject
          x="53"
          y="82"
          width="150"
          height="225"
        >
          {children}
        </foreignObject>
      </g>
    </svg>
  );
}
