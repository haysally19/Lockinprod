import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer: React.FC = () => {
    const footerLinks = {
        'Product': [
            { name: 'Features', href: '#' },
            { name: 'Pricing', href: '#' },
            { name: 'Updates', href: '#' },
        ],
        'Company': [
            { name: 'About Us', href: '#' },
            { name: 'Careers', href: '#' },
            { name: 'Contact', href: '#' },
        ],
        'Legal': [
            { name: 'Privacy Policy', href: '#' },
            { name: 'Terms of Service', href: '#' },
        ],
    };

    return (
        <footer className="bg-white border-t border-slate-100" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
            <div className="container mx-auto px-6 py-16" style={{ paddingLeft: 'max(1.5rem, env(safe-area-inset-left))', paddingRight: 'max(1.5rem, env(safe-area-inset-right))' }}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                        <div className="h-12 w-auto mb-4">
                            <Logo showText={true} />
                        </div>
                        <p className="text-slate-500 max-w-xs">The ultimate AI-powered productivity suite for students.</p>
                    </div>
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                        {Object.entries(footerLinks).map(([title, links]) => (
                            <div key={title}>
                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">{title}</h3>
                                <ul className="mt-4 space-y-3">
                                    {links.map(link => (
                                        <li key={link.name}>
                                            <a href={link.href} className="text-slate-500 hover:text-blue-600 transition-colors">
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-100 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} Lockin AI. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;