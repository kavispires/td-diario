import { Calendar, Puzzle, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function BottomNav() {
  const navItems = [
    { to: '/', icon: Puzzle, label: 'Jogos' },
    { to: '/archive', icon: Calendar, label: 'Arquivo' },
    { to: '/profile', icon: User, label: 'Perfil' },
  ];

  return (
    // Swapped to bg-slate-900 to match the TopBar, with a subtle top shadow
    <nav className="bg-slate-900 text-slate-50 shadow-[0_-4px_10px_rgba(0,0,0,0.15)] flex items-center justify-around pt-3 pb-2 px-2 sticky bottom-0 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-2 min-w-18 transition-colors duration-200 ${
              // Active state is bright blue/white, inactive is muted slate
              isActive ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={`w-6 h-6 transition-transform duration-200 ${
                  isActive ? 'scale-110 drop-shadow-md' : 'scale-100'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] font-medium tracking-wide ${isActive ? 'font-bold text-white' : ''}`}
              >
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
