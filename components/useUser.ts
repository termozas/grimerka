/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useContext } from 'react';
import { UserContext } from './UserContext';

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
