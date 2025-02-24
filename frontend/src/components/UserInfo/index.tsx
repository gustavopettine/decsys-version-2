"use client"

import getStatusText from "@/utils/getStatusText";
import { Copy, User, Wallet, CircleCheckBig } from "lucide-react";
import { useState } from "react";

export interface UserInfoProps {
  width?: string;
  padding?: string;
  walletAddress?: string;
  status?: string;
}

export function UserInfo({ 
  width, 
  padding, 
  walletAddress = '0x123456789abcdef0123456789abcdef0123456789',
  status = 'PENDING'
}: UserInfoProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setIsCopied(true);
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className={`mt-auto flex flex-col space-y-0.5 ${width}`}>
      <div className={`group flex items-center gap-3 rounded dark:hover:bg-zinc-800 ${padding ? padding : "px-3 py-2"}`}>
        <User className="h-5 w-5 dark:text-zinc-500 dark:group-hover:text-blue-500" />
        <span className="font-medium dark:text-zinc-100 dark:group-hover:text-blue-500">
          {getStatusText(status)}
        </span>
      </div>

      <div className={`group flex items-center gap-3 rounded dark:hover:bg-zinc-800 truncate ${padding ? padding : "px-3 py-2"}`}>
        <Wallet className="h-5 w-5 flex-shrink-0 dark:text-zinc-500 dark:group-hover:text-blue-500" />
        <span className="truncate font-medium dark:text-zinc-100 dark:group-hover:text-blue-500">
          {walletAddress}
        </span>
        <button 
          type="button" 
          className="ml-auto"
          onClick={handleCopyAddress}
        >
          {isCopied ? (
            <CircleCheckBig className="h-5 w-5 dark:text-zinc-500 dark:group-hover:text-blue-500" />
          ) : (
            <Copy className="h-5 w-5 dark:text-zinc-500 dark:group-hover:text-blue-500" />
          )}
        </button>
      </div>
    </div>
  );
}
