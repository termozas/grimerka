/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { useUser } from './useUser';
import { ShirtIcon, CreditCardIcon, LogOutIcon } from './icons';

interface HeaderProps {
  onOpenPaymentModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenPaymentModal }) => {
  const { user, logout } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 w-full py-3 px-4 md:px-6 bg-white/80 backdrop-blur-md border-b border-gray-200/60 z-40">
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShirtIcon className="w-6 h-6 text-gray-700" />
            <h1 className="text-xl font-serif tracking-widest text-gray-800 hidden sm:block">
                Virtual Try-On
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenPaymentModal}
              className="flex items-center gap-2 bg-gray-100/80 rounded-full px-3 py-1.5 border border-gray-200/80 hover:bg-gray-200/80 transition-colors cursor-pointer"
            >
                <CreditCardIcon className="w-5 h-5 text-gray-600" />
                <span className="font-bold text-gray-800 text-sm">{user.credits}</span>
                <span className="text-gray-600 text-sm hidden sm:inline">Credits</span>
            </button>
             <button
                onClick={logout}
                className="flex items-center justify-center text-center bg-white/60 border border-gray-300/80 text-gray-700 font-semibold py-1.5 px-3 rounded-full transition-all duration-200 ease-in-out hover:bg-white hover:border-gray-400 active:scale-95 text-sm backdrop-blur-sm"
              >
                <LogOutIcon className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
          </div>
      </div>
    </header>
  );
};

export default Header;