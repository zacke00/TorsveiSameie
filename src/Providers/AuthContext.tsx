import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebaseConfig';  // Adjust path based on your setup

// Define a type for our context value
interface AuthContextType {
  user: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Define the AuthProvider component's props with children
interface AuthProviderProps {
  children: ReactNode;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a custom hook to use the AuthContext
export const useUserContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUserContext must be used within an AuthProvider');
  }
  return context;
};

// Define the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });

    // Cleanup the subscription when the component is unmounted
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, setCurrentUser: setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
