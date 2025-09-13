/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from './useUser';
import { ShirtIcon } from './icons';
import Footer from './Footer';

const LoginScreen: React.FC = () => {
  const { login } = useUser();

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
       <motion.div
            key="login-screen"
            className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShirtIcon className="w-8 h-8 text-gray-700" />
              <h1 className="text-4xl font-serif tracking-widest text-gray-800">
                Virtual Try-On
              </h1>
            </div>
            <p className="text-gray-600 mb-8">
                Welcome to your personal virtual fitting room. Please log in to begin.
            </p>
            <button
                onClick={login}
                className="w-full py-3 px-6 text-lg font-semibold text-white bg-gray-900 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-700 active:scale-95"
            >
                Login to Start
            </button>
            <p className="text-xs text-gray-400 mt-6">
                This is a demo. Clicking login will simulate a user session with 10 free credits.
            </p>
      </motion.div>
      <Footer />
    </div>
  );
};

export default LoginScreen;