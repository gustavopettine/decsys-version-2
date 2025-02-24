import { api } from '@/lib/axios';
import { UserResponse, ApiError } from '@/@types/auth';
import { AxiosError } from 'axios';

export class SearchService {
  static async searchUser(walletAddress: string): Promise<UserResponse> {
    try {
      if (!walletAddress.trim()) {
        throw new Error('Por favor, insira o endereço uma de carteira.');
      }

      const { data } = await api.get<UserResponse>(`/user/${walletAddress}`);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new Error('Carteira não encontrada no sistema.');
        }

        if (error.response?.status === 400) {
          throw new Error('Carteira Inválida.');
        }

        const apiError = error.response?.data as ApiError;
        throw new Error(apiError?.message || 'Erro ao buscar usuário.');
      }

      throw new Error('Erro ao conectar com o servidor.');
    }
  }
}
