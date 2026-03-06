import React from 'react';

const MobileHeader = () => {
    return (
        <header className="bg-white shadow-sm h-14 flex items-center justify-between px-4 sticky top-0 z-20 w-full">
            {/* Spacer to center title */}
            <div className="w-8"></div>

            <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-orange-600">🎂 Fatia Perfeita</span>
            </div>

            <button className="h-10 w-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
        </header>
    );
};

export default MobileHeader;
