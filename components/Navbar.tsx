import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const isLanding = location.pathname === '/';

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
    ];

    // Transparent if on landing page, at top, and mobile menu is closed
    const isTransparent = isLanding && !scrolled && !isOpen;
    
    // Text colors - Adjusted for White Hero Section
    const linkColor = 'text-slate-600 hover:text-blue-600';
    const logoColor = '#2563eb'; // Brand Blue
    const buttonClass = 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20';
    const menuButtonColor = 'text-slate-900 hover:bg-slate-100';

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out ${
                isOpen 
                  ? 'bg-white py-3 border-b border-slate-100' // Solid white when open
                  : isTransparent 
                    ? 'bg-transparent py-6' 
                    : 'bg-white/90 backdrop-blur-md border-b border-slate-200/50 py-3 shadow-sm'
            }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between" style={{ paddingLeft: 'max(1.5rem, env(safe-area-inset-left))', paddingRight: 'max(1.5rem, env(safe-area-inset-right))' }}>
                <Link to="/" className="flex items-center group relative z-[101]">
                    <div className="h-12 w-auto transition-transform duration-300 group-hover:scale-105">
                        <Logo showText={true} />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleSmoothScroll(e, link.href)}
                            className={`text-sm font-semibold transition-colors ${linkColor}`}
                        >
                            {link.name}
                        </a>
                    ))}
                    
                    <div className="h-5 w-px bg-slate-300" />
                    
                    <Link 
                        to="/login" 
                        className={`text-sm font-semibold transition-colors ${linkColor}`}
                    >
                        Log In
                    </Link>
                    
                    <Link 
                        to="/login" 
                        state={{ isSignUp: true }} 
                        className={`px-5 py-2.5 text-sm font-bold rounded-full transition-all transform hover:-translate-y-0.5 shadow-lg ${buttonClass}`}
                    >
                        Get Started
                    </Link>
                </nav>

                {/* Mobile Nav Button */}
                <div className="md:hidden relative z-[101]">
                    <button 
                        onClick={() => setIsOpen(!isOpen)} 
                        className={`p-2 rounded-full transition-colors ${menuButtonColor}`}
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Menu Overlay */}
            <div className={`fixed inset-0 bg-white z-[90] transition-transform duration-300 md:hidden flex flex-col pt-24 px-6 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))', paddingLeft: 'max(1.5rem, env(safe-area-inset-left))', paddingRight: 'max(1.5rem, env(safe-area-inset-right))' }}>
                <nav className="flex flex-col space-y-6 text-center">
                     {navLinks.map(link => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleSmoothScroll(e, link.href)}
                            className="text-2xl font-bold text-slate-800"
                        >
                            {link.name}
                        </a>
                    ))}
                    <hr className="border-slate-100" />
                    <Link 
                        to="/login" 
                        onClick={() => setIsOpen(false)} 
                        className="text-xl font-semibold text-slate-600"
                    >
                        Log In
                    </Link>
                    <Link 
                        to="/login" 
                        state={{ isSignUp: true }} 
                        onClick={() => setIsOpen(false)} 
                        className="bg-blue-600 text-white px-6 py-4 rounded-xl text-lg font-bold shadow-lg shadow-blue-500/30"
                    >
                        Get Started Free
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;