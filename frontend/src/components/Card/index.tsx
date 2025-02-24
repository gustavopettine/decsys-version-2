import { CircleCheck, IdCard } from "lucide-react";

interface ICard {
  title1: string;
  title2: string;
  subtitle: string;
  svg: React.ReactNode;
}

export default function Card({title1, title2, subtitle, svg}: ICard) {
  return (
    <div className="bg-blue-600 rounded-lg p-4 md:w-48 md:h-60 shadow-sm">
      <div className="w-full flex justify-center">
        {svg}
      </div>

      <h1 className="mt-4 text-xs md:text-lg">{title1}</h1>
      <h1 className="text-xs md:text-lg">{title2}</h1>

      <h2 className="mt-3 text-xs">
        {subtitle}
      </h2>

      <div className="mt-3 flex items-center gap-2">
        <CircleCheck className="w-4 h-4"/>
        <p className="text-sm">Validado</p>
      </div>
      
    </div>
  );
};