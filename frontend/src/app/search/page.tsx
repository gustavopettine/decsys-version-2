'use client'

import { Input } from "@/components/Input";
import { Sidebar } from "@/components/Sidebar";
import { UserInfo } from "@/components/UserInfo";
import { Wallet } from "lucide-react";
import { useState } from "react";
import { SearchService } from "@/services/search.service";

export default function Search() {
  const [walletAddress, setWalletAddress] = useState('');
  const [searchResult, setSearchResult] = useState<{ walletAddress: string; status: string } | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!walletAddress) {
      setSearchResult(null)
      setError('Por favor, insira o endereço uma de carteira.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await SearchService.searchUser(walletAddress);
      console.log(result)
      setSearchResult(result);
    } catch (err: any) {
      setError(err.message);
      setSearchResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:grid md:grid-cols-app dark:bg-zinc-900">
      <Sidebar />

      <main className="mt-28 md:mt-0 px-8 pb-12 pt-8">
        <h1 className="text-3xl font-medium dark:text-zinc-100">Buscar</h1>

        <div className="mt-5 flex items-center justify-between border-t border-b dark:border-zinc-800">
          <div className="pt-8 pb-5 space-y-1">
            <h2 className="text-lg font-medium dark:text-zinc-100">Consulta de usuários</h2>
            <span className="text-sm dark:text-zinc-400">Procure usuários validados pelo sistema.</span>
          </div>
        </div>

        <div className="mt-5 pb-5 flex w-full flex-col gap-5 border-b dark:border-zinc-800">
          <div className="flex flex-col md:grid grid-cols-input gap-3">
            <label htmlFor="walletAddress" className="text-sm font-medium dark:text-zinc-300">Endereço da carteira</label>
            <div className="flex items-center gap-3">
              <Input 
                icon={<Wallet className="h-5 w-5 dark:text-zinc-500" />}
                placeholder="0x123456789abcdef0123456789abcdef0123456789"
                value={walletAddress}
                onChange={(value) => setWalletAddress(value)}
              />
              <button 
                className="px-4 py-3 rounded-lg border text-base font-semibold outline-none shadow-sm dark:text-zinc-100 dark:bg-blue-500 dark:border-blue-500 dark:hover:bg-blue-600 dark:hover:border-blue-600 hidden md:block"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? 'Buscando...' : 'Enviar'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 pb-5 flex w-full flex-col gap-5 border-b dark:border-zinc-800 md:hidden">
          <div className="flex flex-col md:grid grid-cols-input gap-3">
            <div className="flex items-center justify-end gap-3">
              <button 
                className="px-4 py-3 rounded-lg border text-base font-semibold outline-none shadow-sm dark:text-zinc-100 dark:bg-blue-500 dark:border-blue-500 dark:hover:bg-blue-600 dark:hover:border-blue-600"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? 'Buscando...' : 'Enviar'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-5 text-red-500 dark:bg-red-900/20 p-3 rounded">
            {error}
          </div>
        )}

        {searchResult && (
          <div className="mt-5 pb-5 flex w-full flex-col gap-5 border-b dark:border-zinc-800">
            <div className="flex flex-col md:grid grid-cols-input gap-3">
              <label htmlFor="walletAddress" className="text-sm font-medium dark:text-zinc-300">Resultado</label>
              <div className="flex items-center gap-3">
                <UserInfo 
                  width="w-full" 
                  padding="px-3.5 py-3"
                  walletAddress={searchResult.walletAddress}
                  status={searchResult.status}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
