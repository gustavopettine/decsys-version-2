"use client";

import formatCpf from "@/utils/formatCPF";
import { useState } from "react"

export interface InputProps {
  icon: React.ReactNode;
  placeholder: string;
  type?: "walletAddress" | "cpf";
  value: string;
  onChange: (value: string) => void;
}

export function Input({ icon, placeholder, type = "walletAddress", onChange }: InputProps) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    if (type === "cpf") {
      newValue = formatCpf(newValue);
    }
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex w-full items-center gap-2 rounded-lg border px-3.5 py-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:focus-within:border-blue-500 dark:focus-within:ring-blue-500/20">
      {icon}
      <input 
        className="flex-1 border-0 bg-transparent p-0 outline-none dark:text-zinc-100 dark:placeholder-zinc-400" 
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        maxLength={type === "cpf" ? 14 : 42}
      />
    </div>
  )
}
