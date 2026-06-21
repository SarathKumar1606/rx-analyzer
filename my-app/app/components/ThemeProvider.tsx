'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const pathname = usePathname();

  useEffect(() => {
    const stored = window.localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'How it Works', href: '/how-it-works' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <div className="app-shell">
      <div className="chat-card mx-auto">
        <nav className="top-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="brand-dot">MS</div>
              <div style={{ fontWeight: 800 }}>MediScan</div>
            </div>
            <div className="nav-links">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${pathname === item.href ? 'active-link' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <button type="button" className="mode-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </nav>

        {children}

        <footer className="footer">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div className="brand-dot">MS</div>
              <div>
                <div style={{ fontWeight: 700 }}>MediScan</div>
                <div className="muted" style={{ fontSize: 12 }}>Prescription Analyzer</div>
              </div>
            </div>
            <div className="muted">© 2026 MediScan. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
