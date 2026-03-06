import React from 'react';
import MobileHeader from './MobileHeader';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import Header from './Header'; // Desktop header

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-x-hidden">

            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden md:block">
                <Sidebar />
                <div className="ml-64">
                    <Header />
                </div>
            </div>

            {/* Mobile Top Header - Visible only on mobile */}
            <div className="md:hidden">
                <MobileHeader />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 transition-all duration-300
                       md:ml-64 md:pt-12 md:px-12
                       pt-2 px-3 pb-24">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav - Visible only on mobile */}
            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
};

export default Layout;
