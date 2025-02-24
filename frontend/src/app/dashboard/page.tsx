"use client"

import { Sidebar } from "@/components/Sidebar";
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies'
import { SearchService } from "@/services/search.service";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const cookies = parseCookies();
  const walletAddress = cookies['walletAddress'];
  const [searchResult, setSearchResult] = useState<{ walletAddress: string; status: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      async function fetchData() {
        try {
          const result = await SearchService.searchUser(walletAddress);
          setSearchResult(result);
        } catch (error) {
          console.error("Erro ao buscar status:", error);
        } finally {
          setIsLoading(false);
        }
      }

      fetchData();
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsButtonDisabled(searchResult?.status === "VALIDATED")
  }, [searchResult])

  return (
    <div className="min-h-screen md:grid md:grid-cols-app dark:bg-zinc-900">
      <Sidebar />

      <main className="mt-28 md:mt-0 px-8 pb-12 pt-8">
        <h1 className="text-3xl font-medium dark:text-zinc-100">Início</h1>

        <div className="mt-5 pb-5 md:pb-0 flex flex-col md:flex-row items-start md:items-center justify-between border-t border-b dark:border-zinc-800">
          <div className="pt-8 pb-5 space-y-1">
            <h2 className="text-lg font-medium dark:text-zinc-100">Know Your Customer</h2>
            <span className="text-sm dark:text-zinc-400">Sua conformidade, nossa prioridade.</span>
          </div>

          <button onClick={() => router.push("/validation")} disabled={isButtonDisabled} className="px-4 py-3 rounded-md text-base font-semibold outline-none border shadow-sm dark:text-zinc-100 dark:bg-blue-500 dark:hover:bg-blue-600 dark:border-blue-500 dark:hover:border-blue-600">{isButtonDisabled ? "Usuário validado" : "Fazer validação"}</button>
        </div>

      </main>
    </div>
  )
}
