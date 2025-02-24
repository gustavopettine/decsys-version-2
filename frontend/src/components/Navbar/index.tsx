"use client"
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { parseCookies } from 'nookies'
import Logo from "../Logo";
import { useEffect, useState } from "react";


export default function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter()
  const cookies = parseCookies();
  const walletAddress = cookies['walletAddress'];

  const connectRouteButton = () => {
    router.replace('/auth')
  }

  const redirectToDashboard = () => {
    router.replace('/dashboard')
  }

  useEffect(() => {
      setIsClient(true);
  }, [])

  if (!isClient) return null;

  return (
    <nav className="absolute top-0 left-0 w-full text-white border-b dark:border-zinc-800 md:border-none">
      <div className="max-w-[980px] mx-auto flex justify-between items-center px-5 py-8 lg:px-0">
        <Logo />

        <button
          onClick={walletAddress ? redirectToDashboard : connectRouteButton}
          className="w-22 md:w-32 md:h-11 px-4 py-2.5 rounded-lg text-sm font-semibold outline-none shadow-sm text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {walletAddress ? "Dashboard" : "Conectar-se"}
        </button>
      </div>
    </nav>
  );
};