import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center dark:bg-black/80 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="w-full h-full shadow-sm dark:border-zinc-700 dark:bg-zinc-800 md:rounded-lg md:py-16 py-8 px-4 md:w-3/4 md:h-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3"
          onClick={onClose}
        >
          <X className="dark:text-zinc-500" />
        </button>
        {children}
      </div>
    </div>
  );
};
