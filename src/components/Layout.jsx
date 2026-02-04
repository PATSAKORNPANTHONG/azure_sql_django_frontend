import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Store, ShoppingBag, Users, ShoppingCart, MessageSquare, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getApiConfig } from '../services/api';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const SidebarItem = ({ icon: Icon, label, to, active }) => (
    <Link
        to={to}
        className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
            active
                ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
        )}
    >
        <Icon size={20} className={cn("transition-transform group-hover:scale-110", active && "text-primary")} />
        <span className="font-medium">{label}</span>
    </Link>
);

const Layout = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { label: 'Dashboard', to: '/', icon: LayoutDashboard },
        { label: 'Stores', to: '/stores', icon: Store },
        { label: 'Products', to: '/products', icon: ShoppingBag },
        { label: 'Orders', to: '/orders', icon: ShoppingCart },
        { label: 'Customers', to: '/customers', icon: Users },
        // { label: 'Users', to: '/users', icon: Users }, // Commenting out Users as requested or implied replacement? No, let's keep both but maybe differentiate icons?
        // Actually the icon for Users is Users. Let's use UserCircle for Customers or something else if needed.
        // Wait, I should import a different icon if I want to distinguish.
        // Let's check imports. Users is imported as Users. 
        // I'll stick to Users icon for now but maybe change the label position?
        { label: 'Users', to: '/users', icon: Users },
    ];

    const apiConfig = getApiConfig();

    return (
        <div className="flex min-h-screen bg-background text-white selection:bg-accent/30 selection:text-accent">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-surface/50 backdrop-blur-xl flex-shrink-0 fixed h-full z-20">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="p-2 bg-gradient-to-tr from-primary to-accent rounded-lg shadow-lg shadow-primary/20">
                            <Zap size={24} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Nexus Admin
                        </h1>
                    </div>

                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <SidebarItem
                                key={item.to}
                                {...item}
                                active={location.pathname === item.to}
                            />
                        ))}
                    </nav>
                </div>

                <div className="absolute bottom-0 w-full p-6 border-t border-slate-800 bg-surface/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={cn("w-2 h-2 rounded-full animate-pulse", apiConfig.isLocal ? "bg-green-500" : "bg-blue-500")} />
                        <span className="text-xs font-medium text-slate-400">
                            {apiConfig.name}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-secondary to-accent" />
                        <div>
                            <p className="text-sm font-medium text-white">Admin User</p>
                            <p className="text-xs text-slate-500">admin@nexus.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 relative overflow-hidden">
                {/* Background glow effects */}
                <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 rounded-full blur-3xl -z-10 translate-y-[-50%]" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10 translate-y-[50%]" />

                <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
