/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
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
    const initializeAuth = async () => {
      console.log('Starting auth initialization...');
      try {
        // Check if Supabase is configured
        if (!isSupabaseConfigured) {
          console.log('Supabase not configured, using demo mode');
          setLoading(false);
          return;
        }

        console.log('Supabase configured, getting session...');
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        console.log('Session result:', session ? 'Found session' : 'No session');
        if (session?.user) {
          await handleAuthUser(session.user);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    let subscription: { unsubscribe: () => void } | null = null;
    
    if (isSupabaseConfigured) {
      console.log('Setting up auth state listener...');
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session ? 'with session' : 'no session');
          if (session?.user) {
            await handleAuthUser(session.user);
          } else {
            setUser({ isLoggedIn: false, credits: 0 });
            setLoading(false);
          }
        }
      );
      subscription = data.subscription;
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const handleAuthUser = async (authUser: SupabaseUser) => {
    console.log('Handling auth user:', authUser.email);
    try {
      // Check if Supabase is properly configured
      if (!isSupabaseConfigured) {
        console.log('Setting demo user');
        setUser({
          isLoggedIn: true,
          id: authUser.id,
          email: authUser.email,
          credits: 10,
        });
        setLoading(false);
        return;
      }

      console.log('Fetching user credits from database...');
      
      // Add shorter timeout to database operations
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 3000)
      );
      
      let userCredits = { credits: 10 }; // Default fallback
      
      try {
        // Get or create user credits with timeout
        const dbQuery = supabase
          .from('user_credits')
          .select('credits')
          .eq('user_id', authUser.id)
          .single();
          
        const result = await Promise.race([dbQuery, timeoutPromise]);
        const { data, error } = result;
        
        if (error && error.code === 'PGRST116') {
          console.log('User not found, creating new user with 10 credits');
          // User doesn't exist, create with 10 starting credits
          try {
            const insertQuery = supabase
              .from('user_credits')
              .insert([{ user_id: authUser.id, credits: 10 }])
              .select('credits')
              .single();
              
            const insertResult = await Promise.race([insertQuery, timeoutPromise]);
            const { data: newUserCredits, error: insertError } = insertResult;
            
            if (insertError) {
              console.error('Error creating user credits:', insertError);
            } else {
              userCredits = newUserCredits;
            }
          } catch (insertErr) {
            console.error('Insert operation failed:', insertErr);
            // Use fallback credits
          }
        } else if (error) {
          console.error('Error fetching user credits:', error);
        } else {
          userCredits = data;
        }
      } catch (dbError) {
        console.warn('Database operation failed or timed out, using fallback credits:', dbError);
        // Continue with fallback credits
      }

      console.log('Setting user with credits:', userCredits?.credits);
      setUser({
        isLoggedIn: true,
        id: authUser.id,
        email: authUser.email,
        credits: userCredits?.credits || 10,
      });
    } catch (err) {
      console.error('Error handling auth user:', err);
      // Always set user even if there are errors
      setUser({
        isLoggedIn: true,
        id: authUser.id,
        email: authUser.email,
        credits: 10, // Fallback
      });
    } finally {
      console.log('Auth initialization complete, setting loading to false');
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
