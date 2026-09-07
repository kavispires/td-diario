import type { GameInfo } from '../../../types/puzzles';

export const gameInfo: GameInfo = {
  id: 'arte-ruim',
  type: 'game',
  color: 'rgba(174, 169, 223, 0.85)',
  emoji: '🖼️',
  name: { pt: 'Arte Ruim', en: 'Is It Art?' },
  tagline: {
    pt: 'Adivinhe o título das obras de arte!',
    en: 'Guess the title of the artworks!',
  },
  releaseDate: '2023-11-04',
  version: 'stable',
};

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <title>Arte Ruim Logo</title>
      <path
        fill="#e08ea2"
        d="M7.5 52.53h495.04v404.98H7.5z"
      ></path>
      <path
        fill="#d15573"
        d="M29.5 434.34V52.54h-22V457.5h495.04v-23.17z"
      ></path>
      <path
        fill="#9eb6f4"
        d="M37.55 82.36v270h267.94l35-30h42l45-45h45v-195z"
      ></path>
      <path
        fill="#3d6dea"
        d="M420.5 253.7l-46 46h-40.67l-35 30H60.2V82.36H37.55v270h267.94l35-30h42l45-45h45l1-23.66z"
      ></path>
      <path
        fill="#c09fde"
        d="M37.55 426.69v-74.34h267.94l35-30h42l45-45h45V426.7z"
      ></path>
      <path
        fill="#f0b582"
        d="M404.97 300.02l22.67-22.67h-.14l-22.67 22.67z"
      ></path>
      <path
        fill="#a070ce"
        d="M60.02 404.36v-52H37.55v74.33H472.5v-22.33z"
      ></path>
      <path
        fill="#72869e"
        d="M209.5 374.35v-105l-15-22h-15v59h-7l-30-82v-90l-24-22.5h-6v75.34l-15 15v97.16l-15 21V426.7h150v-29.34z"
      ></path>
      <path
        fill="#536275"
        d="M105.5 403.68v-74.33l15-21v-99l15-15V127.8l-17-15.94h-6v75.34l-15 15v97.16l-15 21V426.7h150v-23.01z"
      ></path>
      <path
        fill="#536275"
        d="M182.33 314.35h20.16V259.1l-8-11.74h-12.16z"
      ></path>
      <path
        fill="#f8e868"
        d="M419 171.85h-30l-7-8v-30l7-7h23v14.5h15v22.5z"
      ></path>
      <path
        fill="#fff"
        d="M60 224.35h15v15H60zm120-45h15v15h-15zm165-75h15v15h-15zm89 90h15v15h-15zm-180 120h15v15h-15z"
      ></path>
      <path d="M495.04 389.35h15v15h-15z"></path>
      <path d="M0 45.03v419.98h510.04v-45.66h-15v30.66H15V60.03h480.04v314.32h15V45.03z"></path>
      <path d="M74.5 89.86v-15H30.05v359.33H480V74.86H119.5v15H465v149.33h-45.5v15H465v15.67h-40.61l-45 45h-41.67l-35 30H217v-77.82l-18.53-27.19H172v43.3l-22-60.13V131.1l-28.53-26.75H105v34.51l-26.05 25.5h-8.91l-24.98-24.19V89.85H74.5zm233.77 270l35-30h42.33l45-45H465v134.33H240v-24.94l-23-23v-11.4h91.27zM119.99 123.53l15 14.06v88.08l32.26 88.17H187v-59h3.54L202 271.67v105.79l23 23v18.73H90v-29.84H75v29.84H45.05v-59.34h29.94v14.5h15v-51.6l15-21V205.3l15-15zm-56.03 55.81h21.1l19.93-19.5v24.23l-15 15v97.87l-15 21v26.9H45.05v-183.8z"></path>
      <path d="M89.5 74.86h15v15h-15zm296.39 44.5l-11.4 11.39v35.92l11.1 12.68h36.51l12.4-12.39v-33.1h-15v-14.5zm33.6 41.39l-3.6 3.6h-23.5l-2.9-3.31v-24.08l2.61-2.6h12.4v14.5h15v11.89zM164.5 134.52v15h138.9l26.1 32.47v39.3l-25.66 26.23h-52L232 221.8v-24.47l17.38-18.45 33.7.28L299 197.19v12.66h-29.67v-15.5h-15v30.5H314v-33.33l-24.1-27.3-46.95-.4L217 191.38v35.53l27.48 35.61h65.67l34.35-35.1v-50.7l-33.91-42.2z"></path>
      <path d="M326.33 276.85H239.5v15h93.16l36.67-37.66h35.16v-15H363z"></path>
    </svg>
  );
}
