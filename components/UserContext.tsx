/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { createContext, useState, ReactNode, useCallback } from 'react';

interface User {
  isLoggedIn: boolean;
  credits: number;
}

interface UserContextType {
  user: User;
  login: () => void;
  logout: () => void;
  spendCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    isLoggedIn: false,
    credits: 0,
  });

  const login = useCallback(() => {
    // In a real app, this would involve an auth flow.
    // Here we just mock a logged-in user with some starting credits.
    setUser({ isLoggedIn: true, credits: 10 });
  }, []);

  const logout = useCallback(() => {
    setUser({ isLoggedIn: false, credits: 0 });
  }, []);

  const spendCredits = useCallback((amount: number) => {
    if (user.credits >= amount) {
      setUser(prev => ({ ...prev, credits: prev.credits - amount }));
      return true;
    }
    return false;
  }, [user.credits]);

  const addCredits = useCallback((amount: number) => {
    setUser(prev => ({ ...prev, credits: prev.credits + amount }));
  }, []);

  const value = { user, login, logout, spendCredits, addCredits };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
