"use client"

import { Home, Search, IdCard, LogOut, Menu } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";
import Logo from "../Logo";
import { NavItem } from "../NavItem";
import { UserInfo } from "../UserInfo";
import * as Collapsible from "@radix-ui/react-collapsible"
import { parseCookies } from 'nookies'
import { SearchService } from "@/services/search.service";
import { useEffect, useState } from "react";

export function Sidebar() {
  const { signOut } = useAuth();  // Obtém a função signOut do context
  const router = useRouter();
  const cookies = parseCookies();
  const [isClient, setIsClient] = useState(false);
  const walletAddress = cookies['walletAddress'];
  const [searchResult, setSearchResult] = useState<{ walletAddress: string; status: string } | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = () => {
    signOut();
    router.push('/auth'); // Opcional: redireciona para página de login
  };

  useEffect(() => {
    setIsClient(true);
    
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

  // ⚠️ Evita renderizar no SSR para evitar diferenças entre Server e Client
  if (!isClient) return null;

  return (
    <Collapsible.Root className="fixed left-0 right-0 top-0 z-20 data-[state=open]:bottom-0 flex flex-col gap-6 px-5 py-8 border-b dark:border-zinc-800 dark:bg-zinc-900 md:right-auto md:w-80 md:border-r md:px-5 md:py-8 md:relative md:data-[state=closed]:bottom-0">
      <div className="flex items-center justify-between">
        <Logo />
        
        <Collapsible.Trigger asChild className="md:hidden">
          <button className="px-2 py-2 rounded-md text-base font-semibold outline-none shadow-sm dark:text-zinc-400 dark:hover:bg-white/5">
            <Menu className="h-6 w-6" />
          </button>
        </Collapsible.Trigger>
      </div>

      {/* <div className="flex w-full items-center gap-2 rounded-md border px-3 py-2 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:focus-within:border-blue-500 dark:focus-within:ring-blue-500/20">
        <Search className="h-5 w-5 dark:text-zinc-500" />
        
        <input 
          className="flex-1 border-0 bg-transparent p-0 outline-none dark:text-zinc-100 dark:placeholder-zinc-400"
          placeholder="Search"
        />
      </div> */}

      <Collapsible.Content forceMount className="flex flex-1 flex-col gap-6 data-[state=closed]:hidden md:data-[state=closed]:flex">
        <nav className="space-y-0.5">
          <NavItem title="Dashboard" icon={Home} href={"/dashboard"} />
          <NavItem title="Buscar" icon={Search} href={"/search"} />
          <NavItem title="Validação" icon={IdCard} href={"/validation"} />
        </nav>

        <UserInfo walletAddress={walletAddress} status={searchResult?.status} />

        <div className="h-px dark:bg-zinc-800" />

        <button type="button" onClick={handleSignOut} className="group flex items-center gap-3 rounded px-3 py-2 dark:hover:bg-zinc-800">
          <LogOut className="h-5 w-5 dark:text-zinc-500 dark:group-hover:text-blue-500" />
          <span className="font-medium dark:text-zinc-100 dark:group-hover:text-blue-500">Sair</span>
        </button>
      </Collapsible.Content>

    </Collapsible.Root>
  )
}
