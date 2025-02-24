import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export interface User {
  walletAddress: string;
}

export interface AuthContextData {
  user: User | null;
  signInWithMetaMask: () => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface UserResponse {
  walletAddress: string;
  status: string;
}

export type ApiError = {
  message: string;
  statusCode: number;
}
