import React from 'react';

const Header = () => {
    return (
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 fixed w-full z-10">
            <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-orange-600">Fatia Perfeita</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                    Olá, <span className="font-semibold text-gray-800">Admin</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                </div>
            </div>
        </header>
    );
};

export default Header;
