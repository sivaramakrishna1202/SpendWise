import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import ThemeSwitch from './ui/theme-switch';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '/dashboard-icon.png' },
  { path: '/transactions', label: 'Transactions', icon: '/transactions-icon.png' },
  { path: '/budgets', label: 'Budgets', icon: '/budgets-icon.png' },
  { path: '/accounts', label: 'Accounts', icon: '/accounts-icon.png' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuState, setMenuState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const logoSrc = resolvedTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png';

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className="fixed z-50 w-full px-2 group top-0"
      >
        <div className={cn('mx-auto mt-2 w-full max-w-7xl px-4 transition-all duration-300', isScrolled && 'bg-background/80 rounded-2xl border backdrop-blur-lg')}>
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            
            {/* Logo */}
            <div className="flex w-full justify-between lg:w-auto">
              <Link to="/dashboard" aria-label="home" className="flex items-center gap-2">
                <img src={logoSrc} alt="SpendWise" className="h-8 w-auto dark-invert" />
                <span className="gradient-text font-bold text-xl hidden sm:inline-block">SpendWise</span>
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState === true ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 m-0 block cursor-pointer p-2 lg:hidden text-foreground"
              >
                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            {/* Desktop Center Links */}
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex items-center gap-6">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary-light",
                          isActive ? "text-primary-light" : "text-muted-foreground"
                        )
                      }
                    >
                      <img src={item.icon} alt={item.label} className="w-5 h-5 dark-invert" style={{ objectFit: 'contain' }} />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side / Mobile Menu Content */}
            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-6 rounded-2xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-4 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              
              {/* Mobile Links */}
              <div className="lg:hidden w-full">
                <ul className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={() => setMenuState(false)}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors",
                            isActive ? "bg-[rgba(99,102,241,0.1)] text-primary-light" : "text-foreground hover:bg-muted"
                          )
                        }
                      >
                        <img src={item.icon} alt={item.label} className="w-5 h-5 dark-invert" style={{ objectFit: 'contain' }} />
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
                <div className="w-full h-px bg-border my-4" />
              </div>

              {/* Actions (Theme + User) */}
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:items-center sm:gap-4 sm:space-y-0 md:w-fit justify-between">
                <ThemeSwitch />
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link to="/settings" className="hover:opacity-80 transition-opacity" title="Account Settings">
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', fontWeight: 700, color: 'white', flexShrink: 0
                    }}>
                      {user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  </Link>
                  
                  <div className="flex flex-col lg:hidden flex-1">
                    <span className="text-sm font-semibold">{user?.name}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>

                  <button 
                    onClick={handleLogout} 
                    className="p-2 rounded-full hover:bg-destructive/10 text-destructive transition-colors ml-auto flex-shrink-0"
                    title="Logout"
                  >
                    <img src="/logout-icon.png" alt="Logout" className="w-5 h-5 dark-invert" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </nav>
    </header>
  );
}
