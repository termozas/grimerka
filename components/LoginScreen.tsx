/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from './useUser';
import { ShirtIcon } from './icons';
import Footer from './Footer';

const LoginScreen: React.FC = () => {
  const { login, signUp, signIn, loading } = useUser();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShirtIcon className="w-12 h-12 text-gray-700 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
       <motion.div
            key="login-screen"
            className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-center gap-3 mb-6 text-center">
              <ShirtIcon className="w-8 h-8 text-gray-700" />
              <h1 className="text-4xl font-serif tracking-widest text-gray-800">
                Virtual Try-On
              </h1>
            </div>
            <p className="text-gray-600 mb-8 text-center">
                Welcome to your personal virtual fitting room.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
              
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 text-lg font-semibold text-white bg-gray-900 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={login}
                className="w-full py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Continue as Demo User
              </button>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Demo mode gives you 10 free credits without registration
              </p>
            </div>
            </p>
      </motion.div>
      <Footer />
    </div>
  );
};

export default LoginScreen;