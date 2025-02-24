"use client";

import { Check, User } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import formatCpf from "@/utils/formatCPF";

export interface ProgressBarProps {
  percentageValue: number;
  probabilityText?: string;
  userImage?: string;
  CPF?: string;
}

export default function Result({ probabilityText, percentageValue, userImage, CPF }: ProgressBarProps) {
  return (
      <main className="mt-28 md:mt-0 px-8 pb-12 pt-8">
        <h1 className="text-3xl font-medium dark:text-zinc-100">Validação</h1>

        <div className="mt-5 flex items-center justify-between border-t border-b dark:border-zinc-800">
          <div className="pt-8 pb-5 space-y-1">
            <h2 className="text-lg font-medium dark:text-zinc-100">Informações pessoais</h2>
            <span className="text-sm dark:text-zinc-400">Dados validados com suscesso.</span>
          </div>
        </div>

        <div className="mt-5 pb-5 flex w-full flex-col gap-5 border-b dark:border-zinc-800">
          <div className="flex flex-col md:grid grid-cols-input gap-3">
            <label htmlFor="walletAddress" className="text-sm font-medium dark:text-zinc-300">Resultado</label>
            <div className="flex flex-col gap-12 justify-between border py-7 px-8 rounded-lg shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              <div className="flex flex-col justify-between gap-8">
                <h1 className="text-lg">Dados principais</h1>

                <div className="flex items-center justify-center gap-4">
                  <Check className="dark:bg-blue-600 rounded-full" />

                  <div>
                    <p>CPF</p>
                    <p>{formatCpf(CPF ? CPF : "")}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                <div className="flex flex-col items-center justify-between gap-2">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full dark:bg-blue-500/10">
                    {userImage ? <img src={userImage} alt="" className="object-cover flex h-32 w-32 items-center justify-center rounded-full dark:bg-blue-500/10" /> : <User className="h-8 w-8" />}
                  </div>

                  <div className="py-0.5 px-1.5 dark:bg-blue-600 rounded-md">
                    <p>Real</p>
                  </div>
                </div>

                <ProgressBar 
                  percentageValue={percentageValue}
                  probabilityText={probabilityText} 
                />
              </div>
            </div>
          </div>
        </div>
      </main>
  );
};
