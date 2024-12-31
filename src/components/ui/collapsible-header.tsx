import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleHeaderProps {
  title: string;
  isOpen: boolean;
  onClick: () => void;
}

export const CollapsibleHeader = ({ title, isOpen, onClick }: CollapsibleHeaderProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between group py-2"
    >
      <h6 className="text-base font-mono font-semibold text-accent-palm group-hover:opacity-80">
        {title}
      </h6>
      <ChevronDown 
        className={cn(
          "h-4 w-4 text-accent-palm transition-transform duration-200 group-hover:opacity-80",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
};