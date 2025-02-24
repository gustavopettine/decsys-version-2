"use client"

import Logo from "@/components/Logo"
import MetaMaskSvg from "@/components/MetaMaskSvg"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function Auth() {
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { signInWithMetaMask } = useAuth()
  const router = useRouter()

  const handleConnectMetaMask = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setHasError(true)
        setErrorMessage('MetaMask não está instalado!')
        return;
      }

      await signInWithMetaMask()
      router.push('/dashboard')
    } catch (error) {
      setHasError(true)
      setErrorMessage('Erro ao conectar. Tente novamente.')
      console.error("Erro:", error)
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-8 lg:px-0 lg:mx-auto lg:w-1/2">
      <div className="flex justify-center mt-8 cursor-pointer">
        <Logo onClick={() => router.push("/")}/>
      </div>

      <div className="flex flex-col justify-center items-center mt-12 md:mt-32">
        <h1 className="text-3xl font-semibold">Conectar-se</h1>
        <p className="text-center text-sm md:text-base mt-8">Conecte sua carteira para acessar o sistema e validar sua identidade. </p>
        <p className="text-center text-sm md:text-base mt-2 sm:mt-0">Escolha seu método preferido abaixo para continuar.</p>
      </div>

      <div className="flex flex-col justify-center items-center p-8 mt-8 max-w-96 border rounded-lg shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <button onClick={handleConnectMetaMask} className="w-full flex justify-center px-4 py-2.5 rounded-lg text-sm md:text-base outline-none shadow-sm text-white dark:bg-blue-500 dark:hover:bg-blue-600">
          <div className="flex items-center gap-3">
            <MetaMaskSvg className="w-6 h-6 lg:w-8 lg:h-8" />
            Continuar com MetaMask
          </div>
        </button>
        {hasError && <p className="text-xs md:text-sm text-center mt-2 md:mt-4 text-red-600">MetaMask não está instalado!</p>}
        <p className="text-xs md:text-sm text-center mt-8 md:mt-16">
          Ao continuar, o utilizador concorda com os <span className="dark:text-blue-500">Termos do Consumidor</span> e a <span className="dark:text-blue-500">Política de Utilização</span> da Decsys e reconhece a sua <span className="dark:text-blue-500">Política de Privacidade</span>.
        </p>
      </div>

    </div>
  )
}
