/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { useEffect } from 'react'

interface User {
  isLoggedIn: boolean;
  id?: string;
  email?: string;
  credits: number;
}

interface UserContextType {
  user: User;
  login: () => void;
  logout: () => void;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  spendCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
  loading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    isLoggedIn: false,
    credits: 0,
  });
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleAuthUser(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await handleAuthUser(session.user);
        } else {
          setUser({ isLoggedIn: false, credits: 0 });
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthUser = async (authUser: SupabaseUser) => {
    try {
      // Get or create user credits
      let { data: userCredits, error } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', authUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // User doesn't exist, create with 10 starting credits
        const { data: newUserCredits, error: insertError } = await supabase
          .from('user_credits')
          .insert([{ user_id: authUser.id, credits: 10 }])
          .select('credits')
          .single();

        if (insertError) {
          console.error('Error creating user credits:', insertError);
          userCredits = { credits: 10 }; // Fallback
        } else {
          userCredits = newUserCredits;
        }
      } else if (error) {
        console.error('Error fetching user credits:', error);
        userCredits = { credits: 10 }; // Fallback
      }

      setUser({
        isLoggedIn: true,
        id: authUser.id,
        email: authUser.email,
        credits: userCredits?.credits || 10,
      });
    } catch (err) {
      console.error('Error handling auth user:', err);
      setUser({
        isLoggedIn: true,
        id: authUser.id,
        email: authUser.email,
        credits: 10, // Fallback
      });
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(() => {
    // This is now just for demo purposes - real auth happens via signIn/signUp
    setUser({ isLoggedIn: true, credits: 10 });
  }, []);

  const logout = useCallback(() => {
    supabase.auth.signOut();
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (err) {
      return { error: 'An unexpected error occurred' };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (err) {
      return { error: 'An unexpected error occurred' };
    }
  }, []);

  const spendCredits = useCallback((amount: number) => {
    if (user.credits >= amount && user.id) {
      setUser(prev => ({ ...prev, credits: prev.credits - amount }));
      
      // Update credits in database
      supabase
        .from('user_credits')
        .update({ credits: user.credits - amount })
        .eq('user_id', user.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error updating credits:', error);
            // Revert the local state if database update fails
            setUser(prev => ({ ...prev, credits: prev.credits + amount }));
          }
        });
      
      return true;
    }
    return false;
  }, [user.credits, user.id]);

  const addCredits = useCallback((amount: number) => {
    setUser(prev => ({ ...prev, credits: prev.credits + amount }));
    
    // Update credits in database
    if (user.id) {
      supabase
        .from('user_credits')
        .update({ credits: user.credits + amount })
        .eq('user_id', user.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error updating credits:', error);
          }
        });
    }
  }, [user.credits, user.id]);

  const value = { user, login, logout, signUp, signIn, spendCredits, addCredits, loading };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
