"use client"

import { createContext, useState, ReactNode, useEffect } from 'react';
import { AuthContextData, AuthProviderProps, User } from '@/@types/auth';
import { AuthService } from '@/services/auth.service';
import { parseCookies, setCookie, destroyCookie } from 'nookies';

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const cookies = parseCookies();
    const savedToken = cookies['token'];
    const savedWalletAddress = cookies['walletAddress'];

    if (savedToken && savedWalletAddress) {
      setToken(savedToken);
      setUser({ walletAddress: savedWalletAddress });
    }
  }, []);

  async function signInWithMetaMask() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask não está instalado!');
    }

    try {
      const [account] = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      }) as string[];

      const walletAddress = account.toLowerCase();

      try {
        const nonce = await AuthService.getNonce(walletAddress);
        const message = `Login with nonce: ${nonce}`;
        const signature = await AuthService.signMessage(message);
        const authToken = await AuthService.authenticate(walletAddress, signature);

        setCookie(undefined, 'token', authToken, {
          maxAge: 60 * 60 * 24 * 7, // 7 dias
          path: '/'
        });

        setCookie(undefined, 'walletAddress', walletAddress, {
          maxAge: 60 * 60 * 24 * 7, // 7 dias
          path: '/'
        });
        
        setToken(authToken);
        setUser({ walletAddress });

      } catch (error: any) {
        if (error.response?.status === 400) {
          const { nonce } = await AuthService.register(walletAddress);
          const message = `Login with nonce: ${nonce}`;
          const signature = await AuthService.signMessage(message);
          const authToken = await AuthService.authenticate(walletAddress, signature);

          setCookie(undefined, 'token', authToken, {
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
          });

          setCookie(undefined, 'walletAddress', walletAddress, {
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
          });
          
          setToken(authToken);
          setUser({ walletAddress });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Erro durante autenticação:', error);
      throw error;
    }
  }

  function signOut() {
    setToken(null);
    setUser(null);
    destroyCookie(undefined, 'token', { path: '/' });
    destroyCookie(undefined, 'walletAddress', { path: '/' });
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      signInWithMetaMask, 
      signOut, 
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}
