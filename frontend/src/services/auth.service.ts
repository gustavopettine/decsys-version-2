import { api } from '@/lib/axios';
import { ethers } from 'ethers';

export class AuthService {
  static async getNonce(walletAddress: string) {
    const { data: { nonce } } = await api.post('/auth/nonce', { walletAddress });
    return nonce;
  }

  static async signMessage(message: string) {
    if (!window.ethereum) {
      throw new Error('MetaMask não está instalado!');
    }
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return await signer.signMessage(message);
  }

  static async authenticate(walletAddress: string, signature: string) {
    const { data: { token } } = await api.post('/auth', {
      walletAddress,
      signature,
    });
    return token;
  }

  static async register(walletAddress: string) {
    const { data } = await api.post('/register', { walletAddress });
    return data;
  }
}
